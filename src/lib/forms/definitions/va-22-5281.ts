import type { FormDefinition } from '../types';
import { branchOptions } from '@/lib/validation';

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
      title: 'Applicant Information',
      fields: [
        { id: 'name', label: 'Name', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted' },
        { id: 'branch', label: 'Branch of Service', type: 'select', required: true, profilePath: 'servicePeriods[0].branch', options: branchOptions },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number' },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      fields: [
        { id: 'address', label: 'Mailing Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'phone', label: 'Phone Number', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'email', label: 'Email', type: 'email', profilePath: 'profile.email' },
      ],
    },
    {
      id: 'reason',
      title: 'Reason for Refund',
      fields: [
        { id: 'refundReason', label: 'Reason for Refund', type: 'radio', required: true, options: [
          { label: 'Personal Hardship', value: 'hardship' },
          { label: 'Education Completed', value: 'completed' },
          { label: 'Vocation Obtained', value: 'vocation' },
          { label: 'Other', value: 'other' },
        ]},
        { id: 'otherReason', label: 'Specify Other Reason', type: 'text', condition: { field: 'refundReason', value: 'other' } },
      ],
    },
  ],
};
