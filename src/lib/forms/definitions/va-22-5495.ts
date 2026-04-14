import type { FormDefinition } from '../types';
import { branchOptions, dischargeOptions } from '@/lib/validation';

export const va225495: FormDefinition = {
  id: 'va-22-5495',
  formNumber: 'VA 22-5495',
  title: "Dependents' Request for Change of Program or Place of Training",
  description: 'Request a change of school or program while using DEA (Chapter 35) or Fry Scholarship (Chapter 33) benefits.',
  pdfTemplate: '/forms/VA-22-5495.pdf',
  category: 'dependent',
  steps: [
    {
      id: 'applicant',
      title: 'Applicant Information',
      fields: [
        { id: 'name', label: 'Name (First, Middle Initial, Last)', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number' },
        { id: 'sex', label: 'Sex', type: 'radio', profilePath: 'profile.sex', options: [
          { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' },
        ]},
        { id: 'dob', label: 'Date of Birth', type: 'date', profilePath: 'profile.dob' },
        { id: 'address', label: 'Mailing Address', type: 'text', profilePath: 'profile.address_street' },
        { id: 'primaryPhone', label: 'Primary Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'secondaryPhone', label: 'Secondary Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'email', label: 'Email', type: 'email', profilePath: 'profile.email' },
      ],
    },
    {
      id: 'directDeposit',
      title: 'Direct Deposit & Emergency Contact',
      fields: [
        { id: 'accountType', label: 'Account Type', type: 'radio', profilePath: 'directDeposit.account_type', options: [
          { label: 'Checking', value: 'Checking' }, { label: 'Savings', value: 'Savings' },
        ]},
        { id: 'bankName', label: 'Bank Name', type: 'text', profilePath: 'directDeposit.bank_name' },
        { id: 'routingNumber', label: 'Routing Number', type: 'text', profilePath: 'directDeposit.routing_number_encrypted', maxLength: 9 },
        { id: 'accountNumber', label: 'Account Number', type: 'text', profilePath: 'directDeposit.account_number_encrypted' },
        { id: 'emergencyName', label: 'Emergency Contact Name', type: 'text' },
        { id: 'emergencyAddress', label: 'Emergency Contact Address', type: 'text' },
        { id: 'emergencyPhone', label: 'Emergency Contact Phone', type: 'phone' },
      ],
    },
    {
      id: 'qualifyingIndividual',
      title: 'Qualifying Individual',
      fields: [
        { id: 'qiName', label: 'Name of Qualifying Individual', type: 'text', required: true },
        { id: 'qiSSN', label: 'SSN or VA File Number', type: 'ssn', required: true },
        { id: 'qiBranch', label: 'Branch of Service', type: 'select', required: true, options: branchOptions },
        { id: 'qiDOB', label: 'Date of Birth', type: 'date' },
        { id: 'qiDateOfDeath', label: 'Date of Death/MIA/POW', type: 'date' },
      ],
    },
    {
      id: 'program',
      title: 'Benefit & Program Change',
      fields: [
        { id: 'benefitType', label: 'Benefit Type', type: 'radio', required: true, options: [
          { label: 'Chapter 33 - Fry Scholarship', value: 'Fry' },
          { label: 'Chapter 35 - DEA', value: 'DEA' },
        ]},
        { id: 'educationType', label: 'Type of Education', type: 'radio', options: [
          { label: 'College or Other School', value: 'college' },
          { label: 'Licensing/Certification Test', value: 'licensing' },
          { label: 'Apprenticeship/OJT', value: 'apprenticeship' },
          { label: 'Correspondence', value: 'correspondence' },
          { label: 'Flight Training', value: 'flight' },
        ]},
        { id: 'educationGoal', label: 'Education/Career Objective', type: 'text' },
        { id: 'programName', label: 'Program Name', type: 'text' },
        { id: 'newSchool', label: 'New School Name & Address', type: 'textarea' },
        { id: 'oldSchool', label: 'Current/Old School Name & Address', type: 'textarea' },
        { id: 'whyStopped', label: 'When and why did you stop training?', type: 'textarea' },
        { id: 'remarks', label: 'Remarks', type: 'textarea' },
      ],
    },
  ],
};
