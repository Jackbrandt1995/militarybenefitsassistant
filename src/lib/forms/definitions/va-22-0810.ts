import type { FormDefinition } from '../types';
import { stateOptions } from '@/lib/validation';

export const va220810: FormDefinition = {
  id: 'va-22-0810',
  formNumber: 'VA 22-0810',
  title: 'Application for Reimbursement of National Exam Fee',
  description: 'Apply for reimbursement of national admission or credit-by-exam test fees (SAT, CLEP, GRE, AP, DSST, etc.).',
  pdfTemplate: '/forms/VA-22-0810.pdf',
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
        { id: 'daytimePhone', label: 'Daytime Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'eveningPhone', label: 'Evening Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'emailAddress', label: 'Email Address', type: 'email', profilePath: 'profile.email' },
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
        { id: 'benefitProgram', label: 'Which benefit program are you using?', type: 'radio', required: true, helpText: 'Select the chapter under which you receive VA education benefits.', options: [
          { label: 'Chapter 33 – Post-9/11 GI Bill', value: 'chapter33' },
          { label: 'Chapter 30 – MGIB (Active Duty)', value: 'chapter30' },
          { label: 'Chapter 32 – VEAP', value: 'chapter32' },
          { label: 'Chapter 35 – DEA (Survivors & Dependents)', value: 'chapter35' },
          { label: 'Chapter 1606 – MGIB (Selected Reserve)', value: 'chapter1606' },
          { label: 'National Call to Service', value: 'ncs' },
        ]},
      ],
    },
    {
      id: 'exam',
      title: 'Exam Information',
      description: 'Enter details for the national exam for which you are seeking reimbursement. Attach your receipt.',
      fields: [
        { id: 'examName', label: 'Name of Exam', type: 'text', required: true, helpText: 'e.g., "SAT", "CLEP – College Algebra", "GRE General Test", "DSST – Technical Writing"' },
        { id: 'organization', label: 'Organization Giving Exam', type: 'text', required: true, helpText: 'Full name of the testing organization. Indicate if the exam was taken online.' },
        { id: 'examDate', label: 'Date Exam Taken', type: 'date', required: true },
        { id: 'examCost', label: 'Exam Cost (itemize all fees)', type: 'textarea', required: true, helpText: 'List each fee separately (registration fee, testing fee, score-reporting fee, etc.). Attach receipt.' },
        { id: 'remarks', label: 'Remarks', type: 'textarea', helpText: 'Include any additional information relevant to your reimbursement request.' },
      ],
    },
    {
      id: 'signature',
      title: 'Certification & Signature',
      description: 'By signing, you certify that all information provided is true and correct to the best of your knowledge and belief.',
      fields: [
        { id: 'signaturePad', label: 'Your Signature', type: 'signature', required: true, helpText: 'Draw your signature in the box below.' },
        { id: 'signatureDate', label: 'Date Signed', type: 'date', required: true },
      ],
    },
    {
      id: 'attachments',
      title: 'Attach Supporting Documents',
      description: 'Upload your exam receipt and any other supporting documentation. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
};
