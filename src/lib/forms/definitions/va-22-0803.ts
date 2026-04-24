import type { FormDefinition } from '../types';
import { stateOptions } from '@/lib/validation';

export const va220803: FormDefinition = {
  id: 'va-22-0803',
  version: 2,
  formNumber: 'VA 22-0803',
  title: 'Application for Reimbursement of Licensing or Certification Test Fees',
  description: 'Apply for reimbursement of fees paid for licensing or certification tests (MCSE, CCNA, EMT, NCLEX, etc.).',
  pdfTemplate: '/forms/VA-22-0803.pdf',
  category: 'reimbursement',
  steps: [
    {
      id: 'applicant',
      title: 'Personal Information',
      description: 'Your name and identifying information as they appear on your VA record.',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'middleName', label: 'Middle Name', type: 'text', profilePath: 'profile.middle_name' },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted', helpText: 'Your 9-digit SSN used to identify your VA record.' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number', helpText: 'If different from your SSN. Leave blank if unknown.' },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Your current mailing address, phone, and email.',
      fields: [
        { id: 'address', label: 'Street Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'city', label: 'City', type: 'text', required: true, profilePath: 'profile.address_city' },
        { id: 'state', label: 'State', type: 'select', required: true, profilePath: 'profile.address_state', options: stateOptions },
        { id: 'zip', label: 'ZIP Code', type: 'text', required: true, profilePath: 'profile.address_zip' },
        { id: 'homePhone', label: 'Home Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'mobilePhone', label: 'Mobile Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'email', label: 'Email Address', type: 'email', profilePath: 'profile.email' },
      ],
    },
    {
      id: 'benefit',
      title: 'VA Education Benefit',
      description: 'Tell VA which education benefit program you are currently using.',
      fields: [
        { id: 'previouslyApplied', label: 'Have you previously applied for VA education benefits?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'benefitProgram', label: 'Which benefit program are you using?', type: 'radio', required: true, helpText: 'Select the chapter under which you receive or will receive VA education benefits.', options: [
          { label: 'Chapter 30 – MGIB (Active Duty)', value: 'chapter30' },
          { label: 'Chapter 32 – VEAP', value: 'chapter32' },
          { label: 'Chapter 33 – Post-9/11 GI Bill', value: 'chapter33' },
          { label: 'Chapter 35 – DEA (Survivors & Dependents)', value: 'chapter35' },
          { label: 'Chapter 1606 – MGIB (Selected Reserve)', value: 'chapter1606' },
        ]},
      ],
    },
    {
      id: 'tests',
      title: 'Test Information',
      description: 'Enter details for each licensing or certification test for which you are requesting reimbursement (up to 4 tests per submission). Attach receipts.',
      fields: [
        { id: 'test1Name', label: 'Test 1 – Name of Test', type: 'text', required: true, helpText: 'e.g., "CompTIA Security+", "NCLEX-RN", "AWS Solutions Architect"' },
        { id: 'test1Org', label: 'Test 1 – Organization Issuing the License or Certification', type: 'textarea', helpText: 'Full name and address of the certifying body.' },
        { id: 'test1Date', label: 'Test 1 – Date Taken', type: 'date' },
        { id: 'test1Result', label: 'Test 1 – Result', type: 'text', helpText: 'e.g., "Pass" or "Fail"' },
        { id: 'test1Cost', label: 'Test 1 – Total Cost ($)', type: 'number', helpText: 'The total fee you paid (itemize on a separate sheet if needed).' },
        { id: 'test2Name', label: 'Test 2 – Name of Test (if applicable)', type: 'text' },
        { id: 'test2Org', label: 'Test 2 – Organization', type: 'textarea' },
        { id: 'test2Date', label: 'Test 2 – Date Taken', type: 'date' },
        { id: 'test2Result', label: 'Test 2 – Result', type: 'text' },
        { id: 'test2Cost', label: 'Test 2 – Total Cost ($)', type: 'number' },
        { id: 'test3Name', label: 'Test 3 – Name of Test (if applicable)', type: 'text' },
        { id: 'test3Org', label: 'Test 3 – Organization', type: 'textarea' },
        { id: 'test3Date', label: 'Test 3 – Date Taken', type: 'date' },
        { id: 'test3Result', label: 'Test 3 – Result', type: 'text' },
        { id: 'test3Cost', label: 'Test 3 – Total Cost ($)', type: 'number' },
        { id: 'remarks', label: 'Remarks', type: 'textarea', helpText: 'Include any additional information relevant to your reimbursement request.' },
      ],
    },
    {
      id: 'signature',
      title: 'Certification & Signature',
      description: 'CERTIFICATION: I certify that all statements on this form are true and correct to the best of my knowledge and belief. WARNING: Title 38, United States Code, allows VA to request certain information to determine eligibility for benefits. Respondents are not required to respond unless it displays a valid OMB Control Number. Title 38 USC 1001 provides severe penalties for intentional misrepresentation.\n\nPRIVACY ACT NOTICE: The VA will not disclose information collected on this form to any source other than what has been authorized under the Privacy Act of 1974 or Title 38, Code of Federal Regulations 1.576 for routine uses (i.e., civil or criminal law enforcement, congressional communications, epidemiological or research studies, the collection of money owed to the United States, litigation in which the United States is a party or has an interest, the administration of VA programs and delivery of VA benefits, verification of identity and status, and personnel administration) as identified in the VA system of records. Your obligation to respond is required to obtain or retain education benefits. Providing your SSN is mandatory under Title 38 U.S.C. 5101(c)(1).',
      fields: [
        {
          id: 'privacyAct',
          label: 'I have read and understand the Privacy Act Notice above.',
          type: 'checkbox',
          required: true,
          helpText: 'You must check this box to certify that you have read the Privacy Act Notice before signing.',
        },
        {
          id: 'signaturePad',
          label: 'Your Signature',
          type: 'signature',
          required: true,
          helpText: 'Draw your signature using your mouse or finger.',
        },
        {
          id: 'signatureDate',
          label: 'Date Signed',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      id: 'attachments',
      title: 'Attach Supporting Documents',
      description: 'Upload test receipts and any other supporting documentation. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
  computeAnswers: (answers) => {
    const fullName = [answers.firstName, answers.middleName, answers.lastName]
      .map(v => String(v || '').trim()).filter(Boolean).join(' ');
    const cityStateZip = [answers.city, answers.state, answers.zip]
      .map(v => String(v || '').trim()).filter(Boolean).join(', ');
    return { ...answers, fullName, cityStateZip };
  },
};
