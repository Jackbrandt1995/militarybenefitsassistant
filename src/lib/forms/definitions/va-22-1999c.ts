import type { FormDefinition } from '../types';
import { stateOptions } from '@/lib/validation';

export const va221999c: FormDefinition = {
  id: 'va-22-1999c',
  version: 2,
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
      description: 'Upload your enrollment agreement or other supporting documentation. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
};
