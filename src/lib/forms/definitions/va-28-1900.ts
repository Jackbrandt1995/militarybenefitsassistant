import type { FormDefinition } from '../types';
import { stateOptions } from '@/lib/validation';

export const va281900: FormDefinition = {
  id: 'va-28-1900',
  formNumber: 'VA 28-1900',
  title: 'Disabled Veterans Application for Vocational Rehabilitation & Employment (VR&E)',
  description: 'Apply for Veteran Readiness and Employment (Chapter 31) services if you have a service-connected disability.',
  pdfTemplate: '/forms/VA-28-1900.pdf',
  category: 'application',
  steps: [
    {
      id: 'personal',
      title: 'Personal Information',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name', maxLength: 12 },
        { id: 'middleInitial', label: 'Middle Initial', type: 'text', profilePath: 'profile.middle_name', maxLength: 1 },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name', maxLength: 18 },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number' },
        { id: 'dob', label: 'Date of Birth', type: 'date', required: true, profilePath: 'profile.dob' },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      fields: [
        { id: 'street', label: 'Street Address', type: 'text', required: true, profilePath: 'profile.address_street', maxLength: 30 },
        { id: 'apt', label: 'Apt/Unit', type: 'text', profilePath: 'profile.address_apt', maxLength: 5 },
        { id: 'city', label: 'City', type: 'text', required: true, profilePath: 'profile.address_city', maxLength: 18 },
        { id: 'state', label: 'State', type: 'select', required: true, profilePath: 'profile.address_state', options: stateOptions },
        { id: 'zip', label: 'ZIP Code', type: 'text', required: true, profilePath: 'profile.address_zip' },
        { id: 'country', label: 'Country', type: 'text', profilePath: 'profile.address_country' },
        { id: 'mainPhone', label: 'Main Telephone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'cellPhone', label: 'Cell Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'intlPhone', label: 'International Phone', type: 'text' },
        { id: 'email', label: 'Email Address', type: 'email', profilePath: 'profile.email', maxLength: 30 },
        { id: 'agreeElectronic', label: 'I agree to receive electronic correspondence from VA', type: 'checkbox' },
      ],
    },
    {
      id: 'education',
      title: 'Education',
      fields: [
        { id: 'yearsOfEducation', label: 'Number of Years of Education', type: 'number', profilePath: 'profile.years_of_education' },
      ],
    },
  ],
};
