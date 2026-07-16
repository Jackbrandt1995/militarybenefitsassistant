'use client';

import { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/hooks/useProfile';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { z } from 'zod';
import {
  branchOptions, dischargeOptions, stateOptions,
  ssnSchema, phoneSchema, zipSchema, emailSchema, routingNumberSchema,
} from '@/lib/validation';
import { ChevronDown, ChevronUp, Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import type { Profile, ServicePeriod, EducationRecord, EmploymentRecord, DirectDeposit } from '@/types/profile';

// Matches the server-side check in /api/direct-deposit.
const accountNumberSchema = z.string().regex(/^\d{4,17}$/, 'Account number must be 4 to 17 digits, with no spaces or dashes');

// Format checks for blur-saved fields, keyed by field name. Empty values are
// always allowed — every profile field is optional; format is only checked when
// a value is present, so bad data never lands on a generated VA form.
const VALIDATORS: Record<string, z.ZodString> = {
  ssn: ssnSchema,
  email: emailSchema,
  phone_home: phoneSchema,
  phone_mobile: phoneSchema,
  address_zip: zipSchema,
  routing_number: routingNumberSchema,
  account_number: accountNumberSchema,
};

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {open ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t">{children}</div>}
    </div>
  );
}

export default function ProfilePage() {
  const {
    profile: data, loading,
    updateProfile,
    addServicePeriod, deleteServicePeriod, updateServicePeriod,
    addEducation, deleteEducation, updateEducation,
    addEmployment, deleteEmployment, updateEmployment,
  } = useProfile();

  // Local state for editable fields
  const [lp, setLp] = useState<Partial<Profile>>({});
  const [lsp, setLsp] = useState<ServicePeriod[]>([]);
  const [led, setLed] = useState<EducationRecord[]>([]);
  const [lemp, setLemp] = useState<EmploymentRecord[]>([]);
  const [ldd, setLdd] = useState<Partial<DirectDeposit>>({});
  // Autosave indicator: 'Saving…' while any blur-save is in flight, then a brief
  // 'All changes saved' confirmation.
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  // Per-field validation/save errors, rendered through Input's `error` prop
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  // Save failures that don't belong to a specific input
  const [saveError, setSaveError] = useState('');
  // Show/hide toggles for the masked sensitive inputs
  const [showSSN, setShowSSN] = useState(false);
  const [showRouting, setShowRouting] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const pendingSaves = useRef(0);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Last successfully saved values for the sensitive fields, so tabbing through
  // an untouched field doesn't fire a request, while a failed save can still be
  // retried by blurring again.
  const lastSaved = useRef<Record<string, string>>({});

  // Initialize local state from fetched data
  useEffect(() => {
    if (data) {
      setLp(data.profile);
      setLsp(data.servicePeriods);
      setLed(data.educationHistory);
      setLemp(data.employmentHistory);
      setLdd(data.directDeposit || {});
      lastSaved.current = {
        ssn: data.profile?.ssn_encrypted || '',
        va_file_number: data.profile?.va_file_number || '',
        routing_number: data.directDeposit?.routing_number_encrypted || '',
        account_number: data.directDeposit?.account_number_encrypted || '',
      };
    }
  }, [data]);

  // Clear any pending 'All changes saved' timer on unmount
  useEffect(() => () => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
      </div>
    );
  }

  // Profile field helpers
  const setField = (field: string, value: string | boolean | number | null) => {
    setLp(prev => ({ ...prev, [field]: value }));
  };

  // Track in-flight blur-saves so the indicator shows 'Saving…' until the last
  // one lands, then flashes 'All changes saved'.
  const beginSave = () => {
    pendingSaves.current += 1;
    if (savedTimer.current) clearTimeout(savedTimer.current);
    setSaveState('saving');
  };

  const endSave = (ok: boolean) => {
    pendingSaves.current = Math.max(0, pendingSaves.current - 1);
    if (pendingSaves.current === 0) {
      if (ok) {
        setSaveState('saved');
        savedTimer.current = setTimeout(() => setSaveState('idle'), 2500);
      } else {
        setSaveState('idle');
      }
    }
  };

  const setFieldError = (field: string, message: string | null) => {
    setFieldErrors(prev => {
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  // Format-check a field before saving. A bad format blocks the save and shows
  // the message inline; clearing or fixing the value clears the message.
  const validateField = (field: string, value: string): boolean => {
    const schema = VALIDATORS[field];
    if (!schema || !value) {
      setFieldError(field, null);
      return true;
    }
    const result = schema.safeParse(value);
    setFieldError(field, result.success ? null : result.error.issues[0].message);
    return result.success;
  };

  const saveField = async (field: string, value: string | boolean | number | null) => {
    beginSave();
    try {
      await updateProfile({ [field]: value } as Partial<Profile>);
    } finally {
      endSave(true);
    }
  };

  // Blur-save for fields that have a format check (email, phones, ZIP).
  const saveValidatedField = async (field: string, value: string) => {
    if (!validateField(field, value)) return;
    await saveField(field, value);
  };

  // SSN and VA file number are sensitive — saved through the encrypting API
  // route (which encrypts them), never a direct plaintext write.
  const saveSSN = async (value: string) => {
    if (value === lastSaved.current.ssn) return; // untouched — nothing to save
    if (!validateField('ssn', value)) return;
    beginSave();
    let ok = false;
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ssn: value }),
      });
      ok = res.ok;
      if (res.ok) {
        lastSaved.current.ssn = value;
        setFieldError('ssn', null);
      } else {
        const body = await res.json().catch(() => null);
        setFieldError('ssn', body?.error || 'Your SSN could not be saved. Please try again.');
      }
    } catch {
      setFieldError('ssn', 'Your SSN could not be saved — check your connection and try again.');
    } finally {
      endSave(ok);
    }
  };

  const saveVAFile = async (value: string) => {
    if (value === lastSaved.current.va_file_number) return; // untouched
    beginSave();
    let ok = false;
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ va_file_number: value }),
      });
      ok = res.ok;
      if (res.ok) {
        lastSaved.current.va_file_number = value;
        setFieldError('va_file_number', null);
      } else {
        const body = await res.json().catch(() => null);
        setFieldError('va_file_number', body?.error || 'Your VA file number could not be saved. Please try again.');
      }
    } catch {
      setFieldError('va_file_number', 'Your VA file number could not be saved — check your connection and try again.');
    } finally {
      endSave(ok);
    }
  };

  // Service period helpers
  const setSPField = (id: string, field: string, value: string) => {
    setLsp(prev => prev.map(sp => sp.id === id ? { ...sp, [field]: value } : sp));
  };

  const saveSPField = async (id: string, field: string, value: string) => {
    beginSave();
    try {
      await updateServicePeriod(id, { [field]: value } as Partial<ServicePeriod>);
    } finally {
      endSave(true);
    }
  };

  // Education helpers
  const setEdField = (id: string, field: string, value: string) => {
    setLed(prev => prev.map(ed => ed.id === id ? { ...ed, [field]: value } : ed));
  };

  const saveEdField = async (id: string, field: string, value: string) => {
    beginSave();
    try {
      await updateEducation(id, { [field]: value } as Partial<EducationRecord>);
    } finally {
      endSave(true);
    }
  };

  // Employment helpers
  const setEmpField = (id: string, field: string, value: string | number | null) => {
    setLemp(prev => prev.map(emp => emp.id === id ? { ...emp, [field]: value } : emp));
  };

  const saveEmpField = async (id: string, field: string, value: string | number | null) => {
    beginSave();
    try {
      await updateEmployment(id, { [field]: value } as Partial<EmploymentRecord>);
    } finally {
      endSave(true);
    }
  };

  // Direct deposit helpers
  const setDDField = (field: string, value: string) => {
    setLdd(prev => ({ ...prev, [field]: value }));
  };

  // All direct-deposit writes go through the encrypting API route (single write
  // path; routing/account are encrypted server-side, the rest upserted as-is).
  const saveDDField = async (field: string, value: string) => {
    beginSave();
    let ok = false;
    try {
      const res = await fetch('/api/direct-deposit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      ok = res.ok;
      if (res.ok) {
        setSaveError('');
      } else {
        const body = await res.json().catch(() => null);
        setSaveError(body?.error || 'Your direct deposit info could not be saved. Please try again.');
      }
    } catch {
      setSaveError('Your direct deposit info could not be saved — check your connection and try again.');
    } finally {
      endSave(ok);
    }
  };

  // Routing/account numbers are sensitive — send the plain field names so the API
  // route encrypts them (the inputs display the decrypted value in *_encrypted).
  const saveBank = async (field: 'routing_number' | 'account_number', value: string) => {
    if (value === lastSaved.current[field]) return; // untouched — nothing to save
    if (!validateField(field, value)) return;
    beginSave();
    let ok = false;
    try {
      const res = await fetch('/api/direct-deposit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      ok = res.ok;
      if (res.ok) {
        lastSaved.current[field] = value;
        setFieldError(field, null);
      } else {
        const body = await res.json().catch(() => null);
        setFieldError(field, body?.error || 'This could not be saved. Please try again.');
      }
    } catch {
      setFieldError(field, 'This could not be saved — check your connection and try again.');
    } finally {
      endSave(ok);
    }
  };

  // Calculate completeness — keep this field list in sync with
  // COMPLETENESS_FIELDS in dashboard/page.tsx so both pages report the same number.
  const fields = [lp.first_name, lp.last_name, lp.dob, lp.sex, lp.ssn_encrypted, lp.email,
    lp.phone_mobile, lp.address_street, lp.address_city, lp.address_state, lp.address_zip];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-600 mt-1">This information auto-fills your VA forms.</p>
        <div className="mt-4 bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
            <span className="text-sm font-bold text-blue-700">{pct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-700 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {saveError && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mt-3">{saveError}</p>
        )}
      </div>

      <div className="space-y-4">
        {/* Personal Info */}
        <Section title="Personal Information" defaultOpen>
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <Input label="First Name" id="first_name" value={lp.first_name || ''}
              onChange={e => setField('first_name', e.target.value)}
              onBlur={e => saveField('first_name', e.target.value)} />
            <Input label="Middle Name" id="middle_name" value={lp.middle_name || ''}
              onChange={e => setField('middle_name', e.target.value)}
              onBlur={e => saveField('middle_name', e.target.value)} />
            <Input label="Last Name" id="last_name" value={lp.last_name || ''}
              onChange={e => setField('last_name', e.target.value)}
              onBlur={e => saveField('last_name', e.target.value)} />
            <Input label="Suffix" id="suffix" value={lp.suffix || ''} placeholder="Jr., Sr., III"
              onChange={e => setField('suffix', e.target.value)}
              onBlur={e => saveField('suffix', e.target.value)} />
            <Input label="Date of Birth" id="dob" type="date" value={lp.dob || ''}
              onChange={e => setField('dob', e.target.value)}
              onBlur={e => saveField('dob', e.target.value)} />
            <Select label="Sex" id="sex"
              options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]}
              value={lp.sex || ''}
              onChange={e => { setField('sex', e.target.value); saveField('sex', e.target.value); }} />
            <div className="relative">
              <Input label="SSN" id="ssn" type={showSSN ? 'text' : 'password'} placeholder="XXX-XX-XXXX"
                className="pr-9"
                value={lp.ssn_encrypted || ''}
                onChange={e => setField('ssn_encrypted', e.target.value)}
                onBlur={e => saveSSN(e.target.value)}
                error={fieldErrors.ssn}
                helpText="Encrypted at rest" />
              <button type="button" onClick={() => setShowSSN(s => !s)}
                aria-label={showSSN ? 'Hide SSN' : 'Show SSN'}
                className="absolute right-2 top-[31px] p-1 text-gray-400 hover:text-gray-600">
                {showSSN ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Input label="VA File Number" id="va_file_number" value={lp.va_file_number || ''}
              onChange={e => setField('va_file_number', e.target.value)}
              onBlur={e => saveVAFile(e.target.value)}
              error={fieldErrors.va_file_number} />
          </div>
        </Section>

        {/* Contact Info */}
        <Section title="Contact Information">
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <Input label="Email" id="email" type="email" value={lp.email || ''}
              onChange={e => setField('email', e.target.value)}
              onBlur={e => saveValidatedField('email', e.target.value)}
              error={fieldErrors.email} />
            <Input label="Home Phone" id="phone_home" type="tel" value={lp.phone_home || ''}
              onChange={e => setField('phone_home', e.target.value)}
              onBlur={e => saveValidatedField('phone_home', e.target.value)}
              error={fieldErrors.phone_home} />
            <Input label="Mobile Phone" id="phone_mobile" type="tel" value={lp.phone_mobile || ''}
              onChange={e => setField('phone_mobile', e.target.value)}
              onBlur={e => saveValidatedField('phone_mobile', e.target.value)}
              error={fieldErrors.phone_mobile} />
            <div className="sm:col-span-2">
              <Input label="Street Address" id="address_street" value={lp.address_street || ''}
                onChange={e => setField('address_street', e.target.value)}
                onBlur={e => saveField('address_street', e.target.value)} />
            </div>
            <Input label="Apt/Unit" id="address_apt" value={lp.address_apt || ''}
              onChange={e => setField('address_apt', e.target.value)}
              onBlur={e => saveField('address_apt', e.target.value)} />
            <Input label="City" id="address_city" value={lp.address_city || ''}
              onChange={e => setField('address_city', e.target.value)}
              onBlur={e => saveField('address_city', e.target.value)} />
            <Select label="State" id="address_state" options={stateOptions}
              value={lp.address_state || ''}
              onChange={e => { setField('address_state', e.target.value); saveField('address_state', e.target.value); }} />
            <Input label="ZIP Code" id="address_zip" value={lp.address_zip || ''}
              onChange={e => setField('address_zip', e.target.value)}
              onBlur={e => saveValidatedField('address_zip', e.target.value)}
              error={fieldErrors.address_zip} />
          </div>
        </Section>

        {/* Military Service */}
        <Section title="Military Service">
          <div className="pt-4 space-y-4">
            {lsp.map((sp) => (
              <div key={sp.id} className="border rounded-md p-4 relative">
                <button
                  onClick={() => { if (window.confirm('Remove this service period? This cannot be undone.')) deleteServicePeriod(sp.id); }}
                  aria-label="Delete service period"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Select label="Branch" id={`branch-${sp.id}`} options={branchOptions}
                    value={sp.branch || ''}
                    onChange={e => { setSPField(sp.id, 'branch', e.target.value); saveSPField(sp.id, 'branch', e.target.value); }} />
                  <Input label="Date Entered" id={`entered-${sp.id}`} type="date" value={sp.date_entered || ''}
                    onChange={e => setSPField(sp.id, 'date_entered', e.target.value)}
                    onBlur={e => saveSPField(sp.id, 'date_entered', e.target.value)} />
                  <Input label="Date Separated" id={`separated-${sp.id}`} type="date" value={sp.date_separated || ''}
                    onChange={e => setSPField(sp.id, 'date_separated', e.target.value)}
                    onBlur={e => saveSPField(sp.id, 'date_separated', e.target.value)} />
                  <Select label="Character of Discharge" id={`discharge-${sp.id}`} options={dischargeOptions}
                    value={sp.character_of_discharge || ''}
                    onChange={e => { setSPField(sp.id, 'character_of_discharge', e.target.value); saveSPField(sp.id, 'character_of_discharge', e.target.value); }} />
                  <Input label="Service Status" id={`status-${sp.id}`} value={sp.service_status || ''}
                    placeholder="Active duty, drilling reservist, etc."
                    onChange={e => setSPField(sp.id, 'service_status', e.target.value)}
                    onBlur={e => saveSPField(sp.id, 'service_status', e.target.value)} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addServicePeriod({ sort_order: lsp.length })}>
              <Plus className="h-4 w-4 mr-1" /> Add Service Period
            </Button>
          </div>
        </Section>

        {/* Education History */}
        <Section title="Education History">
          <div className="pt-4 space-y-4">
            {led.map((ed) => (
              <div key={ed.id} className="border rounded-md p-4 relative">
                <button
                  onClick={() => { if (window.confirm('Remove this education record? This cannot be undone.')) deleteEducation(ed.id); }}
                  aria-label="Delete education record"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input label="Institution" id={`inst-${ed.id}`} value={ed.institution || ''}
                    onChange={e => setEdField(ed.id, 'institution', e.target.value)}
                    onBlur={e => saveEdField(ed.id, 'institution', e.target.value)} />
                  <Input label="Location" id={`loc-${ed.id}`} value={ed.location || ''}
                    onChange={e => setEdField(ed.id, 'location', e.target.value)}
                    onBlur={e => saveEdField(ed.id, 'location', e.target.value)} />
                  <Input label="Date From" id={`from-${ed.id}`} type="date" value={ed.date_from || ''}
                    onChange={e => setEdField(ed.id, 'date_from', e.target.value)}
                    onBlur={e => saveEdField(ed.id, 'date_from', e.target.value)} />
                  <Input label="Date To" id={`to-${ed.id}`} type="date" value={ed.date_to || ''}
                    onChange={e => setEdField(ed.id, 'date_to', e.target.value)}
                    onBlur={e => saveEdField(ed.id, 'date_to', e.target.value)} />
                  <Input label="Degree/Diploma" id={`deg-${ed.id}`} value={ed.degree || ''}
                    onChange={e => setEdField(ed.id, 'degree', e.target.value)}
                    onBlur={e => saveEdField(ed.id, 'degree', e.target.value)} />
                  <Input label="Major/Field" id={`maj-${ed.id}`} value={ed.major || ''}
                    onChange={e => setEdField(ed.id, 'major', e.target.value)}
                    onBlur={e => saveEdField(ed.id, 'major', e.target.value)} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addEducation({ sort_order: led.length })}>
              <Plus className="h-4 w-4 mr-1" /> Add Education
            </Button>
          </div>
        </Section>

        {/* Employment */}
        <Section title="Employment History">
          <div className="pt-4 space-y-4">
            {lemp.map((emp) => (
              <div key={emp.id} className="border rounded-md p-4 relative">
                <button
                  onClick={() => { if (window.confirm('Remove this employment record? This cannot be undone.')) deleteEmployment(emp.id); }}
                  aria-label="Delete employment record"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input label="Occupation" id={`occ-${emp.id}`} value={emp.principal_occupation || ''}
                    onChange={e => setEmpField(emp.id, 'principal_occupation', e.target.value)}
                    onBlur={e => saveEmpField(emp.id, 'principal_occupation', e.target.value)} />
                  <Input label="License/Rating" id={`lic-${emp.id}`} value={emp.license_or_rating || ''}
                    onChange={e => setEmpField(emp.id, 'license_or_rating', e.target.value)}
                    onBlur={e => saveEmpField(emp.id, 'license_or_rating', e.target.value)} />
                  <Input label="Months Worked" id={`months-${emp.id}`} type="number"
                    value={emp.months_worked?.toString() || ''}
                    onChange={e => setEmpField(emp.id, 'months_worked', e.target.value ? parseInt(e.target.value) : null)}
                    onBlur={e => saveEmpField(emp.id, 'months_worked', e.target.value ? parseInt(e.target.value) : null)} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addEmployment({ sort_order: lemp.length })}>
              <Plus className="h-4 w-4 mr-1" /> Add Employment
            </Button>
          </div>
        </Section>

        {/* Direct Deposit */}
        <Section title="Direct Deposit">
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <Select label="Account Type" id="account_type"
              options={[{ label: 'Checking', value: 'Checking' }, { label: 'Savings', value: 'Savings' }]}
              value={ldd.account_type || ''}
              onChange={e => { setDDField('account_type', e.target.value); saveDDField('account_type', e.target.value); }} />
            <Input label="Bank Name" id="bank_name" value={ldd.bank_name || ''}
              onChange={e => setDDField('bank_name', e.target.value)}
              onBlur={e => saveDDField('bank_name', e.target.value)} />
            <div className="relative">
              <Input label="Routing Number" id="routing" type={showRouting ? 'text' : 'password'}
                className="pr-9"
                value={ldd.routing_number_encrypted || ''}
                onChange={e => setDDField('routing_number_encrypted', e.target.value)}
                onBlur={e => saveBank('routing_number', e.target.value)}
                error={fieldErrors.routing_number}
                helpText="9 digits" />
              <button type="button" onClick={() => setShowRouting(s => !s)}
                aria-label={showRouting ? 'Hide routing number' : 'Show routing number'}
                className="absolute right-2 top-[31px] p-1 text-gray-400 hover:text-gray-600">
                {showRouting ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Input label="Account Number" id="account" type={showAccount ? 'text' : 'password'}
                className="pr-9"
                value={ldd.account_number_encrypted || ''}
                onChange={e => setDDField('account_number_encrypted', e.target.value)}
                onBlur={e => saveBank('account_number', e.target.value)}
                error={fieldErrors.account_number} />
              <button type="button" onClick={() => setShowAccount(s => !s)}
                aria-label={showAccount ? 'Hide account number' : 'Show account number'}
                className="absolute right-2 top-[31px] p-1 text-gray-400 hover:text-gray-600">
                {showAccount ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </Section>
      </div>

      {/* Autosave status — fixed to the corner so it's visible wherever the
          user is on the page (fields save when you click or tab away). */}
      {saveState !== 'idle' && (
        <div role="status" aria-live="polite"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border bg-white shadow-md px-3.5 py-1.5 text-xs font-medium text-gray-700">
          {saveState === 'saving' ? (
            <>
              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-700" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5 text-green-600" />
              All changes saved
            </>
          )}
        </div>
      )}
    </div>
  );
}
