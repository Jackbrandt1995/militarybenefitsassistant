import type { FormDefinition } from '../types';

export const va228691: FormDefinition = {
  id: 'va-22-8691',
  formNumber: 'VA 22-8691',
  title: 'Application for Work-Study Allowance',
  description: 'Apply for VA work-study allowance to work at VA facilities, schools, or other approved locations while using education benefits.',
  pdfTemplate: '/forms/VA-22-8691.pdf',
  category: 'application',
  steps: [
    {
      id: 'applicant',
      title: 'Applicant Information',
      fields: [
        { id: 'name', label: 'Name (First, Middle, Last)', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'address', label: 'Mailing Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', profilePath: 'profile.ssn_encrypted' },
        { id: 'dob', label: 'Date of Birth', type: 'date', profilePath: 'profile.dob' },
        { id: 'sex', label: 'Sex', type: 'radio', profilePath: 'profile.sex', options: [
          { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' },
        ]},
        { id: 'phone', label: 'Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'email', label: 'Email', type: 'email', profilePath: 'profile.email' },
      ],
    },
    {
      id: 'school',
      title: 'School & Enrollment',
      fields: [
        { id: 'schoolName', label: 'School Name and Address', type: 'textarea', required: true },
        { id: 'trainingProgram', label: 'Current Academic/Training Program', type: 'text', required: true },
        { id: 'enrollBegin', label: 'Current Enrollment - Beginning Date', type: 'date', required: true },
        { id: 'enrollEnd', label: 'Current Enrollment - Ending Date', type: 'date', required: true },
        { id: 'nextEnrollBegin', label: 'Next Enrollment - Beginning Date', type: 'date' },
        { id: 'nextEnrollEnd', label: 'Next Enrollment - Ending Date', type: 'date' },
      ],
    },
    {
      id: 'benefit',
      title: 'Benefit Chapter',
      fields: [
        { id: 'benefitChapter', label: 'Education Benefit Receiving', type: 'radio', required: true, options: [
          { label: 'Chapter 30 (MGIB - Active Duty)', value: 'chapter30' },
          { label: 'Chapter 31 (Vocational Rehabilitation)', value: 'chapter31' },
          { label: 'Chapter 32 (VEAP)', value: 'chapter32' },
          { label: 'Chapter 33 (Post-9/11 GI Bill)', value: 'chapter33' },
          { label: 'Chapter 35 (DEA)', value: 'chapter35' },
          { label: 'Chapter 1606 (MGIB-SR)', value: 'chapter1606' },
        ]},
      ],
    },
    {
      id: 'workStudy',
      title: 'Work-Study Details',
      fields: [
        { id: 'advancePayment', label: 'Do you want advance payment?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'priorWorkStudy', label: 'Have you participated in VA work-study before?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'priorWorkStudyWhere', label: 'If yes, where did you work?', type: 'text', condition: { field: 'priorWorkStudy', value: 'Yes' } },
        { id: 'workSitePreference', label: 'Work Site Preference', type: 'textarea', required: true, helpText: 'Tell us the school, VA facility, or government facility where you would prefer to work.' },
        { id: 'workExperience', label: 'Work Experience', type: 'textarea', required: true, helpText: 'Describe previous jobs. If none, write "NONE".' },
        { id: 'qualifications', label: 'Qualifications', type: 'textarea', helpText: 'Special qualifications, IT experience, interests.' },
      ],
    },
    {
      id: 'availability',
      title: 'Availability Schedule',
      description: 'Days and hours you are available to work.',
      fields: [
        { id: 'availMonday', label: 'Monday', type: 'checkbox' },
        { id: 'availMondayFrom', label: 'Monday - From', type: 'text', placeholder: 'HH:MM AM/PM' },
        { id: 'availMondayTo', label: 'Monday - To', type: 'text', placeholder: 'HH:MM AM/PM' },
        { id: 'availTuesday', label: 'Tuesday', type: 'checkbox' },
        { id: 'availTuesdayFrom', label: 'Tuesday - From', type: 'text' },
        { id: 'availTuesdayTo', label: 'Tuesday - To', type: 'text' },
        { id: 'availWednesday', label: 'Wednesday', type: 'checkbox' },
        { id: 'availWednesdayFrom', label: 'Wednesday - From', type: 'text' },
        { id: 'availWednesdayTo', label: 'Wednesday - To', type: 'text' },
        { id: 'availThursday', label: 'Thursday', type: 'checkbox' },
        { id: 'availThursdayFrom', label: 'Thursday - From', type: 'text' },
        { id: 'availThursdayTo', label: 'Thursday - To', type: 'text' },
        { id: 'availFriday', label: 'Friday', type: 'checkbox' },
        { id: 'availFridayFrom', label: 'Friday - From', type: 'text' },
        { id: 'availFridayTo', label: 'Friday - To', type: 'text' },
      ],
    },
  ],
};
