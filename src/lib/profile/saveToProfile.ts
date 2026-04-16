/**
 * saveFormAnswersToProfile
 *
 * After a user fills out any VA form, call this to persist their answers back
 * to the profile tables. This enables cross-form pre-filling: data entered in
 * one form automatically appears in future forms.
 *
 * Handles four tables:
 *   profiles           – profile.* paths
 *   direct_deposit     – directDeposit.* paths
 *   service_periods    – servicePeriods[n].* paths
 *   education_history  – educationHistory[n].* paths
 *   employment_history – employmentHistory[n].* paths
 */

import { createClient } from '@/lib/supabase/client';
import type { FormDefinition } from '@/lib/forms/types';

// Fields that should NOT be written back (document/signature metadata, UI-only)
const SKIP_FIELD_TYPES = new Set(['document', 'signature']);

export async function saveFormAnswersToProfile(
  userId: string,
  form: FormDefinition,
  answers: Record<string, string | boolean>,
): Promise<void> {
  if (!userId || !form || !answers) return;

  const supabase = createClient();

  // Buckets for grouped updates
  const profileUpdates: Record<string, unknown> = {};
  const depositUpdates: Record<string, unknown> = {};
  const serviceUpdates: Record<number, Record<string, unknown>> = {};
  const educationUpdates: Record<number, Record<string, unknown>> = {};
  const employmentUpdates: Record<number, Record<string, unknown>> = {};

  // Walk every field in the form
  for (const step of form.steps) {
    for (const field of step.fields) {
      if (!field.profilePath) continue;
      if (SKIP_FIELD_TYPES.has(field.type)) continue;

      const value = answers[field.id];
      // Don't persist empty / untouched values
      if (value === undefined || value === null || value === '') continue;

      const path = field.profilePath;

      if (path.startsWith('profile.')) {
        profileUpdates[path.slice('profile.'.length)] = value;
      } else if (path.startsWith('directDeposit.')) {
        depositUpdates[path.slice('directDeposit.'.length)] = value;
      } else {
        // Array path: servicePeriods[0].date_entered → table=servicePeriods, index=0, col=date_entered
        const m = path.match(/^(\w+)\[(\d+)\]\.(.+)$/);
        if (!m) continue;
        const [, tableKey, indexStr, col] = m;
        const idx = parseInt(indexStr, 10);

        if (tableKey === 'servicePeriods') {
          if (!serviceUpdates[idx]) serviceUpdates[idx] = {};
          serviceUpdates[idx][col] = value;
        } else if (tableKey === 'educationHistory') {
          if (!educationUpdates[idx]) educationUpdates[idx] = {};
          educationUpdates[idx][col] = value;
        } else if (tableKey === 'employmentHistory') {
          if (!employmentUpdates[idx]) employmentUpdates[idx] = {};
          employmentUpdates[idx][col] = value;
        }
      }
    }
  }

  // ── profiles ──────────────────────────────────────────────────────────────
  if (Object.keys(profileUpdates).length > 0) {
    await supabase.from('profiles').update(profileUpdates).eq('id', userId);
  }

  // ── direct_deposit ────────────────────────────────────────────────────────
  if (Object.keys(depositUpdates).length > 0) {
    // Check if a record already exists
    const { data: existing } = await supabase
      .from('direct_deposit')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing?.id) {
      await supabase.from('direct_deposit').update(depositUpdates).eq('id', existing.id);
    } else {
      await supabase.from('direct_deposit').insert({ ...depositUpdates, user_id: userId });
    }
  }

  // ── service_periods ───────────────────────────────────────────────────────
  if (Object.keys(serviceUpdates).length > 0) {
    const { data: existingRows } = await supabase
      .from('service_periods')
      .select('id, sort_order')
      .eq('user_id', userId)
      .order('sort_order');

    for (const [idxStr, updates] of Object.entries(serviceUpdates)) {
      const idx = parseInt(idxStr, 10);
      const row = existingRows?.find(r => r.sort_order === idx);
      if (row) {
        await supabase.from('service_periods').update(updates).eq('id', row.id);
      } else {
        await supabase.from('service_periods').insert({ ...updates, user_id: userId, sort_order: idx });
      }
    }
  }

  // ── education_history ─────────────────────────────────────────────────────
  if (Object.keys(educationUpdates).length > 0) {
    const { data: existingRows } = await supabase
      .from('education_history')
      .select('id, sort_order')
      .eq('user_id', userId)
      .order('sort_order');

    for (const [idxStr, updates] of Object.entries(educationUpdates)) {
      const idx = parseInt(idxStr, 10);
      const row = existingRows?.find(r => r.sort_order === idx);
      if (row) {
        await supabase.from('education_history').update(updates).eq('id', row.id);
      } else {
        await supabase.from('education_history').insert({ ...updates, user_id: userId, sort_order: idx });
      }
    }
  }

  // ── employment_history ────────────────────────────────────────────────────
  if (Object.keys(employmentUpdates).length > 0) {
    const { data: existingRows } = await supabase
      .from('employment_history')
      .select('id, sort_order')
      .eq('user_id', userId)
      .order('sort_order');

    for (const [idxStr, updates] of Object.entries(employmentUpdates)) {
      const idx = parseInt(idxStr, 10);
      const row = existingRows?.find(r => r.sort_order === idx);
      if (row) {
        await supabase.from('employment_history').update(updates).eq('id', row.id);
      } else {
        await supabase.from('employment_history').insert({ ...updates, user_id: userId, sort_order: idx });
      }
    }
  }
}
