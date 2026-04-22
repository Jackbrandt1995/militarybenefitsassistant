import type { FormDefinition } from '../types';
import { branchOptions, stateOptions } from '@/lib/validation';

export const va225495: FormDefinition = {
  id: 'va-22-5495',
  version: 2,
  formNumber: 'VA 22-5495',
  title: "Dependents' Request for Change of Program or Place of Training",
  description: 'Request a change of school or program while using DEA (Chapter 35) or Fry Scholarship (Chapter 33) benefits.',
  pdfTemplate: '/forms/VA-22-5495.pdf',
  category: 'dependent',
  steps: [
    {
      id: 'applicant',
      title: 'Personal Information',
      description: 'Your name and identifying information as the dependent applicant.',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'middleName', label: 'Middle Name', type: 'text', profilePath: 'profile.middle_name' },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name' },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted', helpText: 'Your 9-digit SSN (not the veteran\'s).' },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number', helpText: 'If different from your SSN. Leave blank if unknown.' },
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
        { id: 'primaryPhone', label: 'Primary Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'secondaryPhone', label: 'Secondary Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'email', label: 'Email Address', type: 'email', profilePath: 'profile.email' },
      ],
    },
    {
      id: 'directDeposit',
      title: 'Direct Deposit Information',
      description: 'VA will deposit your benefit payments directly into your bank account.',
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
        { id: 'qiDateOfDeath', label: 'Date of Death / MIA / POW (if applicable)', type: 'date', helpText: 'Leave blank if not applicable.' },
      ],
    },
    {
      id: 'program',
      title: 'Benefit & Program Change',
      description: 'Describe the change you are requesting and provide information about your new school or program.',
      fields: [
        { id: 'benefitType', label: 'Benefit Type', type: 'radio', required: true, options: [
          { label: 'Chapter 33 – Fry Scholarship', value: 'Fry' },
          { label: 'Chapter 35 – DEA (Survivors & Dependents Educational Assistance)', value: 'DEA' },
        ]},
        { id: 'educationType', label: 'Type of Training', type: 'radio', required: true, helpText: 'How will you take training at the new location?', options: [
          { label: 'College or Other School', value: 'college' },
          { label: 'Licensing / Certification Test', value: 'licensing' },
          { label: 'Apprenticeship / OJT', value: 'apprenticeship' },
          { label: 'Correspondence', value: 'correspondence' },
          { label: 'Flight Training', value: 'flight' },
        ]},
        { id: 'programName', label: 'Program Name', type: 'text', helpText: 'The name of your degree program, major, or training curriculum.' },
        { id: 'educationGoal', label: 'Educational / Career Objective', type: 'text', helpText: 'Describe the degree, certificate, or career goal you are working toward.' },
        { id: 'newSchool', label: 'New School Name & Address', type: 'textarea', helpText: 'Include full name, street, city, state, and ZIP.' },
        { id: 'oldSchool', label: 'Current or Previous School Name & Address', type: 'textarea', helpText: 'Include full name, street, city, state, and ZIP.' },
        { id: 'whyStopped', label: 'When and Why Did You Stop Training?', type: 'textarea', helpText: 'Briefly explain the reason for leaving your previous program.' },
        { id: 'remarks', label: 'Remarks', type: 'textarea', helpText: 'Include any additional information relevant to your change request.' },
      ],
    },
    {
      id: 'emergencyContact',
      title: 'Emergency Contact',
      description: 'Optional: Provide an emergency contact person.',
      fields: [
        { id: 'emergencyName', label: 'Emergency Contact Name', type: 'text' },
        { id: 'emergencyAddress', label: 'Emergency Contact Address', type: 'text' },
        { id: 'emergencyPhone', label: 'Emergency Contact Phone', type: 'phone' },
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
        { id: 'signaturePad', label: 'Your Signature', type: 'signature', required: true, helpText: 'Draw your signature in the box below.' },
        { id: 'signatureDate', label: 'Date Signed', type: 'date', required: true },
      ],
    },
    {
      id: 'attachments',
      title: 'Attach Supporting Documents',
      description: 'Upload any documents that support your change request. PDF files will be merged directly into your downloaded form.',
      fields: [],
    },
  ],
};
