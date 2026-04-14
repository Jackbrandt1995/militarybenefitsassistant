'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { branchOptions, dischargeOptions, stateOptions } from '@/lib/validation';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import type { ServicePeriod, EducationRecord, EmploymentRecord } from '@/types/profile';

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

  const [saving, setSaving] = useState<string | null>(null);

  if (loading || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
      </div>
    );
  }

  const { profile, servicePeriods, educationHistory, employmentHistory, directDeposit } = data;

  // Calculate completeness
  const fields = [profile.first_name, profile.last_name, profile.dob, profile.sex, profile.email,
    profile.phone_mobile, profile.address_street, profile.address_city, profile.address_state, profile.address_zip];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);

  const saveField = async (field: string, value: string | boolean | number | null) => {
    setSaving(field);
    await updateProfile({ [field]: value } as never);
    setSaving(null);
  };

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
      </div>

      <div className="space-y-4">
        {/* Personal Info */}
        <Section title="Personal Information" defaultOpen>
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <Input label="First Name" id="first_name" value={profile.first_name || ''} onBlur={e => saveField('first_name', e.target.value)} onChange={() => {}} />
            <Input label="Middle Name" id="middle_name" value={profile.middle_name || ''} onBlur={e => saveField('middle_name', e.target.value)} onChange={() => {}} />
            <Input label="Last Name" id="last_name" value={profile.last_name || ''} onBlur={e => saveField('last_name', e.target.value)} onChange={() => {}} />
            <Input label="Suffix" id="suffix" value={profile.suffix || ''} placeholder="Jr., Sr., III" onBlur={e => saveField('suffix', e.target.value)} onChange={() => {}} />
            <Input label="Date of Birth" id="dob" type="date" value={profile.dob || ''} onBlur={e => saveField('dob', e.target.value)} onChange={() => {}} />
            <Select label="Sex" id="sex" options={[{label:'Male',value:'Male'},{label:'Female',value:'Female'}]} value={profile.sex || ''} onChange={e => saveField('sex', e.target.value)} />
            <Input label="SSN" id="ssn" type="password" placeholder="XXX-XX-XXXX" value={profile.ssn_encrypted || ''} onBlur={e => saveField('ssn_encrypted', e.target.value)} onChange={() => {}} helpText="Encrypted at rest" />
            <Input label="VA File Number" id="va_file_number" value={profile.va_file_number || ''} onBlur={e => saveField('va_file_number', e.target.value)} onChange={() => {}} />
          </div>
          {saving && <p className="text-xs text-gray-500 mt-2">Saving...</p>}
        </Section>

        {/* Contact Info */}
        <Section title="Contact Information">
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <Input label="Email" id="email" type="email" value={profile.email || ''} onBlur={e => saveField('email', e.target.value)} onChange={() => {}} />
            <Input label="Home Phone" id="phone_home" type="tel" value={profile.phone_home || ''} onBlur={e => saveField('phone_home', e.target.value)} onChange={() => {}} />
            <Input label="Mobile Phone" id="phone_mobile" type="tel" value={profile.phone_mobile || ''} onBlur={e => saveField('phone_mobile', e.target.value)} onChange={() => {}} />
            <div className="sm:col-span-2">
              <Input label="Street Address" id="address_street" value={profile.address_street || ''} onBlur={e => saveField('address_street', e.target.value)} onChange={() => {}} />
            </div>
            <Input label="Apt/Unit" id="address_apt" value={profile.address_apt || ''} onBlur={e => saveField('address_apt', e.target.value)} onChange={() => {}} />
            <Input label="City" id="address_city" value={profile.address_city || ''} onBlur={e => saveField('address_city', e.target.value)} onChange={() => {}} />
            <Select label="State" id="address_state" options={stateOptions} value={profile.address_state || ''} onChange={e => saveField('address_state', e.target.value)} />
            <Input label="ZIP Code" id="address_zip" value={profile.address_zip || ''} onBlur={e => saveField('address_zip', e.target.value)} onChange={() => {}} />
          </div>
        </Section>

        {/* Military Service */}
        <Section title="Military Service">
          <div className="pt-4 space-y-4">
            {servicePeriods.map((sp: ServicePeriod) => (
              <div key={sp.id} className="border rounded-md p-4 relative">
                <button onClick={() => deleteServicePeriod(sp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Select label="Branch" id={`branch-${sp.id}`} options={branchOptions} value={sp.branch || ''} onChange={e => updateServicePeriod(sp.id, { branch: e.target.value })} />
                  <Input label="Date Entered" id={`entered-${sp.id}`} type="date" value={sp.date_entered || ''} onBlur={e => updateServicePeriod(sp.id, { date_entered: e.target.value })} onChange={() => {}} />
                  <Input label="Date Separated" id={`separated-${sp.id}`} type="date" value={sp.date_separated || ''} onBlur={e => updateServicePeriod(sp.id, { date_separated: e.target.value })} onChange={() => {}} />
                  <Select label="Character of Discharge" id={`discharge-${sp.id}`} options={dischargeOptions} value={sp.character_of_discharge || ''} onChange={e => updateServicePeriod(sp.id, { character_of_discharge: e.target.value })} />
                  <Input label="Service Status" id={`status-${sp.id}`} value={sp.service_status || ''} placeholder="Active duty, drilling reservist, etc." onBlur={e => updateServicePeriod(sp.id, { service_status: e.target.value })} onChange={() => {}} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addServicePeriod({ sort_order: servicePeriods.length })}>
              <Plus className="h-4 w-4 mr-1" /> Add Service Period
            </Button>
          </div>
        </Section>

        {/* Education History */}
        <Section title="Education History">
          <div className="pt-4 space-y-4">
            {educationHistory.map((ed: EducationRecord) => (
              <div key={ed.id} className="border rounded-md p-4 relative">
                <button onClick={() => deleteEducation(ed.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input label="Institution" id={`inst-${ed.id}`} value={ed.institution || ''} onBlur={e => updateEducation(ed.id, { institution: e.target.value })} onChange={() => {}} />
                  <Input label="Location" id={`loc-${ed.id}`} value={ed.location || ''} onBlur={e => updateEducation(ed.id, { location: e.target.value })} onChange={() => {}} />
                  <Input label="Date From" id={`from-${ed.id}`} type="date" value={ed.date_from || ''} onBlur={e => updateEducation(ed.id, { date_from: e.target.value })} onChange={() => {}} />
                  <Input label="Date To" id={`to-${ed.id}`} type="date" value={ed.date_to || ''} onBlur={e => updateEducation(ed.id, { date_to: e.target.value })} onChange={() => {}} />
                  <Input label="Degree/Diploma" id={`deg-${ed.id}`} value={ed.degree || ''} onBlur={e => updateEducation(ed.id, { degree: e.target.value })} onChange={() => {}} />
                  <Input label="Major/Field" id={`maj-${ed.id}`} value={ed.major || ''} onBlur={e => updateEducation(ed.id, { major: e.target.value })} onChange={() => {}} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addEducation({ sort_order: educationHistory.length })}>
              <Plus className="h-4 w-4 mr-1" /> Add Education
            </Button>
          </div>
        </Section>

        {/* Employment */}
        <Section title="Employment History">
          <div className="pt-4 space-y-4">
            {employmentHistory.map((emp: EmploymentRecord) => (
              <div key={emp.id} className="border rounded-md p-4 relative">
                <button onClick={() => deleteEmployment(emp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input label="Occupation" id={`occ-${emp.id}`} value={emp.principal_occupation || ''} onBlur={e => updateEmployment(emp.id, { principal_occupation: e.target.value })} onChange={() => {}} />
                  <Input label="License/Rating" id={`lic-${emp.id}`} value={emp.license_or_rating || ''} onBlur={e => updateEmployment(emp.id, { license_or_rating: e.target.value })} onChange={() => {}} />
                  <Input label="Months Worked" id={`months-${emp.id}`} type="number" value={emp.months_worked?.toString() || ''} onBlur={e => updateEmployment(emp.id, { months_worked: parseInt(e.target.value) || null })} onChange={() => {}} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addEmployment({ sort_order: employmentHistory.length })}>
              <Plus className="h-4 w-4 mr-1" /> Add Employment
            </Button>
          </div>
        </Section>

        {/* Direct Deposit */}
        <Section title="Direct Deposit">
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <Select label="Account Type" id="account_type" options={[{label:'Checking',value:'Checking'},{label:'Savings',value:'Savings'}]} value={directDeposit?.account_type || ''} onChange={e => updateDirectDeposit({ account_type: e.target.value as 'Checking' | 'Savings' })} />
            <Input label="Bank Name" id="bank_name" value={directDeposit?.bank_name || ''} onBlur={e => updateDirectDeposit({ bank_name: e.target.value })} onChange={() => {}} />
            <Input label="Routing Number" id="routing" type="password" value={directDeposit?.routing_number_encrypted || ''} onBlur={e => updateDirectDeposit({ routing_number_encrypted: e.target.value })} onChange={() => {}} helpText="9 digits" />
            <Input label="Account Number" id="account" type="password" value={directDeposit?.account_number_encrypted || ''} onBlur={e => updateDirectDeposit({ account_number_encrypted: e.target.value })} onChange={() => {}} />
          </div>
        </Section>
      </div>
    </div>
  );
}
