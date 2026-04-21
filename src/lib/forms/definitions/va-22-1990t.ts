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
      description: 'Your personal information as the veteran or beneficiary applying for tutorial assistance.',
      fields: [
        { id: 'applicantFirstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'applicantMI', label: 'Middle Initial', type: 'text', profilePath: 'profile.middle_name', maxLength: 1 },
        { id: 'applicantLastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted', helpText: 'Your 9-digit SSN used to identify your VA record.' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number', helpText: 'If different from your SSN. Leave blank if unknown.' },
        { id: 'dob', label: 'Date of Birth', type: 'date', required: true, profilePath: 'profile.dob' },
        { id: 'sex', label: 'Sex', type: 'radio', required: true, profilePath: 'profile.sex', options: [
          { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' },
        ]},
      ],
    },
    {
      id: 'veteranInfo',
      title: 'Veteran Information',
      description: 'If you are applying as a dependent (not the veteran), provide the veteran\'s name here. If you are the veteran, leave these blank.',
      fields: [
        { id: 'veteranFirstName', label: 'Veteran First Name', type: 'text', helpText: 'Leave blank if you are the veteran.' },
        { id: 'veteranMI', label: 'Veteran Middle Initial', type: 'text', maxLength: 1 },
        { id: 'veteranLastName', label: 'Veteran Last Name', type: 'text' },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Your current mailing address and email.',
      fields: [
        { id: 'address', label: 'Street Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'city', label: 'City', type: 'text', required: true, profilePath: 'profile.address_city' },
        { id: 'stateField', label: 'State', type: 'text', profilePath: 'profile.address_state' },
        { id: 'zip', label: 'ZIP Code', type: 'text', profilePath: 'profile.address_zip' },
        { id: 'applicantEmail', label: 'Email Address', type: 'email', profilePath: 'profile.email' },
        { id: 'phone', label: 'Phone Number', type: 'phone', profilePath: 'profile.phone_mobile' },
      ],
    },
    {
      id: 'course',
      title: 'Course Information',
      description: 'Describe the course or curriculum for which you are requesting tutoring assistance.',
      fields: [
        { id: 'courseName', label: 'Course or Curriculum Name', type: 'text', required: true, helpText: 'The name of the course exactly as listed in your school catalog.' },
        { id: 'creditHours', label: 'Credit or Clock Hour Load', type: 'text', required: true, helpText: 'e.g., "15 credit hours" or "30 clock hours per week".' },
        { id: 'educationalGoal', label: 'Final Educational / Vocational Goal', type: 'text', required: true, helpText: 'Describe the degree, certificate, or career goal you are working toward.' },
        { id: 'tutoringSubjects', label: 'Subject(s) Requiring Tutoring', type: 'textarea', required: true, helpText: 'List all subjects for which you need tutoring assistance.' },
        { id: 'tutorInfo', label: 'Tutor Name, Position, and Address', type: 'textarea', required: true, helpText: 'Full name, professional title (e.g., Graduate Student), and mailing address of your tutor.' },
      ],
    },
    {
      id: 'sessions',
      title: 'Tutoring Sessions',
      description: 'Enter details for each month of tutoring (up to 3 months per submission). VA reimburses up to $100/month, with a $1,200 lifetime maximum.',
      fields: [
        { id: 'session1Month', label: 'Month 1 – Month/Year', type: 'text', placeholder: 'MM/YYYY' },
        { id: 'session1Dates', label: 'Month 1 – Exact Dates of Sessions', type: 'text', helpText: 'e.g., "Jan 5, 12, 19, 26"' },
        { id: 'session1Hours', label: 'Month 1 – Hours of Tutoring', type: 'number' },
        { id: 'session1Rate', label: 'Month 1 – Charge Per Hour ($)', type: 'number' },
        { id: 'session1Total', label: 'Month 1 – Total Charged ($)', type: 'number' },
        { id: 'session2Month', label: 'Month 2 – Month/Year', type: 'text', placeholder: 'MM/YYYY' },
        { id: 'session2Dates', label: 'Month 2 – Exact Dates', type: 'text' },
        { id: 'session2Hours', label: 'Month 2 – Hours', type: 'number' },
        { id: 'session2Rate', label: 'Month 2 – Charge Per Hour ($)', type: 'number' },
        { id: 'session2Total', label: 'Month 2 – Total Charged ($)', type: 'number' },
        { id: 'session3Month', label: 'Month 3 – Month/Year', type: 'text', placeholder: 'MM/YYYY' },
        { id: 'session3Dates', label: 'Month 3 – Exact Dates', type: 'text' },
        { id: 'session3Hours', label: 'Month 3 – Hours', type: 'number' },
        { id: 'session3Rate', label: 'Month 3 – Charge Per Hour ($)', type: 'number' },
        { id: 'session3Total', label: 'Month 3 – Total Charged ($)', type: 'number' },
        { id: 'totalPaymentDue', label: 'Total Payment Due ($)', type: 'number', helpText: 'Sum of all monthly totals.' },
      ],
    },
    {
      id: 'school',
      title: 'School Certification',
      description: 'Information about the school where you are enrolled. Your school\'s certifying official must also sign this form before submission.',
      fields: [
        { id: 'schoolNameAddress', label: 'Name and Address of School', type: 'textarea', required: true },
        { id: 'schoolType', label: 'Type of School', type: 'radio', required: true, options: [
          { label: 'Four-Year College or University', value: 'fourYear' },
          { label: 'Two-Year College (Community College)', value: 'twoYear' },
          { label: 'Other Than College (Trade/Vocational)', value: 'other' },
        ]},
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
      description: 'Upload receipts or other documentation. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
};
