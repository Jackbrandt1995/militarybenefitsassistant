import type { FormDefinition } from '../types';
import { branchOptions, dischargeOptions } from '@/lib/validation';

export const va225490: FormDefinition = {
  id: 'va-22-5490',
  formNumber: 'VA 22-5490',
  title: "Dependents' Application for VA Education Benefits",
  description: 'Apply for Survivors and Dependents Educational Assistance (DEA, Chapter 35) or Fry Scholarship (Chapter 33) benefits.',
  pdfTemplate: '/forms/VA-22-5490.pdf',
  category: 'dependent',
  steps: [
    {
      id: 'applicant',
      title: 'Applicant Information',
      fields: [
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted' },
        { id: 'sex', label: 'Sex', type: 'radio', profilePath: 'profile.sex', options: [
          { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' },
        ]},
        { id: 'dob', label: 'Date of Birth', type: 'date', required: true, profilePath: 'profile.dob' },
        { id: 'name', label: 'Full Name (First, Middle Initial, Last)', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'address', label: 'Mailing Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'homePhone', label: 'Home Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'mobilePhone', label: 'Mobile Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'email', label: 'Email', type: 'email', profilePath: 'profile.email' },
      ],
    },
    {
      id: 'directDeposit',
      title: 'Direct Deposit',
      fields: [
        { id: 'accountType', label: 'Account Type', type: 'radio', profilePath: 'directDeposit.account_type', options: [
          { label: 'Checking', value: 'Checking' }, { label: 'Savings', value: 'Savings' },
        ]},
        { id: 'routingNumber', label: 'Routing Number', type: 'text', profilePath: 'directDeposit.routing_number_encrypted', maxLength: 9 },
        { id: 'accountNumber', label: 'Account Number', type: 'text', profilePath: 'directDeposit.account_number_encrypted' },
      ],
    },
    {
      id: 'qualifyingIndividual',
      title: 'Qualifying Individual',
      description: 'Information about the veteran/service member on whose account you are claiming benefits.',
      fields: [
        { id: 'qiName', label: 'Name of Qualifying Individual', type: 'text', required: true },
        { id: 'qiSSN', label: 'SSN or VA File Number', type: 'ssn', required: true },
        { id: 'qiBranch', label: 'Branch of Service', type: 'select', required: true, options: branchOptions },
        { id: 'qiDOB', label: 'Date of Birth', type: 'date' },
        { id: 'qiOnActiveDuty', label: 'Currently on active duty?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'qiDateMIA', label: 'Date Listed as MIA/POW (if applicable)', type: 'date' },
        { id: 'qiServiceConnectedDisability', label: 'Service-connected disability?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'qiDateOfDeath', label: 'Date of Death (if applicable)', type: 'date' },
      ],
    },
    {
      id: 'relationship',
      title: 'Relationship & Benefit',
      fields: [
        { id: 'relationship', label: 'Your relationship to qualifying individual', type: 'radio', required: true, options: [
          { label: 'Spouse', value: 'Spouse' },
          { label: 'Biological Child', value: 'BiologicalChild' },
          { label: 'Stepchild', value: 'Stepchild' },
          { label: 'Adopted Child', value: 'AdoptedChild' },
        ]},
        { id: 'benefitType', label: 'Benefit applying for', type: 'radio', required: true, options: [
          { label: 'Chapter 35 - DEA', value: 'DEA' },
          { label: 'Chapter 33 - Fry Scholarship', value: 'Fry' },
        ]},
        { id: 'marriageDate', label: 'Date of Marriage (if spouse)', type: 'date' },
        { id: 'remarried', label: 'Have you remarried?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
      ],
    },
    {
      id: 'education',
      title: 'Education Information',
      fields: [
        { id: 'hsGraduated', label: 'Have you graduated high school or received a GED?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'hsGradDate', label: 'Date of graduation/GED', type: 'date' },
        { id: 'previouslyReceivedVABenefits', label: 'Previously received VA education benefits?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
      ],
    },
    {
      id: 'servicePeriods',
      title: 'Active Duty Periods',
      description: 'Your own periods of active duty (if any).',
      fields: [
        { id: 'sp1Entered', label: 'Period 1 - Date Entered', type: 'date', profilePath: 'servicePeriods[0].date_entered' },
        { id: 'sp1Separated', label: 'Period 1 - Date Separated', type: 'date', profilePath: 'servicePeriods[0].date_separated' },
        { id: 'sp1Branch', label: 'Period 1 - Branch', type: 'select', profilePath: 'servicePeriods[0].branch', options: branchOptions },
        { id: 'sp1Discharge', label: 'Period 1 - Discharge Character', type: 'select', profilePath: 'servicePeriods[0].character_of_discharge', options: dischargeOptions },
      ],
    },
  ],
};
