'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { branchOptions, dischargeOptions, stateOptions } from '@/lib/validation';
import { ChevronDown, ChevronUp, Plus, Trash2, Save } from 'lucide-react';
import type { Profile, ServicePeriod, EducationRecord, EmploymentRecord, DirectDeposit } from '@/types/profile';

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
    updateDirectDeposit,
  } = useProfile();

  // Local state for editable fields
  const [lp, setLp] = useState<Partial<Profile>>({});
  const [lsp, setLsp] = useState<ServicePeriod[]>([]);
  const [led, setLed] = useState<EducationRecord[]>([]);
  const [lemp, setLemp] = useState<EmploymentRecord[]>([]);
  const [ldd, setLdd] = useState<Partial<DirectDeposit>>({});
  const [saving, setSaving] = useState(false);

  // Initialize local state from fetched data
  useEffect(() => {
    if (data) {
      setLp(data.profile);
      setLsp(data.servicePeriods);
      setLed(data.educationHistory);
      setLemp(data.employmentHistory);
      setLdd(data.directDeposit || {});
    }
  }, [data]);

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

  const saveField = async (field: string, value: string | boolean | number | null) => {
    setSaving(true);
    await updateProfile({ [field]: value } as Partial<Profile>);
    setSaving(false);
  };

  // Service period helpers
  const setSPField = (id: string, field: string, value: string) => {
    setLsp(prev => prev.map(sp => sp.id === id ? { ...sp, [field]: value } : sp));
  };

  const saveSPField = async (id: string, field: string, value: string) => {
    await updateServicePeriod(id, { [field]: value } as Partial<ServicePeriod>);
  };

  // Education helpers
  const setEdField = (id: string, field: string, value: string) => {
    setLed(prev => prev.map(ed => ed.id === id ? { ...ed, [field]: value } : ed));
  };

  const saveEdField = async (id: string, field: string, value: string) => {
    await updateEducation(id, { [field]: value } as Partial<EducationRecord>);
  };

  // Employment helpers
  const setEmpField = (id: string, field: string, value: string | number | null) => {
    setLemp(prev => prev.map(emp => emp.id === id ? { ...emp, [field]: value } : emp));
  };

  const saveEmpField = async (id: string, field: string, value: string | number | null) => {
    await updateEmployment(id, { [field]: value } as Partial<EmploymentRecord>);
  };

  // Direct deposit helpers
  const setDDField = (field: string, value: string) => {
    setLdd(prev => ({ ...prev, [field]: value }));
  };

  const saveDDField = async (field: string, value: string) => {
    await updateDirectDeposit({ [field]: value } as Partial<DirectDeposit>);
  };

  // Calculate completeness
  const fields = [lp.first_name, lp.last_name, lp.dob, lp.sex, lp.email,
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
        {saving && <p className="text-xs text-blue-600 mt-2">Saving...</p>}
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
            <Input label="SSN" id="ssn" type="password" placeholder="XXX-XX-XXXX"
              value={lp.ssn_encrypted || ''}
              onChange={e => setField('ssn_encrypted', e.target.value)}
              onBlur={e => saveField('ssn_encrypted', e.target.value)}
              helpText="Encrypted at rest" />
            <Input label="VA File Number" id="va_file_number" value={lp.va_file_number || ''}
              onChange={e => setField('va_file_number', e.target.value)}
              onBlur={e => saveField('va_file_number', e.target.value)} />
          </div>
        </Section>

        {/* Contact Info */}
        <Section title="Contact Information">
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <Input label="Email" id="email" type="email" value={lp.email || ''}
              onChange={e => setField('email', e.target.value)}
              onBlur={e => saveField('email', e.target.value)} />
            <Input label="Home Phone" id="phone_home" type="tel" value={lp.phone_home || ''}
              onChange={e => setField('phone_home', e.target.value)}
              onBlur={e => saveField('phone_home', e.target.value)} />
            <Input label="Mobile Phone" id="phone_mobile" type="tel" value={lp.phone_mobile || ''}
              onChange={e => setField('phone_mobile', e.target.value)}
              onBlur={e => saveField('phone_mobile', e.target.value)} />
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
              onBlur={e => saveField('address_zip', e.target.value)} />
          </div>
        </Section>

        {/* Military Service */}
        <Section title="Military Service">
          <div className="pt-4 space-y-4">
            {lsp.map((sp) => (
              <div key={sp.id} className="border rounded-md p-4 relative">
                <button onClick={() => deleteServicePeriod(sp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
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
                <button onClick={() => deleteEducation(ed.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
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
                <button onClick={() => deleteEmployment(emp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
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
            <Input label="Routing Number" id="routing" type="password"
              value={ldd.routing_number_encrypted || ''}
              onChange={e => setDDField('routing_number_encrypted', e.target.value)}
              onBlur={e => saveDDField('routing_number_encrypted', e.target.value)}
              helpText="9 digits" />
            <Input label="Account Number" id="account" type="password"
              value={ldd.account_number_encrypted || ''}
              onChange={e => setDDField('account_number_encrypted', e.target.value)}
              onBlur={e => saveDDField('account_number_encrypted', e.target.value)} />
          </div>
        </Section>
      </div>
    </div>
  );
}
