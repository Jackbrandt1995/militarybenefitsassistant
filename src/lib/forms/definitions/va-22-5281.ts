import type { FormDefinition } from '../types';
import { branchOptions, stateOptions } from '@/lib/validation';

export const va225281: FormDefinition = {
  id: 'va-22-5281',
  version: 2,
  formNumber: 'VA 22-5281',
  title: 'Application for Refund of Educational Contributions (VEAP)',
  description: 'Apply for a refund of your VEAP (Chapter 32) educational contributions.',
  pdfTemplate: '/forms/VA-22-5281.pdf',
  category: 'other',
  steps: [
    {
      id: 'applicant',
      title: 'Personal Information',
      description: 'Your name and service information as they appear on your VA record.',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'middleName', label: 'Middle Name', type: 'text', profilePath: 'profile.middle_name' },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted', helpText: 'Your 9-digit SSN used to identify your VA record.' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number', helpText: 'If different from your SSN. Leave blank if unknown.' },
        { id: 'branch', label: 'Branch of Service', type: 'select', required: true, profilePath: 'servicePeriods[0].branch', options: branchOptions, helpText: 'The branch in which you made VEAP contributions.' },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Your current mailing address so VA can send your refund.',
      fields: [
        { id: 'address', label: 'Street Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'city', label: 'City', type: 'text', required: true, profilePath: 'profile.address_city' },
        { id: 'state', label: 'State', type: 'select', required: true, profilePath: 'profile.address_state', options: stateOptions },
        { id: 'zip', label: 'ZIP Code', type: 'text', required: true, profilePath: 'profile.address_zip' },
        { id: 'phone', label: 'Phone Number', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'email', label: 'Email Address', type: 'email', profilePath: 'profile.email' },
      ],
    },
    {
      id: 'reason',
      title: 'Reason for Refund',
      description: 'Select the reason you are requesting a refund of your VEAP contributions.',
      fields: [
        { id: 'refundReason', label: 'Reason for Requesting Refund', type: 'radio', required: true, helpText: 'Select the reason that best describes why you want a refund of your VEAP contributions.', options: [
          { label: 'Personal Hardship', value: 'hardship' },
          { label: 'Education Completed', value: 'completed' },
          { label: 'Vocation Obtained', value: 'vocation' },
          { label: 'Other', value: 'other' },
        ]},
        { id: 'otherReason', label: 'Specify Other Reason', type: 'text', condition: { field: 'refundReason', value: 'other' }, helpText: 'Please describe the reason you are requesting a refund.' },
      ],
    },
    {
      id: 'privacyAct',
      title: 'Privacy Act Notice',
      description: 'Please read the following notice carefully before signing your application.',
      fields: [
        {
          id: 'privacyActText',
          label: 'Privacy Act Notice',
          type: 'document',
          helpText: `PRIVACY ACT NOTICE

The VA will not disclose information collected on this form to any source other than what has been authorized under the Privacy Act of 1974 or Title 38, Code of Federal Regulations 1.576 for routine uses (i.e., civil or criminal law enforcement, congressional communications, epidemiological or research studies, the collection of money owed to the United States, litigation in which the United States is a party or has an interest, the administration of VA programs and delivery of VA benefits, verification of identity and status, and personnel administration) as identified in the VA system of records, 58VA21/22/28, Compensation, Pension, Education, and Vocational Rehabilitation and Employment Records – VA, published in the Federal Register.

Your obligation to respond is required to obtain or retain education benefits. Providing your SSN is mandatory. Applicants are required to provide their SSN under Title 38 U.S.C. 5101(c)(1). VA will not deny an individual benefits for refusing to provide their SSN unless the disclosure of the SSN is required by a Federal Statute of law enacted before January 1, 1975, and still in effect. The responses you submit are considered confidential (38 U.S.C. 5701). Information submitted is subject to verification through computer matching programs with other agencies.

RESPONDENT BURDEN: We need this information to determine your eligibility for VA education benefits. Title 38, United States Code, allows us to ask for this information. We estimate that you will need an average of 15–60 minutes to review the instructions, find the information, and complete this form. VA cannot conduct or sponsor a collection of information unless a valid OMB control number is displayed. You are not required to respond to a collection of information if this number is not displayed. Valid OMB control numbers can be located on the OMB Internet Page at www.reginfo.gov/public/do/PRAMain. If desired, you can call 1-800-827-1000 to get information on where to send comments or suggestions about this form.`,
        },
        {
          id: 'privacyActAck',
          label: 'I have read and acknowledge the Privacy Act Notice above.',
          type: 'checkbox',
          required: true,
          helpText: 'You must check this box to acknowledge the Privacy Act Notice before signing your application.',
        },
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
      description: 'Upload any supporting documentation. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
};
