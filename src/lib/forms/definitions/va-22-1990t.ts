import type { FormDefinition } from '../types';

export const va221990t: FormDefinition = {
  id: 'va-22-1990t',
  formNumber: 'VA 22-1990t',
  title: 'Application for Individualized Tutorial Assistance',
  description: 'Apply for VA tutorial assistance benefits to cover the cost of individualized tutoring.',
  pdfTemplate: '/forms/VA-22-1990t.pdf',
  category: 'application',
  steps: [
    {
      id: 'applicant',
      title: 'Applicant Information',
      fields: [
        { id: 'applicantFirstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'applicantMI', label: 'Middle Initial', type: 'text', profilePath: 'profile.middle_name', maxLength: 1 },
        { id: 'applicantLastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name' },
        { id: 'veteranFirstName', label: 'Veteran First Name', type: 'text' },
        { id: 'veteranMI', label: 'Veteran Middle Initial', type: 'text', maxLength: 1 },
        { id: 'veteranLastName', label: 'Veteran Last Name', type: 'text' },
        { id: 'address', label: 'Mailing Address', type: 'text', profilePath: 'profile.address_street' },
        { id: 'cityStateZip', label: 'City, State, ZIP', type: 'text' },
        { id: 'ssn', label: 'SSN', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number' },
        { id: 'sex', label: 'Sex', type: 'radio', profilePath: 'profile.sex', options: [
          { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' },
        ]},
        { id: 'dob', label: 'Date of Birth', type: 'date', profilePath: 'profile.dob' },
      ],
    },
    {
      id: 'course',
      title: 'Course Information',
      fields: [
        { id: 'courseName', label: 'Course or Curriculum Name', type: 'text', required: true },
        { id: 'creditHours', label: 'Credit or Clock Hour Load', type: 'text', required: true },
        { id: 'educationalGoal', label: 'Final Educational/Vocational Goal', type: 'text', required: true },
        { id: 'tutoringSubjects', label: 'Subject(s) Requiring Tutoring', type: 'textarea', required: true },
        { id: 'tutorInfo', label: 'Tutor Name, Position, and Address', type: 'textarea', required: true },
      ],
    },
    {
      id: 'sessions',
      title: 'Tutoring Sessions',
      description: 'Enter details for each month of tutoring (up to 6 months).',
      fields: [
        { id: 'session1Month', label: 'Month 1 - Month/Year', type: 'text', placeholder: 'MM/YYYY' },
        { id: 'session1Dates', label: 'Month 1 - Exact Dates', type: 'text' },
        { id: 'session1Hours', label: 'Month 1 - Hours', type: 'number' },
        { id: 'session1Rate', label: 'Month 1 - Charge/Hour ($)', type: 'number' },
        { id: 'session1Total', label: 'Month 1 - Total ($)', type: 'number' },
        { id: 'session2Month', label: 'Month 2 - Month/Year', type: 'text', placeholder: 'MM/YYYY' },
        { id: 'session2Dates', label: 'Month 2 - Exact Dates', type: 'text' },
        { id: 'session2Hours', label: 'Month 2 - Hours', type: 'number' },
        { id: 'session2Rate', label: 'Month 2 - Charge/Hour ($)', type: 'number' },
        { id: 'session2Total', label: 'Month 2 - Total ($)', type: 'number' },
        { id: 'session3Month', label: 'Month 3 - Month/Year', type: 'text', placeholder: 'MM/YYYY' },
        { id: 'session3Dates', label: 'Month 3 - Exact Dates', type: 'text' },
        { id: 'session3Hours', label: 'Month 3 - Hours', type: 'number' },
        { id: 'session3Rate', label: 'Month 3 - Charge/Hour ($)', type: 'number' },
        { id: 'session3Total', label: 'Month 3 - Total ($)', type: 'number' },
        { id: 'totalPaymentDue', label: 'Total Payment Due ($)', type: 'number' },
      ],
    },
    {
      id: 'school',
      title: 'School Certification',
      fields: [
        { id: 'schoolNameAddress', label: 'Name and Address of School', type: 'textarea', required: true },
        { id: 'schoolType', label: 'Type of School', type: 'radio', options: [
          { label: 'Four-Year College', value: 'fourYear' },
          { label: 'Two-Year College', value: 'twoYear' },
          { label: 'Other Than College', value: 'other' },
        ]},
        { id: 'applicantEmail', label: 'Applicant Email', type: 'email', profilePath: 'profile.email' },
      ],
    },
  ],
};
