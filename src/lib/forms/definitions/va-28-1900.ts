import type { FormDefinition } from '../types';
import { stateOptions } from '@/lib/validation';

export const va281900: FormDefinition = {
  id: 'va-28-1900',
  version: 2,
  formNumber: 'VA 28-1900',
  title: 'Disabled Veterans Application for Vocational Rehabilitation & Employment (VR&E)',
  description: 'Apply for Veteran Readiness and Employment (Chapter 31) services if you have a service-connected disability.',
  pdfTemplate: '/forms/VA-28-1900.pdf',
  category: 'application',
  steps: [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Your name and identifying information as they appear on your VA record.',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name', maxLength: 12 },
        { id: 'middleInitial', label: 'Middle Initial', type: 'text', profilePath: 'profile.middle_name', maxLength: 1 },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name', maxLength: 18 },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted', helpText: 'Your 9-digit SSN used to identify your VA record.' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number', helpText: 'If different from your SSN. Leave blank if unknown.' },
        { id: 'dob', label: 'Date of Birth', type: 'date', required: true, profilePath: 'profile.dob' },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Your current mailing address and contact details.',
      fields: [
        { id: 'street', label: 'Street Address', type: 'text', required: true, profilePath: 'profile.address_street', maxLength: 30 },
        { id: 'apt', label: 'Apt / Unit', type: 'text', profilePath: 'profile.address_apt', maxLength: 5 },
        { id: 'city', label: 'City', type: 'text', required: true, profilePath: 'profile.address_city', maxLength: 18 },
        { id: 'state', label: 'State', type: 'select', required: true, profilePath: 'profile.address_state', options: stateOptions },
        { id: 'zip', label: 'ZIP Code', type: 'text', required: true, profilePath: 'profile.address_zip' },
        { id: 'country', label: 'Country', type: 'text', profilePath: 'profile.address_country', helpText: 'Leave blank if United States.' },
        { id: 'mainPhone', label: 'Main / Home Telephone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'cellPhone', label: 'Cell Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'intlPhone', label: 'International Phone (if applicable)', type: 'text', helpText: 'Include country code. Leave blank if not applicable.' },
        { id: 'email', label: 'Email Address', type: 'email', profilePath: 'profile.email', maxLength: 30 },
        { id: 'agreeElectronic', label: 'I agree to receive electronic correspondence from VA', type: 'checkbox', helpText: 'Check this box to receive VA notifications by email instead of paper mail.' },
      ],
    },
    {
      id: 'education',
      title: 'Education Background',
      description: 'Your highest level of education. VR&E counselors use this to help plan your rehabilitation program.',
      fields: [
        { id: 'yearsOfEducation', label: 'Number of Years of Education Completed', type: 'number', profilePath: 'profile.years_of_education', helpText: 'Count from 1st grade through your most recent schooling. For example, a high school graduate = 12, bachelor\'s degree = 16.' },
      ],
    },
    {
      id: 'disability',
      title: 'Disability & Service Information',
      description: 'Provide information about your service-connected disability rating.',
      fields: [
        { id: 'disabilityRating', label: 'Current VA Disability Rating (%)', type: 'text', helpText: 'Enter your current combined VA disability rating (e.g., "70%"). You must have at least a 10% rating to be eligible for VR&E.' },
        { id: 'disabilityDescription', label: 'Brief Description of Service-Connected Disabilities', type: 'textarea', helpText: 'Describe how your service-connected disabilities affect your ability to work or pursue employment.' },
        { id: 'previousVRE', label: 'Have you previously participated in a VR&E program?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'previousVREDates', label: 'If yes, approximate dates of VR&E participation', type: 'text', condition: { field: 'previousVRE', value: 'Yes' }, helpText: 'Enter approximate start and end dates of your prior VR&E program.' },
      ],
    },
    {
      id: 'employmentGoal',
      title: 'Employment Goal',
      description: 'Describe the type of employment or career you are seeking through VR&E.',
      fields: [
        { id: 'desiredOccupation', label: 'Desired Occupation or Career Field', type: 'text', helpText: 'Enter the type of job or career you want to pursue, e.g., "Software Developer", "Paralegal", "HVAC Technician".' },
        { id: 'currentlyEmployed', label: 'Are you currently employed?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'currentEmployer', label: 'If yes, current employer name', type: 'text', condition: { field: 'currentlyEmployed', value: 'Yes' } },
        { id: 'remarks', label: 'Additional Remarks', type: 'textarea', helpText: 'Include any additional information relevant to your VR&E application.' },
      ],
    },
    {
      id: 'signature',
      title: 'Certification & Signature',
      description: 'CERTIFICATION: I certify that all statements on this form are true and correct to the best of my knowledge and belief. WARNING: Title 38, United States Code, allows VA to request certain information to determine eligibility for benefits. Respondents are not required to respond unless it displays a valid OMB Control Number. Title 38 USC 1001 provides severe penalties for intentional misrepresentation.\n\nPRIVACY ACT NOTICE: The VA will not disclose information collected on this form to any source other than what has been authorized under the Privacy Act of 1974 or Title 38, Code of Federal Regulations 1.576 for routine uses (i.e., civil or criminal law enforcement, congressional communications, epidemiological or research studies, the collection of money owed to the United States, litigation in which the United States is a party or has an interest, the administration of VA programs and delivery of VA benefits, verification of identity and status, and personnel administration) as identified in the VA system of records. Your obligation to respond is required in order to apply for Vocational Rehabilitation and Employment benefits. Providing your SSN is mandatory under Title 38 U.S.C. 5101(c)(1).',
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
      description: 'Upload your DD-214, VA rating decision, or other supporting documents. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
};
