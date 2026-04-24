import type { FormDefinition } from '../types';
import { branchOptions, dischargeOptions, stateOptions } from '@/lib/validation';

export const va221995: FormDefinition = {
  id: 'va-22-1995',
  version: 2,
  formNumber: 'VA 22-1995',
  title: 'Request for Change of Program or Place of Training',
  description: 'Request to change your education program or school while using VA education benefits.',
  pdfTemplate: '/forms/VA-22-1995.pdf',
  category: 'change',
  steps: [
    {
      id: 'applicant',
      title: 'Personal Information',
      description: 'Your name and identifying information as they appear on your VA record.',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'middleName', label: 'Middle Name', type: 'text', profilePath: 'profile.middle_name' },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted', helpText: 'Your 9-digit SSN used to identify your VA record.' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number', helpText: 'If different from your SSN. Leave blank if unknown.' },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Your current mailing address and best contact numbers.',
      fields: [
        { id: 'address', label: 'Street Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'city', label: 'City', type: 'text', required: true, profilePath: 'profile.address_city' },
        { id: 'state', label: 'State', type: 'select', required: true, profilePath: 'profile.address_state', options: stateOptions },
        { id: 'zip', label: 'ZIP Code', type: 'text', required: true, profilePath: 'profile.address_zip' },
        { id: 'homePhone', label: 'Home Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'mobilePhone', label: 'Mobile Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'email', label: 'Email Address', type: 'email', profilePath: 'profile.email' },
      ],
    },
    {
      id: 'benefit',
      title: 'Education Benefit Chapter',
      description: 'Select the VA education benefit you are currently receiving.',
      fields: [
        { id: 'benefitChapter', label: 'Education Benefit', type: 'radio', required: true, helpText: 'Select the chapter under which you are currently receiving VA education benefits.', options: [
          { label: 'Chapter 33 – Post-9/11 GI Bill', value: 'chapter33' },
          { label: 'Chapter 30 – MGIB (Active Duty)', value: 'chapter30' },
          { label: 'Chapter 32 – VEAP', value: 'chapter32' },
          { label: 'Chapter 1606 – MGIB (Selected Reserve)', value: 'chapter1606' },
          { label: 'Chapter 1607 – REAP', value: 'chapter1607' },
        ]},
      ],
    },
    {
      id: 'program',
      title: 'New Program Information',
      description: 'Describe the new school or training program you want to switch to.',
      fields: [
        { id: 'trainingType', label: 'Type of Training', type: 'radio', required: true, helpText: 'How will you take training at the new location?', options: [
          { label: 'School Attendance', value: 'school' },
          { label: 'Correspondence', value: 'correspondence' },
          { label: 'Apprenticeship / On-the-Job Training', value: 'apprenticeship' },
          { label: 'Cooperative Training', value: 'cooperative' },
          { label: 'Tuition Assistance Top-Up', value: 'topUp' },
          { label: 'Flight Training', value: 'flight' },
          { label: 'Licensing / Certification Test', value: 'licensing' },
          { label: 'National Admissions Exams', value: 'nationalExam' },
        ]},
        { id: 'programName', label: 'Program Name', type: 'text', required: true, helpText: 'The name of your degree program, major, or training curriculum.' },
        { id: 'educationGoal', label: 'Educational / Career Goal', type: 'text', helpText: 'Describe the degree, certificate, or career goal you are working toward.' },
        { id: 'newSchool', label: 'New School Name & Address', type: 'textarea', helpText: 'Include full name, street, city, state, and ZIP.' },
      ],
    },
    {
      id: 'previousTraining',
      title: 'Previous Training',
      description: 'Provide information about your current or most recent school and why you stopped.',
      fields: [
        { id: 'oldSchool', label: 'Previous School Name & Address', type: 'textarea', helpText: 'Include full name, street, city, state, and ZIP.' },
        { id: 'whyStopped', label: 'When and Why Did You Stop Training?', type: 'textarea', helpText: 'Briefly explain the reason for leaving your previous program (e.g., completed degree, relocation, change of career goals).' },
      ],
    },
    {
      id: 'directDeposit',
      title: 'Direct Deposit Information',
      description: 'VA will deposit benefit payments directly into your bank account. Provide your routing and account number from a voided check.',
      fields: [
        { id: 'eftAction', label: '5B – Start or Stop EFT?', type: 'radio', helpText: 'Select whether you are starting or stopping direct deposit (EFT). Leave blank if no change.', options: [
          { label: 'Start EFT', value: 'start' },
          { label: 'Stop EFT',  value: 'stop'  },
        ]},
        { id: 'accountType', label: 'Account Type', type: 'radio', required: true, profilePath: 'directDeposit.account_type', options: [
          { label: 'Checking', value: 'Checking' }, { label: 'Savings', value: 'Savings' },
        ]},
        { id: 'routingNumber', label: 'Routing Number', type: 'text', profilePath: 'directDeposit.routing_number_encrypted', maxLength: 9, helpText: '9-digit ABA routing number found at the bottom-left of a check.' },
        { id: 'accountNumber', label: 'Account Number', type: 'text', profilePath: 'directDeposit.account_number_encrypted', maxLength: 13, sensitive: true, helpText: 'Your bank account number (up to 13 digits).' },
        { id: 'bankName', label: 'Bank / Financial Institution Name', type: 'text', profilePath: 'directDeposit.bank_name' },
      ],
    },
    {
      id: 'service',
      title: 'Recent Service Periods',
      description: 'List your most recent active-duty service periods. This helps VA verify eligibility.',
      fields: [
        { id: 'service1Branch', label: 'Period 1 – Branch', type: 'select', profilePath: 'servicePeriods[0].branch', options: branchOptions },
        { id: 'service1From', label: 'Period 1 – Date Entered', type: 'date', profilePath: 'servicePeriods[0].date_entered' },
        { id: 'service1To', label: 'Period 1 – Date Separated', type: 'date', profilePath: 'servicePeriods[0].date_separated' },
        { id: 'service1DutyType', label: 'Period 1 – Type of Duty (7E)', type: 'text', helpText: 'e.g., Active Duty, Active Guard Reserve, Selected Reserve.' },
        { id: 'service1Involuntary', label: 'Period 1 – Involuntarily separated?', type: 'radio', required: true, helpText: 'Were you involuntarily called to active duty?', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'service1Discharge', label: 'Period 1 – Character of Discharge', type: 'select', profilePath: 'servicePeriods[0].character_of_discharge', options: dischargeOptions },
        { id: 'service2Branch', label: 'Period 2 – Branch (if applicable)', type: 'select', profilePath: 'servicePeriods[1].branch', options: branchOptions },
        { id: 'service2From', label: 'Period 2 – Date Entered', type: 'date', profilePath: 'servicePeriods[1].date_entered' },
        { id: 'service2To', label: 'Period 2 – Date Separated', type: 'date', profilePath: 'servicePeriods[1].date_separated' },
        { id: 'service2DutyType', label: 'Period 2 – Type of Duty (7E)', type: 'text', helpText: 'e.g., Active Duty, Active Guard Reserve, Selected Reserve.' },
        { id: 'service2Discharge', label: 'Period 2 – Character of Discharge', type: 'select', profilePath: 'servicePeriods[1].character_of_discharge', options: dischargeOptions },
      ],
    },
    {
      id: 'additional',
      title: 'Additional Information',
      description: 'Answer these questions to help VA process your request.',
      fields: [
        { id: 'receivingGETA', label: 'Are you receiving benefits under the Government Employees\' Training Act (GETA)?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'receivingMilitaryFunds', label: 'Are you receiving money from the Armed Forces for this course?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'remarks', label: 'Remarks', type: 'textarea', helpText: 'Include any additional information that may be relevant to your request.' },
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
      description: 'Upload any documents that support your change request. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
  computeAnswers: (answers) => {
    const fullName = [answers.firstName, answers.middleName, answers.lastName]
      .map(v => String(v || '').trim()).filter(Boolean).join(' ');
    const cityState = [answers.city, answers.state]
      .map(v => String(v || '').trim()).filter(Boolean).join(', ');
    const fullAddress = [answers.address, cityState, answers.zip]
      .map(v => String(v || '').trim()).filter(Boolean).join(', ');
    return { ...answers, fullName, fullAddress };
  },
};
