import type { FormDefinition } from '../types';

export const va220810: FormDefinition = {
  id: 'va-22-0810',
  formNumber: 'VA 22-0810',
  title: 'Application for Reimbursement of National Exam Fee',
  description: 'Apply for reimbursement of national admission or credit-by-exam test fees (SAT, CLEP, GRE, etc.).',
  pdfTemplate: '/forms/VA-22-0810.pdf',
  category: 'reimbursement',
  steps: [
    {
      id: 'applicant',
      title: 'Applicant Information',
      fields: [
        { id: 'name', label: 'Name (First, Middle Initial, Last)', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'address', label: 'Mailing Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'emailAddress', label: 'Email', type: 'email', profilePath: 'profile.email' },
        { id: 'daytimePhone', label: 'Daytime Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'eveningPhone', label: 'Evening Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number' },
      ],
    },
    {
      id: 'benefit',
      title: 'VA Education Information',
      fields: [
        { id: 'previouslyApplied', label: 'Previously applied for VA education benefits?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'benefitProgram', label: 'Benefit applied for', type: 'radio', options: [
          { label: 'Post-9/11 GI Bill (Chapter 33)', value: 'chapter33' },
          { label: 'MGIB - Active Duty (Chapter 30)', value: 'chapter30' },
          { label: 'VEAP (Chapter 32)', value: 'chapter32' },
          { label: 'DEA (Chapter 35)', value: 'chapter35' },
          { label: 'MGIB-SR (Chapter 1606)', value: 'chapter1606' },
          { label: 'National Call to Service', value: 'ncs' },
        ]},
      ],
    },
    {
      id: 'exam',
      title: 'Exam Information',
      fields: [
        { id: 'examName', label: 'Name of Exam', type: 'text', required: true },
        { id: 'organization', label: 'Organization Giving Exam', type: 'text', required: true, helpText: 'Indicate if taken online' },
        { id: 'examDate', label: 'Date Exam Taken', type: 'date', required: true },
        { id: 'examCost', label: 'Exam Cost (itemize fees)', type: 'textarea', required: true, helpText: 'Attach receipt' },
        { id: 'remarks', label: 'Remarks', type: 'textarea' },
      ],
    },
  ],
};
