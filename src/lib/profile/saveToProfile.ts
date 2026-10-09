/**
 * saveFormAnswersToProfile
 *
 * After a veteran finishes any VA form, FormWizard calls this to write their
 * answers back to the profile tables so the next form pre-fills from them.
 * Only fields with a `profilePath` are considered, and the path decides the
 * destination:
 *
 *   profile.<col>               -> profiles           (one row per user, by id)
 *   directDeposit.<col>         -> direct_deposit     (one row per user, by user_id)
 *   servicePeriods[n].<col>     -> service_periods    (the nth row in sort_order)
 *   educationHistory[n].<col>   -> education_history  (the nth row in sort_order)
 *   employmentHistory[n].<col>  -> employment_history (the nth row in sort_order)
 *
 * The indexed tables are matched by POSITION in sort_order order, which is
 * exactly how useAutoFill reads them back, so re-submitting a form updates the
 * same rows the veteran saw pre-filled instead of adding duplicates. New rows
 * get the next free sort_order so they land after the existing ones.
 *
 * Values that are encrypted at rest never go through the browser Supabase
 * client (that would store them as plaintext). They are sent to the API
 * routes that hold the encryption key, in the same shape the profile page uses:
 *
 *   profile.ssn_encrypted                  -> PUT /api/profile        { ssn }
 *   profile.va_file_number                 -> PUT /api/profile        { va_file_number }
 *   directDeposit.routing_number_encrypted -> PUT /api/direct-deposit { routing_number }
 *   directDeposit.account_number_encrypted -> PUT /api/direct-deposit { account_number }
 *
 * Every write checks its result and reports failures with console.error. The
 * Supabase client resolves with an `error` instead of throwing, so an unchecked
 * call fails silently, which is how form answers used to vanish without a
 * trace. One table failing never blocks the others, and values are never
 * logged, only field ids, paths and column names.
 */

import { createClient } from '@/lib/supabase/client';
import type { FieldDef, FormDefinition } from '@/lib/forms/types';

// Fields that never write back: uploads and signature images are not profile data.
const SKIP_FIELD_TYPES = new Set(['document', 'signature']);

// Plaintext columns per table (supabase/migrations/001_initial_schema.sql and
// src/types/profile.ts). PostgREST rejects the WHOLE update when any one key is
// not a real column, so an unknown path (for example 22-1990's
// profile.address_apt2, which has no column) is dropped and reported instead of
// sinking every other field in the same write.
const PROFILE_COLUMNS = new Set([
  'first_name', 'middle_name', 'last_name', 'suffix', 'dob', 'sex', 'email',
  'phone_home', 'phone_mobile', 'address_street', 'address_apt', 'address_city',
  'address_state', 'address_zip', 'address_country', 'high_school_diploma',
  'high_school_diploma_date', 'faa_certificates', 'years_of_education',
]);
const DEPOSIT_COLUMNS = new Set(['account_type', 'bank_name']);
const SERVICE_COLUMNS = new Set([
  'branch', 'component', 'date_entered', 'date_separated', 'service_status',
  'character_of_discharge', 'involuntarily_called', 'national_guard_duty_type',
]);
const EDUCATION_COLUMNS = new Set([
  'institution', 'location', 'date_from', 'date_to', 'hours_count', 'hours_type', 'degree', 'major',
]);
const EMPLOYMENT_COLUMNS = new Set([
  'principal_occupation', 'license_or_rating', 'months_worked', 'before_or_after_service',
]);

type ApiRoute = '/api/profile' | '/api/direct-deposit';

// Columns stored encrypted. Keyed by the profilePath column name; the value is
// the route that encrypts it and the plain body key that route expects.
// digitsOnly matches the route's format check (9-digit routing, 4-17 digit account).
const ENCRYPTED_VIA_API: Record<string, { route: ApiRoute; key: string; digitsOnly?: boolean }> = {
  ssn_encrypted: { route: '/api/profile', key: 'ssn' },
  va_file_number: { route: '/api/profile', key: 'va_file_number' },
  routing_number_encrypted: { route: '/api/direct-deposit', key: 'routing_number', digitsOnly: true },
  account_number_encrypted: { route: '/api/direct-deposit', key: 'account_number', digitsOnly: true },
};

// Columns whose Postgres type is stricter than text. A value that cannot be
// converted is skipped (and reported) rather than sent, because one bad value
// would reject the whole row.
const COLUMN_KIND: Record<string, 'date' | 'integer' | 'boolean'> = {
  dob: 'date',
  high_school_diploma_date: 'date',
  date_entered: 'date',
  date_separated: 'date',
  date_from: 'date',
  date_to: 'date',
  years_of_education: 'integer',
  months_worked: 'integer',
  high_school_diploma: 'boolean',
  involuntarily_called: 'boolean',
};

type RowTableKey = 'servicePeriods' | 'educationHistory' | 'employmentHistory';

const ROW_TABLES: Record<RowTableKey, { table: string; columns: Set<string> }> = {
  servicePeriods: { table: 'service_periods', columns: SERVICE_COLUMNS },
  educationHistory: { table: 'education_history', columns: EDUCATION_COLUMNS },
  employmentHistory: { table: 'employment_history', columns: EMPLOYMENT_COLUMNS },
};

type Answers = Record<string, string | boolean>;
type RowBuckets = Map<number, Record<string, unknown>>;

type Target =
  | { kind: 'single'; table: 'profile' | 'directDeposit'; column: string }
  | { kind: 'row'; table: RowTableKey; index: number; column: string };

function parseProfilePath(path: string): Target | null {
  const single = path.match(/^(profile|directDeposit)\.(\w+)$/);
  if (single) return { kind: 'single', table: single[1] as 'profile' | 'directDeposit', column: single[2] };
  const row = path.match(/^(servicePeriods|educationHistory|employmentHistory)\[(\d+)\]\.(\w+)$/);
  if (row) return { kind: 'row', table: row[1] as RowTableKey, index: parseInt(row[2], 10), column: row[3] };
  return null;
}

/**
 * Mirrors the wizard's visibility rule: a step or field condition is met when
 * the referenced answer strictly equals the expected value. Hidden answers are
 * stale by definition and must not reach the profile.
 */
function conditionMet(condition: { field: string; value: string | boolean } | undefined, answers: Answers): boolean {
  return !condition || answers[condition.field] === condition.value;
}

/**
 * Convert a wizard answer to what the column accepts. Returns undefined when the
 * value is empty or cannot be represented, so the caller skips it.
 */
function normalizeValue(column: string, raw: string | boolean): unknown {
  const kind = COLUMN_KIND[column];
  if (typeof raw === 'boolean') return raw;

  const text = raw.trim();
  if (text === '') return undefined;

  switch (kind) {
    case 'date': {
      if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
      const us = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (us) return `${us[3]}-${us[1].padStart(2, '0')}-${us[2].padStart(2, '0')}`;
      return undefined;
    }
    case 'integer': {
      const n = Number(text);
      return Number.isFinite(n) ? Math.round(n) : undefined;
    }
    case 'boolean': {
      const lower = text.toLowerCase();
      if (lower === 'true' || lower === 'yes') return true;
      if (lower === 'false' || lower === 'no') return false;
      return undefined;
    }
    default:
      return text;
  }
}

function report(message: string, detail?: unknown) {
  if (detail === undefined) console.error(`[saveToProfile] ${message}`);
  else console.error(`[saveToProfile] ${message}`, detail);
}

/** Run one write group; a thrown error (network, etc.) is logged, never propagated. */
async function guarded(label: string, work: () => Promise<void>): Promise<void> {
  try {
    await work();
  } catch (err) {
    report(`${label} failed:`, err);
  }
}

export async function saveFormAnswersToProfile(
  userId: string,
  form: FormDefinition,
  answers: Record<string, string | boolean>,
): Promise<void> {
  if (!userId || !form || !answers) return;

  const supabase = createClient();

  const profileUpdates: Record<string, unknown> = {};
  const depositUpdates: Record<string, unknown> = {};
  const rowUpdates: Record<RowTableKey, RowBuckets> = {
    servicePeriods: new Map(),
    educationHistory: new Map(),
    employmentHistory: new Map(),
  };
  const apiBodies: Record<ApiRoute, Record<string, string>> = {
    '/api/profile': {},
    '/api/direct-deposit': {},
  };

  const describe = (field: FieldDef) => `field "${field.id}" (${field.profilePath})`;

  for (const step of form.steps) {
    if (!conditionMet(step.condition, answers)) continue;

    for (const field of step.fields) {
      if (!field.profilePath || SKIP_FIELD_TYPES.has(field.type)) continue;
      if (!conditionMet(field.condition, answers)) continue;

      const raw = answers[field.id];
      if (raw === undefined || raw === null || raw === '') continue;

      const target = parseProfilePath(field.profilePath);
      if (!target) {
        report(`${describe(field)} has a profilePath this writer does not understand; skipped.`);
        continue;
      }

      // Encrypted-at-rest columns go through the API that holds the key.
      const encrypted = target.kind === 'single' ? ENCRYPTED_VIA_API[target.column] : undefined;
      if (encrypted) {
        if (typeof raw !== 'string') continue;
        const text = encrypted.digitsOnly ? raw.replace(/\D/g, '') : raw.trim();
        if (text) apiBodies[encrypted.route][encrypted.key] = text;
        continue;
      }

      // Anything sensitive that does NOT map to an encrypted column is never
      // written in plaintext.
      if (field.type === 'ssn' || field.sensitive === true) {
        report(`${describe(field)} is sensitive but its profilePath is not an encrypted column; skipped.`);
        continue;
      }

      const value = normalizeValue(target.column, raw);
      if (value === undefined) {
        report(`${describe(field)} could not be converted for column "${target.column}"; skipped.`);
        continue;
      }

      if (target.kind === 'single') {
        const allowed = target.table === 'profile' ? PROFILE_COLUMNS : DEPOSIT_COLUMNS;
        if (!allowed.has(target.column)) {
          report(`${describe(field)} targets unknown column "${target.column}"; skipped so the other fields still save.`);
          continue;
        }
        (target.table === 'profile' ? profileUpdates : depositUpdates)[target.column] = value;
      } else {
        if (!ROW_TABLES[target.table].columns.has(target.column)) {
          report(`${describe(field)} targets unknown column "${target.column}"; skipped so the other fields still save.`);
          continue;
        }
        const buckets = rowUpdates[target.table];
        const bucket = buckets.get(target.index) ?? {};
        bucket[target.column] = value;
        buckets.set(target.index, bucket);
      }
    }
  }

  // ── profiles ──────────────────────────────────────────────────────────────
  // Upsert rather than update: an update that matches no row (no profile row,
  // or an expired session filtered out by RLS) reports success with 0 rows.
  const writeProfile = async () => {
    const columns = Object.keys(profileUpdates);
    if (columns.length === 0) return;
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...profileUpdates }, { onConflict: 'id' })
      .select('id');
    if (error) report(`profiles upsert failed for columns [${columns.join(', ')}]:`, error.message);
    else if (!data?.length) report('profiles upsert affected no row (is the session still valid?).');
  };

  // ── direct_deposit (plaintext columns only) ───────────────────────────────
  const writeDeposit = async () => {
    const columns = Object.keys(depositUpdates);
    if (columns.length === 0) return;
    const { data, error } = await supabase
      .from('direct_deposit')
      .upsert({ user_id: userId, ...depositUpdates }, { onConflict: 'user_id' })
      .select('id');
    if (error) report(`direct_deposit upsert failed for columns [${columns.join(', ')}]:`, error.message);
    else if (!data?.length) report('direct_deposit upsert affected no row (is the session still valid?).');
  };

  // ── encrypted values via the API routes ───────────────────────────────────
  const putEncrypted = async (route: ApiRoute) => {
    const body = apiBodies[route];
    const keys = Object.keys(body);
    if (keys.length === 0) return;
    const res = await fetch(route, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => null);
      report(`PUT ${route} failed (${res.status}) for [${keys.join(', ')}]:`, detail?.error ?? res.statusText);
    }
  };

  // ── service_periods / education_history / employment_history ──────────────
  // Rows are matched by position in sort_order order (what useAutoFill shows
  // the veteran), updated in place when present, inserted after the existing
  // rows otherwise. Re-submitting therefore updates instead of duplicating.
  const writeRows = async (key: RowTableKey) => {
    const buckets = rowUpdates[key];
    if (buckets.size === 0) return;
    const { table } = ROW_TABLES[key];

    const { data: existing, error: readError } = await supabase
      .from(table)
      .select('id, sort_order')
      .eq('user_id', userId)
      .order('sort_order')
      .order('created_at');
    if (readError) {
      report(`${table} read failed; nothing written:`, readError.message);
      return;
    }

    const rows: { id: string; sort_order: number | null }[] = existing ?? [];
    let nextSort = rows.reduce((max, r) => Math.max(max, r.sort_order ?? -1), -1) + 1;

    for (const index of Array.from(buckets.keys()).sort((a, b) => a - b)) {
      const updates = buckets.get(index)!;
      const columns = Object.keys(updates);
      const row = rows[index];
      if (row) {
        const { data, error } = await supabase.from(table).update(updates).eq('id', row.id).select('id');
        if (error) report(`${table} row ${index} update failed for [${columns.join(', ')}]:`, error.message);
        else if (!data?.length) report(`${table} row ${index} update affected no row (is the session still valid?).`);
      } else {
        const { error } = await supabase
          .from(table)
          .insert({ ...updates, user_id: userId, sort_order: nextSort++ });
        if (error) report(`${table} row ${index} insert failed for [${columns.join(', ')}]:`, error.message);
      }
    }
  };

  await Promise.all([
    guarded('profiles write', writeProfile),
    guarded('direct_deposit write', writeDeposit),
    guarded('PUT /api/profile', () => putEncrypted('/api/profile')),
    guarded('PUT /api/direct-deposit', () => putEncrypted('/api/direct-deposit')),
    guarded('service_periods write', () => writeRows('servicePeriods')),
    guarded('education_history write', () => writeRows('educationHistory')),
    guarded('employment_history write', () => writeRows('employmentHistory')),
  ]);
}
