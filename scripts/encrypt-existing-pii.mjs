/**
 * One-time backfill: encrypt any PLAINTEXT PII already stored in the database.
 *
 * Encrypts profiles.ssn_encrypted, direct_deposit.routing_number_encrypted /
 * account_number_encrypted, and dependents.ssn_encrypted using the SAME
 * AES-256-GCM scheme as src/lib/encryption.ts.
 *
 * SAFETY (this DB has real users):
 *   • Dry-run by default — prints what it WOULD change and writes nothing.
 *     Add `--apply` to actually write.
 *   • Idempotent — a value that already decrypts cleanly is left untouched, so
 *     it never double-encrypts and is safe to re-run.
 *   • Only touches values it positively identifies as plaintext (decrypt fails).
 *   • TAKE A DATABASE BACKUP before running with --apply
 *     (Supabase Dashboard → Database → Backups, or pg_dump).
 *
 * Required env (export them, or put them in .env.local which this loads):
 *   NEXT_PUBLIC_SUPABASE_URL       your project URL
 *   SUPABASE_SERVICE_ROLE_KEY      service-role key (Dashboard → Settings → API)
 *   ENCRYPTION_KEY                 the SAME 64-char hex key the app uses
 *
 * Usage:
 *   node scripts/encrypt-existing-pii.mjs            # dry run (no writes)
 *   node scripts/encrypt-existing-pii.mjs --apply    # encrypt plaintext rows
 */
import { readFileSync } from 'fs';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { createClient } from '@supabase/supabase-js';

// ── load .env.local (best effort) so the script is easy to run ───────────────
try {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* no .env.local — rely on real env */ }

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ENC_KEY = process.env.ENCRYPTION_KEY;
const APPLY = process.argv.includes('--apply');

if (!URL || !SERVICE_KEY || !ENC_KEY) {
  console.error('Missing env. Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ENCRYPTION_KEY.');
  process.exit(1);
}

// ── crypto (identical scheme to src/lib/encryption.ts) ───────────────────────
const ALGO = 'aes-256-gcm', IV_LEN = 16, TAG_LEN = 16;
const key = Buffer.from(ENC_KEY, 'hex');
function encrypt(plaintext) {
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), enc]).toString('base64');
}
function isEncrypted(value) {
  try {
    const data = Buffer.from(value, 'base64');
    const iv = data.subarray(0, IV_LEN);
    const tag = data.subarray(IV_LEN, IV_LEN + TAG_LEN);
    const enc = data.subarray(IV_LEN + TAG_LEN);
    const d = createDecipheriv(ALGO, key, iv);
    d.setAuthTag(tag);
    d.update(enc); d.final('utf8');
    return true;   // decrypted cleanly → already ciphertext
  } catch {
    return false;  // not our ciphertext → treat as plaintext
  }
}

const db = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

const TARGETS = [
  { table: 'profiles',       cols: ['ssn_encrypted'] },
  { table: 'direct_deposit', cols: ['routing_number_encrypted', 'account_number_encrypted'] },
  { table: 'dependents',     cols: ['ssn_encrypted'] },
];

console.log(`\nPII backfill — ${APPLY ? 'APPLY (will write)' : 'DRY RUN (no writes)'}\n`);
let grandPlain = 0, grandEnc = 0, grandErr = 0;

for (const { table, cols } of TARGETS) {
  const { data: rows, error } = await db.from(table).select(['id', ...cols].join(','));
  if (error) { console.log(`  ${table}: ERROR reading — ${error.message}`); grandErr++; continue; }

  let plain = 0, already = 0, empty = 0, wrote = 0;
  for (const row of rows ?? []) {
    const update = {};
    for (const col of cols) {
      const v = row[col];
      if (v == null || v === '') { empty++; continue; }
      if (isEncrypted(v)) { already++; continue; }
      plain++;
      update[col] = encrypt(v);
    }
    if (Object.keys(update).length && APPLY) {
      const { error: upErr } = await db.from(table).update(update).eq('id', row.id);
      if (upErr) { console.log(`  ${table}#${row.id}: write failed — ${upErr.message}`); grandErr++; }
      else wrote += Object.keys(update).length;
    }
  }
  console.log(`  ${table.padEnd(16)} rows=${(rows ?? []).length}  plaintext=${plain}  alreadyEncrypted=${already}  empty=${empty}${APPLY ? `  encrypted=${wrote}` : ''}`);
  grandPlain += plain; grandEnc += wrote;
}

console.log(`\n${APPLY
  ? `Done. Encrypted ${grandEnc} value(s). Errors: ${grandErr}.`
  : `Found ${grandPlain} plaintext value(s). Re-run with --apply to encrypt them (back up first). Errors: ${grandErr}.`}\n`);
