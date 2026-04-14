import type { FormDefinition } from '../types';

export const va220803: FormDefinition = {
  id: 'va-22-0803',
  formNumber: 'VA 22-0803',
  title: 'Application for Reimbursement of Licensing or Certification Test Fees',
  description: 'Apply for reimbursement of fees paid for licensing or certification tests (MCSE, CCNA, EMT, NCLEX, etc.).',
  pdfTemplate: '/forms/VA-22-0803.pdf',
  category: 'reimbursement',
  steps: [
    {
      id: 'applicant',
      title: 'Applicant Information',
      fields: [
        { id: 'name', label: 'Name (First, Middle Initial, Last)', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'address', label: 'Mailing Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'email', label: 'Email', type: 'email', profilePath: 'profile.email' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number' },
        { id: 'homePhone', label: 'Home Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'mobilePhone', label: 'Mobile Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
      ],
    },
    {
      id: 'benefit',
      title: 'VA Education Information',
      fields: [
        { id: 'previouslyApplied', label: 'Have you previously applied for VA education benefits?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'benefitProgram', label: 'Which benefit program?', type: 'radio', options: [
          { label: 'Chapter 30 (MGIB)', value: 'chapter30' },
          { label: 'Chapter 32 (VEAP)', value: 'chapter32' },
          { label: 'Chapter 33 (Post-9/11 GI Bill)', value: 'chapter33' },
          { label: 'Chapter 35 (DEA)', value: 'chapter35' },
          { label: 'Chapter 1606 (MGIB-SR)', value: 'chapter1606' },
        ]},
      ],
    },
    {
      id: 'tests',
      title: 'Test Information',
      description: 'Enter details for each licensing or certification test (up to 4).',
      fields: [
        { id: 'test1Name', label: 'Test 1 - Name', type: 'text', required: true },
        { id: 'test1Org', label: 'Test 1 - Organization Issuing License', type: 'textarea' },
        { id: 'test1Date', label: 'Test 1 - Date Taken', type: 'date' },
        { id: 'test1Result', label: 'Test 1 - Result', type: 'text' },
        { id: 'test1Cost', label: 'Test 1 - Cost ($)', type: 'number' },
        { id: 'test2Name', label: 'Test 2 - Name', type: 'text' },
        { id: 'test2Org', label: 'Test 2 - Organization', type: 'textarea' },
        { id: 'test2Date', label: 'Test 2 - Date Taken', type: 'date' },
        { id: 'test2Result', label: 'Test 2 - Result', type: 'text' },
        { id: 'test2Cost', label: 'Test 2 - Cost ($)', type: 'number' },
        { id: 'remarks', label: 'Remarks', type: 'textarea' },
      ],
    },
  ],
};
