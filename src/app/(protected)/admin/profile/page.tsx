'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { stateOptions } from '@/lib/validation';
import {
  ArrowLeft,
  UserCog,
  CheckCircle,
  AlertCircle,
  Save,
} from 'lucide-react';

// Mirrors get_my_rep_profile() (migration 018). All nullable — a fresh rep has no row.
interface RepProfile {
  rep_first_name: string | null;
  rep_middle_initial: string | null;
  rep_last_name: string | null;
  rep_street: string | null;
  rep_apt: string | null;
  rep_city: string | null;
  rep_state: string | null;
  rep_zip: string | null;
  rep_country: string | null;
  rep_phone: string | null;
  rep_email: string | null;
  appointment_type: string | null;
  org_name: string | null;
  accreditation_number: string | null;
}

// The 21-22A appointment-type values (matches va-21-22a.ts appointmentType options).
const APPOINTMENT_TYPES: { label: string; value: string }[] = [
  { label: 'Attorney', value: 'Attorney' },
  { label: 'VA-accredited agent', value: 'Agent' },
  { label: 'Individual under 38 C.F.R. §14.630', value: 'Individual14630' },
  { label: 'Service Organization', value: 'ServiceOrg' },
];

const EMPTY: RepProfile = {
  rep_first_name: '',
  rep_middle_initial: '',
  rep_last_name: '',
  rep_street: '',
  rep_apt: '',
  rep_city: '',
  rep_state: '',
  rep_zip: '',
  rep_country: '',
  rep_phone: '',
  rep_email: '',
  appointment_type: '',
  org_name: '',
  accreditation_number: '',
};

export default function RepProfilePage() {
  const [form, setForm]       = useState<RepProfile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data, error: rpcErr } = await supabase.rpc('get_my_rep_profile');
      if (rpcErr) throw rpcErr;
      const row = Array.isArray(data) ? (data[0] as RepProfile | undefined) : undefined;
      if (row) {
        // Coalesce nulls to '' so the inputs stay controlled.
        setForm({
          rep_first_name:       row.rep_first_name ?? '',
          rep_middle_initial:   row.rep_middle_initial ?? '',
          rep_last_name:        row.rep_last_name ?? '',
          rep_street:           row.rep_street ?? '',
          rep_apt:              row.rep_apt ?? '',
          rep_city:             row.rep_city ?? '',
          rep_state:            row.rep_state ?? '',
          rep_zip:              row.rep_zip ?? '',
          rep_country:          row.rep_country ?? '',
          rep_phone:            row.rep_phone ?? '',
          rep_email:            row.rep_email ?? '',
          appointment_type:     row.appointment_type ?? '',
          org_name:             row.org_name ?? '',
          accreditation_number: row.accreditation_number ?? '',
        });
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to load your representative profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function set<K extends keyof RepProfile>(key: K, value: string) {
    setSaved(false);
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const supabase = createClient();
      const { error: rpcErr } = await supabase.rpc('upsert_my_rep_profile', {
        p_rep_first_name:       form.rep_first_name || null,
        p_rep_middle_initial:   form.rep_middle_initial || null,
        p_rep_last_name:        form.rep_last_name || null,
        p_rep_street:           form.rep_street || null,
        p_rep_apt:              form.rep_apt || null,
        p_rep_city:             form.rep_city || null,
        p_rep_state:            form.rep_state || null,
        p_rep_zip:              form.rep_zip || null,
        p_rep_country:          form.rep_country || null,
        p_rep_phone:            form.rep_phone || null,
        p_rep_email:            form.rep_email || null,
        p_appointment_type:     form.appointment_type || null,
        p_org_name:             form.org_name || null,
        p_accreditation_number: form.accreditation_number || null,
      });
      if (rpcErr) throw rpcErr;
      setSaved(true);
    } catch (err: any) {
      setError(err.message ?? 'Failed to save your representative profile.');
    } finally {
      setSaving(false);
    }
  }

  const isServiceOrg = form.appointment_type === 'ServiceOrg';

  const inputClass =
    'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-xs font-semibold text-slate-600 mb-1';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Back link */}
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="w-4 h-4" />
          Back to queue
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <UserCog className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">My Representative Profile</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              These details autofill your information on the VA 21-22A for every client you represent.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm">Something went wrong</p>
              <p className="text-sm text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading your profile…</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">

            {/* ── Name ── */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Name</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className={labelClass}>First Name</label>
                  <input className={inputClass} value={form.rep_first_name ?? ''} maxLength={30}
                    onChange={e => set('rep_first_name', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Middle Initial</label>
                  <input className={inputClass} value={form.rep_middle_initial ?? ''} maxLength={1}
                    onChange={e => set('rep_middle_initial', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input className={inputClass} value={form.rep_last_name ?? ''} maxLength={30}
                    onChange={e => set('rep_last_name', e.target.value)} />
                </div>
              </div>
            </div>

            {/* ── Mailing address ── */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Mailing Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Street Address</label>
                  <input className={inputClass} value={form.rep_street ?? ''} placeholder="456 Oak Ave"
                    onChange={e => set('rep_street', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Suite / Unit Number</label>
                  <input className={inputClass} value={form.rep_apt ?? ''} placeholder="Suite 200 (optional)"
                    onChange={e => set('rep_apt', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input className={inputClass} value={form.rep_city ?? ''}
                    onChange={e => set('rep_city', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <select className={inputClass} value={form.rep_state ?? ''}
                    onChange={e => set('rep_state', e.target.value)}>
                    <option value="">Select a state…</option>
                    {stateOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>ZIP Code</label>
                  <input className={inputClass} value={form.rep_zip ?? ''} maxLength={10} placeholder="12345"
                    onChange={e => set('rep_zip', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input className={inputClass} value={form.rep_country ?? ''} placeholder="Leave blank if USA"
                    onChange={e => set('rep_country', e.target.value)} />
                </div>
              </div>
            </div>

            {/* ── Contact ── */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Contact</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input className={inputClass} type="tel" value={form.rep_phone ?? ''}
                    onChange={e => set('rep_phone', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input className={inputClass} type="email" value={form.rep_email ?? ''}
                    onChange={e => set('rep_email', e.target.value)} />
                </div>
              </div>
            </div>

            {/* ── Accreditation ── */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Accreditation</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Type of Representative</label>
                  <select className={inputClass} value={form.appointment_type ?? ''}
                    onChange={e => set('appointment_type', e.target.value)}>
                    <option value="">Select a type…</option>
                    {APPOINTMENT_TYPES.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Accreditation Number</label>
                  <input className={inputClass} value={form.accreditation_number ?? ''}
                    onChange={e => set('accreditation_number', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Organization Name {isServiceOrg ? '' : '(optional)'}
                  </label>
                  <input className={inputClass} value={form.org_name ?? ''}
                    placeholder="e.g., Disabled American Veterans"
                    onChange={e => set('org_name', e.target.value)} />
                  {isServiceOrg && (
                    <p className="text-xs text-slate-400 mt-1">
                      The Veterans Service Organization you represent (Item 16B on the 21-22A).
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Save ── */}
            <div className="flex items-center gap-3">
              <Button type="submit" loading={saving} disabled={saving}>
                <Save className="w-4 h-4 mr-1.5" />
                {saving ? 'Saving…' : 'Save profile'}
              </Button>
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Saved.
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
