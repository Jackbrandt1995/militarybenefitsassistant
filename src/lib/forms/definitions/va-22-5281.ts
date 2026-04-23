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
      id: 'signature',
      title: 'Certification & Signature',
      description: 'CERTIFICATION: I certify that all statements on this form are true and correct to the best of my knowledge and belief. WARNING: Title 38, United States Code, allows VA to request certain information to determine eligibility for benefits. Respondents are not required to respond unless it displays a valid OMB Control Number. Title 38 USC 1001 provides severe penalties for intentional misrepresentation.

PRIVACY ACT NOTICE: The VA will not disclose information collected on this form to any source other than what has been authorized under the Privacy Act of 1974 or Title 38, Code of Federal Regulations 1.576 for routine uses (i.e., civil or criminal law enforcement, congressional communications, epidemiological or research studies, the collection of money owed to the United States, litigation in which the United States is a party or has an interest, the administration of VA programs and delivery of VA benefits, verification of identity and status, and personnel administration) as identified in the VA system of records. Your obligation to respond is required to obtain or retain education benefits. Providing your SSN is mandatory under Title 38 U.S.C. 5101(c)(1).',
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
      description: 'Upload any supporting documentation. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
};
