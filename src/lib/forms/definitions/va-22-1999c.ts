import type { FormDefinition } from '../types';

export const va221999c: FormDefinition = {
  id: 'va-22-1999c',
  formNumber: 'VA 22-1999c',
  title: 'Correspondence Course Enrollment Affirmation',
  description: 'Affirm your enrollment in a VA-approved correspondence course. This form has no fillable PDF fields and will be generated with text overlays.',
  pdfTemplate: '/forms/VA-22-1999c.pdf',
  category: 'other',
  steps: [
    {
      id: 'basic',
      title: 'Basic Information',
      fields: [
        { id: 'fullName', label: 'Full Name (First, Middle Initial, Last)', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', required: true, profilePath: 'profile.va_file_number' },
      ],
    },
    {
      id: 'course',
      title: 'Course Information',
      fields: [
        { id: 'courseName', label: 'Name of Course', type: 'text', required: true },
        { id: 'enrollmentDate', label: 'Date Enrollment Agreement Signed', type: 'date', required: true },
        { id: 'schoolNameAddress', label: 'Name and Address of School', type: 'textarea', required: true },
      ],
    },
  ],
};
