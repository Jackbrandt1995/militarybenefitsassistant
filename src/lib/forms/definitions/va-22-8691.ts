import type { FormDefinition } from '../types';
import { stateOptions } from '@/lib/validation';

export const va228691: FormDefinition = {
  id: 'va-22-8691',
  version: 2,
  formNumber: 'VA 22-8691',
  title: 'Application for Work-Study Allowance',
  description: 'Apply for VA work-study allowance to work at VA facilities, schools, or other approved locations while using education benefits.',
  pdfTemplate: '/forms/VA-22-8691.pdf',
  category: 'application',
  steps: [
    {
      id: 'applicant',
      title: 'Personal Information',
      description: 'Your name and identifying information.',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'middleName', label: 'Middle Name', type: 'text', profilePath: 'profile.middle_name' },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted', helpText: 'Your 9-digit SSN used to identify your VA record.' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number', helpText: 'If different from your SSN. Leave blank if unknown.' },
        { id: 'dob', label: 'Date of Birth', type: 'date', required: true, profilePath: 'profile.dob' },
        { id: 'sex', label: 'Sex', type: 'radio', required: true, profilePath: 'profile.sex', options: [
          { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' },
        ]},
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
        { id: 'phone', label: 'Phone Number', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'email', label: 'Email Address', type: 'email', profilePath: 'profile.email' },
      ],
    },
    {
      id: 'school',
      title: 'School & Enrollment',
      description: 'Information about your current academic enrollment.',
      fields: [
        { id: 'schoolName', label: 'School Name and Address', type: 'textarea', required: true, helpText: 'Include full name, street, city, state, and ZIP.' },
        { id: 'trainingProgram', label: 'Current Academic / Training Program', type: 'text', required: true, helpText: 'Your degree program, major, or training curriculum.' },
        { id: 'enrollBegin', label: 'Current Enrollment – Beginning Date', type: 'date', required: true },
        { id: 'enrollEnd', label: 'Current Enrollment – Ending Date', type: 'date', required: true },
        { id: 'nextEnrollBegin', label: 'Next Enrollment Period – Beginning Date (if known)', type: 'date' },
        { id: 'nextEnrollEnd', label: 'Next Enrollment Period – Ending Date (if known)', type: 'date' },
      ],
    },
    {
      id: 'benefit',
      title: 'Education Benefit Chapter',
      description: 'Select the VA education benefit you are currently receiving.',
      fields: [
        { id: 'benefitChapter', label: 'Education Benefit', type: 'radio', required: true, helpText: 'Select the chapter under which you are currently receiving VA education benefits.', options: [
          { label: 'Chapter 30 – MGIB (Active Duty)', value: 'chapter30' },
          { label: 'Chapter 31 – Vocational Rehabilitation (VR&E)', value: 'chapter31' },
          { label: 'Chapter 32 – VEAP', value: 'chapter32' },
          { label: 'Chapter 33 – Post-9/11 GI Bill', value: 'chapter33' },
          { label: 'Chapter 35 – DEA (Survivors & Dependents)', value: 'chapter35' },
          { label: 'Chapter 1606 – MGIB (Selected Reserve)', value: 'chapter1606' },
        ]},
      ],
    },
    {
      id: 'workStudy',
      title: 'Work-Study Details',
      description: 'Describe the work-study position you are seeking and your relevant experience.',
      fields: [
        { id: 'advancePayment', label: 'Do you want advance payment?', type: 'radio', required: true, helpText: 'Advance payment allows you to receive a portion of your work-study allowance before performing the work.', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'priorWorkStudy', label: 'Have you participated in VA work-study before?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'priorWorkStudyWhere', label: 'If yes, where did you work?', type: 'text', condition: { field: 'priorWorkStudy', value: 'Yes' }, helpText: 'Name the facility or school where you previously worked under VA work-study.' },
        { id: 'workSitePreference', label: 'Work Site Preference', type: 'textarea', required: true, helpText: 'Tell us the school, VA facility, or government facility where you would prefer to work. Include the name and address.' },
        { id: 'workExperience', label: 'Work Experience', type: 'textarea', required: true, helpText: 'Describe previous jobs or volunteer work. Include employer, title, and dates. If none, write "NONE".' },
        { id: 'qualifications', label: 'Special Qualifications', type: 'textarea', helpText: 'IT skills, certifications, languages, or other qualifications relevant to work-study.' },
      ],
    },
    {
      id: 'availability',
      title: 'Availability Schedule',
      description: 'Indicate the days and hours you are available to work. Check each day and enter your available hours.',
      fields: [
        { id: 'availMonday', label: 'Available Monday', type: 'checkbox' },
        { id: 'availMondayFrom', label: 'Monday – From', type: 'text', placeholder: 'e.g., 8:00 AM', condition: { field: 'availMonday', value: true } },
        { id: 'availMondayTo', label: 'Monday – To', type: 'text', placeholder: 'e.g., 12:00 PM', condition: { field: 'availMonday', value: true } },
        { id: 'availTuesday', label: 'Available Tuesday', type: 'checkbox' },
        { id: 'availTuesdayFrom', label: 'Tuesday – From', type: 'text', placeholder: 'e.g., 8:00 AM', condition: { field: 'availTuesday', value: true } },
        { id: 'availTuesdayTo', label: 'Tuesday – To', type: 'text', placeholder: 'e.g., 12:00 PM', condition: { field: 'availTuesday', value: true } },
        { id: 'availWednesday', label: 'Available Wednesday', type: 'checkbox' },
        { id: 'availWednesdayFrom', label: 'Wednesday – From', type: 'text', placeholder: 'e.g., 8:00 AM', condition: { field: 'availWednesday', value: true } },
        { id: 'availWednesdayTo', label: 'Wednesday – To', type: 'text', placeholder: 'e.g., 12:00 PM', condition: { field: 'availWednesday', value: true } },
        { id: 'availThursday', label: 'Available Thursday', type: 'checkbox' },
        { id: 'availThursdayFrom', label: 'Thursday – From', type: 'text', placeholder: 'e.g., 8:00 AM', condition: { field: 'availThursday', value: true } },
        { id: 'availThursdayTo', label: 'Thursday – To', type: 'text', placeholder: 'e.g., 12:00 PM', condition: { field: 'availThursday', value: true } },
        { id: 'availFriday', label: 'Available Friday', type: 'checkbox' },
        { id: 'availFridayFrom', label: 'Friday – From', type: 'text', placeholder: 'e.g., 8:00 AM', condition: { field: 'availFriday', value: true } },
        { id: 'availFridayTo', label: 'Friday – To', type: 'text', placeholder: 'e.g., 12:00 PM', condition: { field: 'availFriday', value: true } },
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
      description: 'Upload any documents that support your application. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
  computeAnswers: (answers) => {
    const fullName = [answers.firstName, answers.middleName, answers.lastName]
      .map(v => String(v || '').trim()).filter(Boolean).join(' ');
    const stateZip = [answers.state, answers.zip]
      .map(v => String(v || '').trim()).filter(Boolean).join(' ');
    const fullAddress = [answers.address, answers.city, stateZip]
      .map(v => String(v || '').trim()).filter(Boolean).join(', ');
    return { ...answers, fullName, fullAddress };
  },
};
