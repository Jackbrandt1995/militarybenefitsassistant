import type { FormDefinition } from '../types';
import { branchOptions, dischargeOptions, stateOptions } from '@/lib/validation';

export const va225490: FormDefinition = {
  id: 'va-22-5490',
  version: 2,
  formNumber: 'VA 22-5490',
  title: "Dependents' Application for VA Education Benefits",
  description: 'Apply for Survivors and Dependents Educational Assistance (DEA, Chapter 35) or Fry Scholarship (Chapter 33) benefits.',
  pdfTemplate: '/forms/VA-22-5490.pdf',
  category: 'dependent',
  steps: [
    {
      id: 'applicant',
      title: 'Your Personal Information',
      description: 'Your name, date of birth, and identifying information as the dependent applicant.',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'middleName', label: 'Middle Name', type: 'text', profilePath: 'profile.middle_name' },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted', helpText: 'Your 9-digit SSN (not the veteran\'s).' },
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
      id: 'directDeposit',
      title: 'Direct Deposit Information',
      description: 'VA will deposit your benefit payments directly into your bank account. Provide your routing and account number from a voided check or bank letter.',
      fields: [
        { id: 'accountType', label: 'Account Type', type: 'radio', required: true, profilePath: 'directDeposit.account_type', options: [
          { label: 'Checking', value: 'Checking' }, { label: 'Savings', value: 'Savings' },
        ]},
        { id: 'routingNumber', label: 'Routing Number', type: 'text', profilePath: 'directDeposit.routing_number_encrypted', maxLength: 9, helpText: '9-digit ABA routing number found at the bottom-left of a check.' },
        { id: 'accountNumber', label: 'Account Number', type: 'text', profilePath: 'directDeposit.account_number_encrypted', maxLength: 13, sensitive: true, helpText: 'Your bank account number (up to 13 digits).' },
        { id: 'bankName', label: 'Bank / Financial Institution Name', type: 'text', profilePath: 'directDeposit.bank_name' },
      ],
    },
    {
      id: 'qualifyingIndividual',
      title: 'Qualifying Individual (Veteran / Service Member)',
      description: 'Information about the veteran or service member on whose account you are claiming benefits.',
      fields: [
        { id: 'qiFirstName', label: 'Veteran / Service Member First Name', type: 'text', required: true },
        { id: 'qiMiddleName', label: 'Middle Name', type: 'text' },
        { id: 'qiLastName', label: 'Last Name', type: 'text', required: true },
        { id: 'qiSSN', label: 'Veteran SSN or VA File Number', type: 'ssn', required: true, helpText: 'The veteran\'s Social Security Number or VA File Number.' },
        { id: 'qiBranch', label: 'Branch of Service', type: 'select', required: true, options: branchOptions },
        { id: 'qiDOB', label: 'Date of Birth', type: 'date' },
        { id: 'qiOnActiveDuty', label: 'Is the veteran/service member currently on active duty?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'qiDateMIA', label: 'Date Listed as MIA / POW (if applicable)', type: 'date', helpText: 'Leave blank if not applicable.' },
        { id: 'qiServiceConnectedDisability', label: 'Does the veteran have a service-connected disability?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'qiDateOfDeath', label: 'Date of Death (if applicable)', type: 'date', helpText: 'Leave blank if not applicable.' },
      ],
    },
    {
      id: 'relationship',
      title: 'Your Relationship & Benefit Type',
      description: 'Indicate your relationship to the qualifying individual and which benefit you are applying for.',
      fields: [
        { id: 'relationship', label: 'Your relationship to the qualifying individual', type: 'radio', required: true, options: [
          { label: 'Spouse', value: 'Spouse' },
          { label: 'Biological Child', value: 'BiologicalChild' },
          { label: 'Stepchild', value: 'Stepchild' },
          { label: 'Adopted Child', value: 'AdoptedChild' },
        ]},
        { id: 'benefitType', label: 'Benefit you are applying for', type: 'radio', required: true, helpText: 'Chapter 35 DEA is for dependents of permanently disabled or deceased veterans. Fry Scholarship (Chapter 33) is for children/spouses of service members who died in the line of duty on or after 9/11.', options: [
          { label: 'Chapter 35 – DEA (Survivors & Dependents Educational Assistance)', value: 'DEA' },
          { label: 'Chapter 33 – Fry Scholarship', value: 'Fry' },
        ]},
        { id: 'marriageDate', label: 'Date of Marriage (if applying as spouse)', type: 'date', helpText: 'Leave blank if applying as a child.' },
        { id: 'remarried', label: 'Have you remarried since the veteran\'s death?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
      ],
    },
    {
      id: 'education',
      title: 'Education Information',
      description: 'Your education background and training plans.',
      fields: [
        { id: 'hsGraduated', label: 'Have you graduated high school or received a GED?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'previouslyReceivedVABenefits', label: 'Have you previously received VA education benefits?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'educationType', label: 'Type of Training', type: 'radio', required: true, helpText: 'Select the primary type of education or training you plan to pursue.', options: [
          { label: 'College or Other School', value: 'college' },
          { label: 'Correspondence', value: 'correspondence' },
          { label: 'Apprenticeship / OJT', value: 'apprenticeship' },
          { label: 'Flight Training', value: 'flight' },
          { label: 'Farm Cooperative', value: 'farm' },
        ]},
        { id: 'schoolName', label: 'School Name and Address', type: 'textarea', helpText: 'Include full name, street, city, state, and ZIP.' },
        { id: 'educationObjective', label: 'Educational / Career Objective', type: 'text', helpText: 'Describe the degree, certificate, or career goal you are working toward.' },
      ],
    },
    {
      id: 'servicePeriods',
      title: 'Your Active Duty Periods (If Any)',
      description: 'If you served on active duty yourself, list your service periods here. Leave blank if you did not serve.',
      fields: [
        { id: 'sp1Entered', label: 'Period 1 – Date Entered', type: 'date', profilePath: 'servicePeriods[0].date_entered' },
        { id: 'sp1Separated', label: 'Period 1 – Date Separated', type: 'date', profilePath: 'servicePeriods[0].date_separated' },
        { id: 'sp1Branch', label: 'Period 1 – Branch', type: 'select', profilePath: 'servicePeriods[0].branch', options: branchOptions },
        { id: 'sp1Discharge', label: 'Period 1 – Character of Discharge', type: 'select', profilePath: 'servicePeriods[0].character_of_discharge', options: dischargeOptions },
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
};
