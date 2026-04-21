import type { FormDefinition } from '../types';
import { branchOptions, stateOptions } from '@/lib/validation';

export const va225281: FormDefinition = {
  id: 'va-22-5281',
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
