import type { FormDefinition } from '../types';
import { stateOptions } from '@/lib/validation';

export const va221990e: FormDefinition = {
  id: 'va-22-1990e',
  version: 3,
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
        { id: 'relationship', label: 'Relationship to Service Member', type: 'radio', required: true, options: [
          { label: 'Spouse', value: 'Spouse' },
          { label: 'Child', value: 'Child' },
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
        { id: 'benefitChapter', label: 'Which benefit was transferred to you?', type: 'radio', required: true, helpText: 'Select the chapter that the service member transferred.', options: [
          { label: 'Chapter 33 – Post-9/11 GI Bill', value: 'chapter33' },
          { label: 'Chapter 30 – Montgomery GI Bill (MGIB)', value: 'chapter30' },
          { label: 'Chapter 1606 – MGIB Selected Reserve', value: 'chapter1606' },
        ]},
        { id: 'hsGrad', label: 'Do you have a high school diploma or GED?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'hsGradDate', label: 'High School Graduation Date', type: 'date', required: false, helpText: 'Provide only if you answered Yes above.' },
        { id: 'faaFlightCerts', label: 'Do you hold any FAA flight certificates?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
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
        { id: 'activeDutyMoney', label: 'Active duty applicants: Are you receiving money from the Armed Forces for this education?', type: 'radio', required: false, helpText: 'Answer only if you are on active duty. Leave blank if not applicable.', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'civilianMoney', label: 'Government employees: Are you receiving money from your Agency for this education?', type: 'radio', required: false, helpText: 'Answer only if you are a federal civilian employee. Leave blank if not applicable.', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
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
    const cityStateZip = [answers.city, stateZip]
      .map(v => String(v || '').trim()).filter(Boolean).join(', ');
    const smFullName = [answers.smFirstName, answers.smMiddleName, answers.smLastName]
      .map(v => String(v || '').trim()).filter(Boolean).join(' ');
    const smStateZip = [answers.smState, answers.smZip]
      .map(v => String(v || '').trim()).filter(Boolean).join(' ');
    const smCityStateZip = [answers.smCity, smStateZip]
      .map(v => String(v || '').trim()).filter(Boolean).join(', ');
    // Split date of birth (YYYY-MM-DD) into three separate comb fields
    const dobParts = String(answers.dob || '').split('-');
    const dobMonth = dobParts.length === 3 ? dobParts[1] : '';
    const dobDay   = dobParts.length === 3 ? dobParts[2] : '';
    const dobYear  = dobParts.length === 3 ? dobParts[0] : '';
    // Split HS graduation date (YYYY-MM-DD) into three comb fields
    const hsGradParts = String(answers.hsGradDate || '').split('-');
    const hsGradMonth = hsGradParts.length === 3 ? hsGradParts[1] : '';
    const hsGradDay   = hsGradParts.length === 3 ? hsGradParts[2] : '';
    const hsGradYear  = hsGradParts.length === 3 ? hsGradParts[0] : '';
    return { ...answers, fullName, cityStateZip, smFullName, smCityStateZip, dobMonth, dobDay, dobYear, hsGradMonth, hsGradDay, hsGradYear };
  },
};
