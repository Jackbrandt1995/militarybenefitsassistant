import type { FormDefinition } from '../types';
import { stateOptions } from '@/lib/validation';

export const va221999c: FormDefinition = {
  id: 'va-22-1999c',
  formNumber: 'VA 22-1999c',
  title: 'Correspondence Course Enrollment Affirmation',
  description: 'Affirm your enrollment in a VA-approved correspondence course. This form has no fillable PDF fields and will be generated with text overlays.',
  pdfTemplate: '/forms/VA-22-1999c.pdf',
  category: 'other',
  steps: [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Your name and identifying information as they appear on your VA record.',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'middleName', label: 'Middle Name', type: 'text', profilePath: 'profile.middle_name' },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', required: true, profilePath: 'profile.va_file_number', helpText: 'Your VA file number as shown on your benefits correspondence.' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', profilePath: 'profile.ssn_encrypted', helpText: 'Your 9-digit SSN. Used to locate your VA record if file number is unavailable.' },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Your current mailing address.',
      fields: [
        { id: 'address', label: 'Street Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'city', label: 'City', type: 'text', required: true, profilePath: 'profile.address_city' },
        { id: 'state', label: 'State', type: 'select', required: true, profilePath: 'profile.address_state', options: stateOptions },
        { id: 'zip', label: 'ZIP Code', type: 'text', required: true, profilePath: 'profile.address_zip' },
      ],
    },
    {
      id: 'course',
      title: 'Course Information',
      description: 'Information about the correspondence course you are affirming enrollment in.',
      fields: [
        { id: 'courseName', label: 'Name of Course', type: 'text', required: true, helpText: 'Enter the exact name of the correspondence course as listed in your enrollment agreement.' },
        { id: 'enrollmentDate', label: 'Date Enrollment Agreement Was Signed', type: 'date', required: true, helpText: 'The date you and your school signed the enrollment agreement.' },
        { id: 'schoolNameAddress', label: 'Name and Address of School', type: 'textarea', required: true, helpText: 'Include the full school name, street, city, state, and ZIP code.' },
      ],
    },
    {
      id: 'signature',
      title: 'Certification & Signature',
      description: 'By signing, you affirm that you are currently enrolled in the correspondence course described above.',
      fields: [
        { id: 'signaturePad', label: 'Your Signature', type: 'signature', required: true, helpText: 'Draw your signature in the box below.' },
        { id: 'signatureDate', label: 'Date Signed', type: 'date', required: true },
      ],
    },
    {
      id: 'attachments',
      title: 'Attach Supporting Documents',
      description: 'Upload your enrollment agreement or other supporting documentation. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
};
