import type { FormDefinition } from '../types';

export const va221990t: FormDefinition = {
  id: 'va-22-1990t',
  version: 2,
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
        { id: 'apt', label: 'Apt / Unit # / Rural Route', type: 'text', helpText: 'Optional: apartment number, unit, or rural route.' },
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
      description: 'Upload receipts or other documentation. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
  computeAnswers: (answers) => {
    // Auto-sum session totals into totalPaymentDue (12F)
    const s1 = parseFloat(String(answers.session1Total || '')) || 0;
    const s2 = parseFloat(String(answers.session2Total || '')) || 0;
    const s3 = parseFloat(String(answers.session3Total || '')) || 0;
    const total = s1 + s2 + s3;
    return {
      ...answers,
      totalPaymentDue: total > 0 ? String(total) : String(answers.totalPaymentDue || ''),
    };
  },
  nextSteps: `After filling out the form, remember to:

Step 2. Take to your tutor. The tutor must:
\u2022 Sign and date the application in Items 14A and 14B.
\u2022 Verify the information you provided.
\u2022 Certify that he or she is the person who gave you individualized tutoring, and is not closely related to you (i.e., spouse, parent, brother, sister or child).

Step 3. Take to the certifying official for VA Benefits at the school. The certifying official must:
\u2022 Complete Items 15 and 16.
\u2022 Sign in Items 17A and 17B.

Step 4. Post-9/11 GI Bill. If you are requesting tutorial assistance under the Post-9/11 GI Bill, take this form to the professor or instructor of the course for which tutoring was necessary. The teacher must:
\u2022 Sign Item 18A.
\u2022 Complete Item 18B.

Step 5. Review the form. After you have completed the form (see steps 1 through 4), send it to VA as soon as possible after your tutoring is complete. VA will not pay assistance for any tutoring received more than one year before the day VA actually receives your claim.

Step 6. Where to Mail This Form. Mail the completed form to the Regional Processing Office for your state. See the chart on page 3.`,
};
