import type { FormDefinition } from '../types';
import { stateOptions } from '@/lib/validation';

export const va221990e: FormDefinition = {
  id: 'va-22-1990e',
  version: 2,
  formNumber: 'VA 22-1990e',
  title: 'Application for Family Members to Use Transferred Benefits',
  description: 'Apply for transferred Post-9/11 GI Bill benefits as a spouse or child of a service member who has transferred their benefits.',
  pdfTemplate: '/forms/VA-22-1990e.pdf',
  category: 'dependent',
  steps: [
    {
      id: 'applicant',
      title: 'Your Personal Information',
      description: 'Provide your name and Social Security Number exactly as they appear on your Social Security card.',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name', helpText: 'Enter your legal first name.' },
        { id: 'middleName', label: 'Middle Name', type: 'text', profilePath: 'profile.middle_name', helpText: 'Middle name or initial (optional).' },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name', helpText: 'Enter your legal last name.' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted', helpText: 'Your 9-digit SSN. Stored securely and used only to identify your VA record.' },
        { id: 'dob', label: 'Date of Birth', type: 'date', required: true, profilePath: 'profile.dob' },
        { id: 'sex', label: 'Sex', type: 'radio', required: true, profilePath: 'profile.sex', options: [
          { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' },
        ]},
      ],
    },
    {
      id: 'contact',
      title: 'Contact & Address',
      description: 'Your current mailing address and best contact information.',
      fields: [
        { id: 'street', label: 'Street Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'apt', label: 'Apt / Unit', type: 'text', profilePath: 'profile.address_apt' },
        { id: 'city', label: 'City', type: 'text', required: true, profilePath: 'profile.address_city' },
        { id: 'state', label: 'State', type: 'select', required: true, profilePath: 'profile.address_state', options: stateOptions },
        { id: 'zip', label: 'ZIP Code', type: 'text', required: true, profilePath: 'profile.address_zip' },
        { id: 'homePhone', label: 'Home Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'mobilePhone', label: 'Mobile Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'email', label: 'Email Address', type: 'email', profilePath: 'profile.email' },
      ],
    },
    {
      id: 'directDeposit',
      title: 'Direct Deposit Information',
      description: 'VA will deposit your benefit payments directly into your bank account. Provide your routing and account number from a voided check or bank letter.',
      fields: [
        { id: 'accountType', label: 'Account Type', type: 'radio', required: true, profilePath: 'directDeposit.account_type', options: [
          { label: 'Checking', value: 'Checking' }, { label: 'Savings', value: 'Savings' },
        ]},
        { id: 'routingNumber', label: 'Routing Number', type: 'text', profilePath: 'directDeposit.routing_number_encrypted', maxLength: 9, helpText: '9-digit ABA routing number found at the bottom-left of a check.' },
        { id: 'accountNumber', label: 'Account Number', type: 'text', profilePath: 'directDeposit.account_number_encrypted', maxLength: 13, sensitive: true, helpText: 'Your checking or savings account number (up to 13 digits).' },
        { id: 'bankName', label: 'Bank / Financial Institution Name', type: 'text', profilePath: 'directDeposit.bank_name' },
      ],
    },
    {
      id: 'education',
      title: 'Education & Training Plan',
      description: 'Tell VA what type of education or training you will pursue with your transferred benefits.',
      fields: [
        { id: 'hsGrad', label: 'Do you have a high school diploma or GED?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'hsGradDate', label: 'Date Received', type: 'date', profilePath: 'profile.high_school_diploma_date', helpText: 'Date you received your diploma or GED certificate.' },
        { id: 'educationType', label: 'Type of Training', type: 'radio', required: true, helpText: 'Select the primary type of education or training you plan to pursue.', options: [
          { label: 'College or Other School', value: 'college' },
          { label: 'Vocational Flight Training', value: 'flight' },
          { label: 'National Test Reimbursement', value: 'test' },
          { label: 'Licensing/Certification Test', value: 'licensing' },
          { label: 'Apprenticeship / On-the-Job Training', value: 'apprenticeship' },
          { label: 'Correspondence', value: 'correspondence' },
          { label: 'Tuition Assistance Top Up', value: 'topUp' },
        ]},
        { id: 'schoolName', label: 'School Name and Address', type: 'textarea', helpText: 'Include full name, street, city, state, and ZIP.' },
        { id: 'educationObjective', label: 'Educational / Career Objective', type: 'text', helpText: 'Describe the degree, certificate, or career goal you are working toward.' },
      ],
    },
    {
      id: 'educationHistory',
      title: 'Education After High School',
      description: 'List colleges, trade schools, or other post-secondary institutions you have attended.',
      fields: [
        { id: 'edu1Name', label: 'Institution 1 – Name', type: 'text', profilePath: 'educationHistory[0].institution' },
        { id: 'edu1From', label: 'Institution 1 – From', type: 'date', profilePath: 'educationHistory[0].date_from' },
        { id: 'edu1To', label: 'Institution 1 – To', type: 'date', profilePath: 'educationHistory[0].date_to' },
        { id: 'edu1Hours', label: 'Institution 1 – Credit Hours / Type', type: 'text', helpText: 'e.g., "60 semester hours"' },
        { id: 'edu1Degree', label: 'Institution 1 – Degree / Diploma Received', type: 'text', profilePath: 'educationHistory[0].degree' },
        { id: 'edu1Major', label: 'Institution 1 – Major', type: 'text', profilePath: 'educationHistory[0].major' },
        { id: 'edu2Name', label: 'Institution 2 – Name (if applicable)', type: 'text', profilePath: 'educationHistory[1].institution' },
        { id: 'edu2From', label: 'Institution 2 – From', type: 'date', profilePath: 'educationHistory[1].date_from' },
        { id: 'edu2To', label: 'Institution 2 – To', type: 'date', profilePath: 'educationHistory[1].date_to' },
        { id: 'edu2Degree', label: 'Institution 2 – Degree / Diploma', type: 'text', profilePath: 'educationHistory[1].degree' },
        { id: 'edu2Major', label: 'Institution 2 – Major', type: 'text', profilePath: 'educationHistory[1].major' },
      ],
    },
    {
      id: 'serviceMember',
      title: 'Service Member Information',
      description: 'Provide information about the active-duty service member or veteran who transferred their GI Bill benefits to you.',
      fields: [
        { id: 'smFirstName', label: 'Service Member First Name', type: 'text', required: true },
        { id: 'smMiddleName', label: 'Service Member Middle Name', type: 'text' },
        { id: 'smLastName', label: 'Service Member Last Name', type: 'text', required: true },
        { id: 'smSSN', label: 'Service Member SSN', type: 'ssn', required: true, helpText: 'SSN of the service member or veteran who transferred benefits to you.' },
        { id: 'smBranch', label: 'Branch of Service', type: 'text', required: true, helpText: 'e.g., Army, Navy, Marine Corps, Air Force, Coast Guard, Space Force.' },
        { id: 'smStreet', label: 'Service Member Address – Street', type: 'text' },
        { id: 'smCity', label: 'City', type: 'text' },
        { id: 'smState', label: 'State', type: 'select', options: stateOptions },
        { id: 'smZip', label: 'ZIP Code', type: 'text' },
      ],
    },
    {
      id: 'privacyAct',
      title: 'Privacy Act Notice',
      description: 'Please read the following notice carefully before signing your application.',
      fields: [
        {
          id: 'privacyActText',
          label: 'Privacy Act Notice',
          type: 'document',
          helpText: `PRIVACY ACT NOTICE

The VA will not disclose information collected on this form to any source other than what has been authorized under the Privacy Act of 1974 or Title 38, Code of Federal Regulations 1.576 for routine uses (i.e., civil or criminal law enforcement, congressional communications, epidemiological or research studies, the collection of money owed to the United States, litigation in which the United States is a party or has an interest, the administration of VA programs and delivery of VA benefits, verification of identity and status, and personnel administration) as identified in the VA system of records, 58VA21/22/28, Compensation, Pension, Education, and Vocational Rehabilitation and Employment Records – VA, published in the Federal Register.

Your obligation to respond is required to obtain or retain education benefits. Providing your SSN is mandatory. Applicants are required to provide their SSN under Title 38 U.S.C. 5101(c)(1). VA will not deny an individual benefits for refusing to provide their SSN unless the disclosure of the SSN is required by a Federal Statute of law enacted before January 1, 1975, and still in effect. The responses you submit are considered confidential (38 U.S.C. 5701). Information submitted is subject to verification through computer matching programs with other agencies.

RESPONDENT BURDEN: We need this information to determine your eligibility for VA education benefits. Title 38, United States Code, allows us to ask for this information. We estimate that you will need an average of 15–60 minutes to review the instructions, find the information, and complete this form. VA cannot conduct or sponsor a collection of information unless a valid OMB control number is displayed. You are not required to respond to a collection of information if this number is not displayed. Valid OMB control numbers can be located on the OMB Internet Page at www.reginfo.gov/public/do/PRAMain. If desired, you can call 1-800-827-1000 to get information on where to send comments or suggestions about this form.`,
        },
        {
          id: 'privacyActAck',
          label: 'I have read and acknowledge the Privacy Act Notice above.',
          type: 'checkbox',
          required: true,
          helpText: 'You must check this box to acknowledge the Privacy Act Notice before signing your application.',
        },
      ],
    },
    {
      id: 'signature',
      title: 'Certification & Signature',
      description: 'By signing, you certify that all information provided is true and correct to the best of your knowledge and belief.',
      fields: [
        { id: 'signaturePad', label: 'Your Signature', type: 'signature', required: true, helpText: 'Draw your signature in the box below. This replaces a wet signature for purposes of this application.' },
        { id: 'signatureDate', label: 'Date Signed', type: 'date', required: true },
      ],
    },
    {
      id: 'attachments',
      title: 'Attach Supporting Documents',
      description: 'Upload any documents that support your application. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
};
