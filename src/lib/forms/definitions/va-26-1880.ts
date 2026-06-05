import type { FormDefinition } from '../types';
import { stateOptions, branchOptions } from '@/lib/validation';

const dischargeOptions = [
  { label: 'Honorable', value: 'Honorable' },
  { label: 'General Under Honorable Conditions', value: 'General' },
  { label: 'Other Than Honorable', value: 'OTH' },
  { label: 'Bad Conduct', value: 'Bad Conduct' },
  { label: 'Dishonorable', value: 'Dishonorable' },
  { label: 'Uncharacterized', value: 'Uncharacterized' },
  { label: 'N/A – Still Serving', value: 'N/A' },
];

export const va261880: FormDefinition = {
  id: 'va-26-1880',
  version: 1,
  formNumber: 'VA 26-1880',
  title: 'Request for Certificate of Eligibility',
  description:
    'Request your VA Home Loan Certificate of Eligibility (COE). This document proves to lenders that you qualify for a VA-backed home loan, which offers competitive interest rates, no down payment requirement, and no private mortgage insurance.',
  pdfTemplate: '/forms/VA-26-1880.pdf',
  category: 'home-loan',
  nextSteps:
    'Mail this form with your supporting documents to: VA Eligibility Center, P.O. Box 20729, Winston-Salem, NC 27120. Processing typically takes 7–10 business days. You can also apply online at VA.gov for faster processing.',
  steps: [
    // ─── Step 1: Personal Information ──────────────────────────────────────────
    {
      id: 'personal',
      title: 'Personal Information',
      description:
        'Enter your name and identifying information exactly as they appear on your military records. VA uses your Social Security Number and VA File Number to locate your service record and any prior benefit history.',
      fields: [
        {
          id: 'firstName',
          label: 'First Name',
          type: 'text',
          required: true,
          profilePath: 'profile.first_name',
        },
        {
          id: 'middleName',
          label: 'Middle Name',
          type: 'text',
          profilePath: 'profile.middle_name',
        },
        {
          id: 'lastName',
          label: 'Last Name',
          type: 'text',
          required: true,
          profilePath: 'profile.last_name',
        },
        {
          id: 'suffix',
          label: 'Suffix',
          type: 'select',
          profilePath: 'profile.suffix',
          options: [
            { label: 'Jr.', value: 'Jr' },
            { label: 'Sr.', value: 'Sr' },
            { label: 'II', value: 'II' },
            { label: 'III', value: 'III' },
            { label: 'IV', value: 'IV' },
          ],
        },
        {
          id: 'ssn',
          label: 'Social Security Number',
          type: 'ssn',
          required: true,
          profilePath: 'profile.ssn_encrypted',
        },
        {
          id: 'dob',
          label: 'Date of Birth',
          type: 'date',
          profilePath: 'profile.dob',
        },
        {
          id: 'vaFileNumber',
          label: 'VA File Number',
          type: 'text',
          profilePath: 'profile.va_file_number',
          helpText:
            'Your VA claim file number if you have one. Leave blank if unknown.',
        },
      ],
    },

    // ─── Step 2: Contact Information ───────────────────────────────────────────
    {
      id: 'contact',
      title: 'Contact Information',
      description:
        "Provide your current mailing address so VA can send your Certificate of Eligibility and any correspondence about your request. Make sure the address is current — the COE will be mailed here if it isn't returned electronically.",
      fields: [
        {
          id: 'street',
          label: 'Mailing Address (Street)',
          type: 'text',
          required: true,
          profilePath: 'profile.address_street',
        },
        {
          id: 'apt',
          label: 'Apt / Unit',
          type: 'text',
          profilePath: 'profile.address_apt',
        },
        {
          id: 'city',
          label: 'City',
          type: 'text',
          required: true,
          profilePath: 'profile.address_city',
        },
        {
          id: 'state',
          label: 'State',
          type: 'select',
          required: true,
          profilePath: 'profile.address_state',
          options: stateOptions,
        },
        {
          id: 'zip',
          label: 'ZIP Code',
          type: 'text',
          required: true,
          profilePath: 'profile.address_zip',
        },
        {
          id: 'daytimePhone',
          label: 'Daytime Phone',
          type: 'phone',
          profilePath: 'profile.phone_mobile',
        },
        {
          id: 'email',
          label: 'Email Address',
          type: 'email',
          profilePath: 'profile.email',
        },
      ],
    },

    // ─── Step 3: Type of Loan ───────────────────────────────────────────────────
    {
      id: 'loanInfo',
      title: 'Type of Loan',
      description:
        'Tell VA what you plan to use the loan benefit for. Different loan purposes may require different supporting documents or affect your funding fee. If you have used your VA home loan benefit before, VA needs to verify your remaining entitlement.',
      fields: [
        {
          id: 'loanPurpose',
          label: 'Purpose of Loan',
          type: 'radio',
          required: true,
          options: [
            { label: 'Purchase a Home', value: 'Purchase' },
            { label: 'Cash-out Refinance (regular)', value: 'CashOutRefi' },
            {
              label: 'Interest Rate Reduction Refinancing Loan (IRRRL)',
              value: 'IRRRL',
            },
            { label: 'Manufactured Home', value: 'ManufacturedHome' },
            { label: 'Native American Direct Loan', value: 'NADL' },
          ],
        },
        {
          id: 'propertyAddress',
          label: 'Property Address',
          type: 'textarea',
          placeholder: 'Full property address including city, state, and ZIP',
          helpText:
            'Enter the address of the property you are purchasing or refinancing. Leave blank if you have not yet identified a property.',
        },
        {
          id: 'priorUse',
          label: 'Have you previously used your VA home loan benefit?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'entitlementRestored',
          label: 'Was your prior entitlement restored?',
          type: 'radio',
          condition: { field: 'priorUse', value: 'Yes' },
          helpText:
            'Entitlement can be restored after a prior VA loan is paid in full and the property sold, or in certain other circumstances.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'stillOwnPriorHome',
          label: 'Do you still own the home purchased with that VA loan?',
          type: 'radio',
          condition: { field: 'priorUse', value: 'Yes' },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
      ],
    },

    // ─── Step 4: Military Service — Period 1 ───────────────────────────────────
    {
      id: 'service1',
      title: 'Military Service — Period 1',
      description:
        'Enter your most recent period of military service. VA uses your service dates and discharge type to confirm you meet the minimum active-duty requirements for the VA home loan benefit. If you served multiple periods, you will be asked about those in the next step.',
      fields: [
        {
          id: 'service1Branch',
          label: 'Branch of Service',
          type: 'select',
          required: true,
          profilePath: 'servicePeriods[0].branch',
          options: branchOptions,
        },
        {
          id: 'service1Entered',
          label: 'Date Entered Service',
          type: 'date',
          required: true,
          profilePath: 'servicePeriods[0].date_entered',
        },
        {
          id: 'service1Separated',
          label: 'Date Separated / Released',
          type: 'date',
          profilePath: 'servicePeriods[0].date_separated',
          helpText: 'Leave blank if you are still serving.',
        },
        {
          id: 'service1Discharge',
          label: 'Character of Discharge',
          type: 'select',
          required: true,
          profilePath: 'servicePeriods[0].character_of_discharge',
          options: dischargeOptions,
        },
        {
          id: 'onActiveDuty',
          label: 'Are you currently on active duty?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'expectedSeparation',
          label: 'Expected Separation Date',
          type: 'date',
          condition: { field: 'onActiveDuty', value: 'Yes' },
          helpText:
            'Active duty members may be eligible 90 days before their expected separation date.',
        },
      ],
    },

    // ─── Step 5: Military Service — Periods 2 & 3 ─────────────────────────────
    {
      id: 'service23',
      title: 'Military Service — Periods 2 & 3',
      description:
        'If you served multiple periods of military service, enter them here. Each period of service may affect your entitlement calculation. Leave all fields blank if this does not apply to you.',
      fields: [
        // Period 2
        {
          id: 'service2Branch',
          label: 'Period 2 — Branch of Service',
          type: 'select',
          profilePath: 'servicePeriods[1].branch',
          options: branchOptions,
        },
        {
          id: 'service2Entered',
          label: 'Period 2 — Date Entered Service',
          type: 'date',
          profilePath: 'servicePeriods[1].date_entered',
        },
        {
          id: 'service2Separated',
          label: 'Period 2 — Date Separated / Released',
          type: 'date',
          profilePath: 'servicePeriods[1].date_separated',
        },
        {
          id: 'service2Discharge',
          label: 'Period 2 — Character of Discharge',
          type: 'select',
          profilePath: 'servicePeriods[1].character_of_discharge',
          options: dischargeOptions,
        },
        // Period 3
        {
          id: 'service3Branch',
          label: 'Period 3 — Branch of Service',
          type: 'select',
          profilePath: 'servicePeriods[2].branch',
          options: branchOptions,
        },
        {
          id: 'service3Entered',
          label: 'Period 3 — Date Entered Service',
          type: 'date',
          profilePath: 'servicePeriods[2].date_entered',
        },
        {
          id: 'service3Separated',
          label: 'Period 3 — Date Separated / Released',
          type: 'date',
          profilePath: 'servicePeriods[2].date_separated',
        },
        {
          id: 'service3Discharge',
          label: 'Period 3 — Character of Discharge',
          type: 'select',
          profilePath: 'servicePeriods[2].character_of_discharge',
          options: dischargeOptions,
        },
      ],
    },

    // ─── Step 6: Prior VA Loans ─────────────────────────────────────────────────
    {
      id: 'priorLoans',
      title: 'Prior VA Loans',
      description:
        "VA needs to know about any previous VA-backed home loans to determine your remaining entitlement. Your total entitlement is the amount VA guarantees to a lender. If you still have an outstanding VA loan, your remaining (or \"bonus\") entitlement may affect the loan amount available to you.",
      fields: [
        {
          id: 'hadPriorLoan',
          label: 'Have you ever had a VA-guaranteed home loan?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'priorLoanAddress',
          label: 'Property Address of Prior VA Loan',
          type: 'textarea',
          condition: { field: 'hadPriorLoan', value: 'Yes' },
          helpText: 'Enter the full address of the property secured by the prior VA-guaranteed loan.',
        },
        {
          id: 'priorLoanAmount',
          label: 'Approximate Loan Amount',
          type: 'text',
          condition: { field: 'hadPriorLoan', value: 'Yes' },
          placeholder: 'e.g., $250,000',
        },
        {
          id: 'priorLoanDate',
          label: 'Date of Loan',
          type: 'text',
          condition: { field: 'hadPriorLoan', value: 'Yes' },
          placeholder: 'e.g., June 2018',
          helpText: 'An approximate month and year is fine.',
        },
        {
          id: 'priorLoanPaidOff',
          label: 'Was the loan paid in full?',
          type: 'radio',
          condition: { field: 'hadPriorLoan', value: 'Yes' },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'priorPropertySold',
          label: 'Was the property sold?',
          type: 'radio',
          condition: { field: 'hadPriorLoan', value: 'Yes' },
          helpText:
            'Entitlement is typically restored only when both the loan is paid in full and the property has been sold.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
      ],
    },

    // ─── Step 7: Required Documents ────────────────────────────────────────────
    {
      id: 'requiredDocs',
      title: 'Required Documents',
      description:
        'Upload or gather the supporting documents listed below before submitting your request. VA cannot process your Certificate of Eligibility request without proof of your qualifying military service.',
      fields: [],
      requiredAttachments: [
        {
          label: 'DD-214, Member 4 Copy',
          helpText: 'One copy required per period of active duty service. If you do not have your DD-214, request a copy through the National Archives milConnect portal.',
          condition: 'Required for veterans who have been discharged',
        },
        {
          label: 'Statement of Service on Official Letterhead',
          helpText:
            'Must include your full name, Social Security Number, date of birth, date of entry on active duty, expected separation date, and the commanding officer\'s signature.',
          condition: 'Active duty members only',
        },
      ],
      optionalAttachments: [
        {
          label: 'Discharge Certificate (NGB-22)',
          helpText:
            'The NGB-22 is the National Guard equivalent of the DD-214 and documents federal activation periods.',
          condition: 'National Guard members who were federally activated',
        },
      ],
    },

    // ─── Step 8: Certification & Signature ─────────────────────────────────────
    {
      id: 'signature',
      title: 'Certification & Signature',
      description:
        'By signing below you certify under penalty of law that all information provided on this form is true and correct to the best of your knowledge and belief. Intentionally providing false information to obtain a federal benefit is a federal crime under 18 U.S.C. § 1001 and may result in fines, imprisonment, or both.\n\nPRIVACY ACT NOTICE: Information you provide is protected under the Privacy Act of 1974. VA uses this information only to determine your eligibility for the home loan benefit and will not disclose it except as authorized by law.',
      fields: [
        {
          id: 'privacyAct',
          label:
            'I certify that all statements on this application are true and correct to the best of my knowledge and belief.',
          type: 'checkbox',
          required: true,
          helpText:
            'You must check this box to certify your answers before signing.',
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
  ],

  computeAnswers: (answers) => {
    const s = (v: unknown) => String(v ?? '').trim();

    // Full name in "Last, First [Middle]" format (PDF NameOfVeteran field)
    const last = s(answers.lastName);
    const first = s(answers.firstName);
    const mid   = s(answers.middleName);
    const nameParts = [first, mid].filter(Boolean).join(' ');
    const fullName  = last && nameParts ? `${last}, ${nameParts}` : last || nameParts;

    // SSN formatted as "XXX-XX-XXXX"
    const rawSsn = s(answers.ssn).replace(/\D/g, '');
    const ssnFormatted = rawSsn.length === 9
      ? `${rawSsn.slice(0, 3)}-${rawSsn.slice(3, 5)}-${rawSsn.slice(5)}`
      : s(answers.ssn);

    // Full address as one line: "Street [Apt], City, ST ZIP"
    const streetLine = [s(answers.street), s(answers.apt)].filter(Boolean).join(' ');
    const statePart  = [s(answers.state), s(answers.zip)].filter(Boolean).join(' ');
    const fullAddress = [streetLine, s(answers.city), statePart]
      .filter(Boolean).join(', ');

    // Phone formatted as "(XXX) XXX-XXXX"
    const rawPhone = s(answers.daytimePhone).replace(/\D/g, '');
    const phoneFormatted = rawPhone.length === 10
      ? `(${rawPhone.slice(0, 3)}) ${rawPhone.slice(3, 6)}-${rawPhone.slice(6)}`
      : s(answers.daytimePhone);

    return { ...answers, fullName, ssnFormatted, fullAddress, phoneFormatted };
  },
};
