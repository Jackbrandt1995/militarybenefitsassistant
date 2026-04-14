import type { FormDefinition } from '../types';
import { branchOptions, dischargeOptions } from '@/lib/validation';

export const va221995: FormDefinition = {
  id: 'va-22-1995',
  formNumber: 'VA 22-1995',
  title: 'Request for Change of Program or Place of Training',
  description: 'Request to change your education program or school while using VA education benefits.',
  pdfTemplate: '/forms/VA-22-1995.pdf',
  category: 'change',
  steps: [
    {
      id: 'applicant',
      title: 'Applicant Information',
      fields: [
        { id: 'name', label: 'Name (Last, First, Middle)', type: 'text', required: true, profilePath: 'profile.last_name' },
        { id: 'address', label: 'Mailing Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'homePhone', label: 'Home Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'mobilePhone', label: 'Mobile Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number' },
        { id: 'email', label: 'Email', type: 'email', profilePath: 'profile.email' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted' },
      ],
    },
    {
      id: 'benefit',
      title: 'Benefit Selection',
      fields: [
        { id: 'benefitChapter', label: 'Education Benefit', type: 'radio', required: true, options: [
          { label: 'Chapter 33 (Post-9/11 GI Bill)', value: 'chapter33' },
          { label: 'Chapter 30 (MGIB - Active Duty)', value: 'chapter30' },
          { label: 'Chapter 32 (VEAP)', value: 'chapter32' },
          { label: 'Chapter 1606 (MGIB - Selected Reserve)', value: 'chapter1606' },
          { label: 'Chapter 1607 (REAP)', value: 'chapter1607' },
        ]},
      ],
    },
    {
      id: 'program',
      title: 'Program Information',
      fields: [
        { id: 'trainingType', label: 'How will you take training?', type: 'radio', required: true, options: [
          { label: 'School Attendance', value: 'school' },
          { label: 'Correspondence', value: 'correspondence' },
          { label: 'Apprenticeship/OJT', value: 'apprenticeship' },
          { label: 'Cooperative Training', value: 'cooperative' },
          { label: 'Tuition Assistance Top-Up', value: 'topUp' },
          { label: 'Flight Training', value: 'flight' },
          { label: 'Licensing/Certification Test', value: 'licensing' },
          { label: 'National Admissions Exams', value: 'nationalExam' },
        ]},
        { id: 'educationGoal', label: 'Educational/Career Goal', type: 'text' },
        { id: 'programName', label: 'Program Name', type: 'text', required: true },
        { id: 'newSchool', label: 'New School Name & Address', type: 'textarea' },
        { id: 'oldSchool', label: 'Previous School Name & Address', type: 'textarea' },
        { id: 'whyStopped', label: 'When and why did you stop training?', type: 'textarea' },
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
        { id: 'bankName', label: 'Bank Name', type: 'text', profilePath: 'directDeposit.bank_name' },
      ],
    },
    {
      id: 'service',
      title: 'Recent Service Periods',
      fields: [
        { id: 'service1Branch', label: 'Period 1 - Branch', type: 'select', profilePath: 'servicePeriods[0].branch', options: branchOptions },
        { id: 'service1Dates', label: 'Period 1 - Dates', type: 'text', placeholder: 'MM/DD/YYYY - MM/DD/YYYY' },
        { id: 'service1Involuntary', label: 'Period 1 - Involuntarily called?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'service1Discharge', label: 'Period 1 - Discharge Character', type: 'select', profilePath: 'servicePeriods[0].character_of_discharge', options: dischargeOptions },
        { id: 'service2Branch', label: 'Period 2 - Branch', type: 'select', profilePath: 'servicePeriods[1].branch', options: branchOptions },
        { id: 'service2Dates', label: 'Period 2 - Dates', type: 'text' },
      ],
    },
    {
      id: 'additional',
      title: 'Additional Information',
      fields: [
        { id: 'receivingGETA', label: 'Receiving benefits under GETA?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'receivingMilitaryFunds', label: 'Receiving money from Armed Forces for this course?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'remarks', label: 'Remarks', type: 'textarea' },
      ],
    },
  ],
};
