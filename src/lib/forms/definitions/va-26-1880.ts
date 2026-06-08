import type { FormDefinition } from '../types';
import { stateOptions, branchOptions } from '@/lib/validation';

const restorationOptions = [
  { label: 'No — entitlement inquiry only', value: 'Inquiry' },
  { label: 'Cash-out refinance restoration', value: 'CashOutRestoration' },
  { label: 'Interest Rate Reduction Refinance (IRRRL)', value: 'IRRRLRestoration' },
  { label: 'One-time restoration', value: 'OneTimeRestoration' },
];

export const va261880: FormDefinition = {
  id: 'va-26-1880',
  version: 2,
  formNumber: 'VA 26-1880',
  title: 'Request for a Certificate of Eligibility',
  description:
    'Request your VA Home Loan Certificate of Eligibility (COE). This document proves to lenders that you qualify for a VA-backed home loan, which offers competitive interest rates, no down payment requirement, and no private mortgage insurance.',
  pdfTemplate: '/forms/VA-26-1880.pdf',
  category: 'home-loan',
  nextSteps:
    'Mail the completed form to your VA Regional Loan Center of jurisdiction (addresses are on page 4 of the form). For faster service, most veterans can get a COE instantly at VA.gov or through their lender.',
  steps: [
    // ─── Step 1: Name (Section I, Item 1–2) ────────────────────────────────
    {
      id: 'identity',
      title: 'Your Name',
      description:
        'Enter your name exactly as you want it to appear on your Certificate of Eligibility. If it differs from your service records, you may be asked for supporting documents (e.g., a marriage certificate or court order).',
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
          label: 'Middle Initial',
          type: 'text',
          profilePath: 'profile.middle_name',
          maxLength: 1,
          helpText: 'One letter only.',
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
            { label: 'None', value: '' },
            { label: 'Jr.', value: 'Jr.' },
            { label: 'Sr.', value: 'Sr.' },
            { label: 'II', value: 'II' },
            { label: 'III', value: 'III' },
            { label: 'IV', value: 'IV' },
          ],
        },
        {
          id: 'servedUnderAnotherName',
          label: 'Did you serve under another name? (Item 2A)',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'otherNames',
          label: 'Other name(s) used during military service (Item 2B)',
          type: 'text',
          condition: { field: 'servedUnderAnotherName', value: 'Yes' },
          placeholder: 'As shown on your DD-214',
          helpText: 'Enter the name exactly as it appears on your discharge certificate (DD Form 214).',
        },
      ],
    },

    // ─── Step 2: Contact Information (Section I, Item 3, 7, 8) ──────────────
    {
      id: 'contact',
      title: 'Contact Information',
      description:
        'Provide your current mailing address and contact details so VA can reach you and mail your Certificate of Eligibility if it is not issued electronically.',
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
          label: 'Telephone Number',
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

    // ─── Step 3: Identifiers & Disability (Section I, Items 4–6, 9) ─────────
    {
      id: 'identifiers',
      title: 'Identifiers',
      description:
        'VA uses these identifiers to locate your service record and any prior benefit history.',
      fields: [
        {
          id: 'dob',
          label: 'Date of Birth',
          type: 'date',
          required: true,
          profilePath: 'profile.dob',
        },
        {
          id: 'ssn',
          label: 'Social Security Number',
          type: 'ssn',
          required: true,
          profilePath: 'profile.ssn_encrypted',
          helpText: 'Your 9-digit SSN. Entered securely and used to identify your VA record.',
        },
        {
          id: 'serviceNumber',
          label: 'Service Number (Item 6)',
          type: 'text',
          placeholder: 'If applicable',
          helpText:
            'Veterans who served before July 1972 were assigned a separate service number. Leave blank if your SSN is your service number.',
        },
        {
          id: 'dischargedForDisability',
          label: 'Were you discharged, retired, or separated from service because of a disability? (Item 9A)',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'vaFileNumber',
          label: 'VA Claim Number (Item 9B)',
          type: 'text',
          profilePath: 'profile.va_file_number',
          placeholder: 'If known',
          helpText:
            'In most cases this is the same as your SSN. If you are not sure, leave it blank.',
        },
      ],
    },

    // ─── Step 4: Service Status (Section II, Items 10A–10C) ─────────────────
    {
      id: 'serviceStatus',
      title: 'Service Status',
      description:
        'These answers determine whether the VA funding fee may be waived. A current active-duty Purple Heart recipient, or a veteran with a qualifying pre-discharge disability rating, may be exempt from the funding fee.',
      fields: [
        {
          id: 'onActiveDuty',
          label: 'Are you currently on active duty? (Item 10A)',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'purpleHeart',
          label: 'Are you a Purple Heart recipient? (Item 10B)',
          type: 'radio',
          required: true,
          helpText:
            'The VA funding fee may not be collected from an active-duty service member who has been awarded the Purple Heart. You may be asked to provide evidence of the award. (Title 32 activations do not qualify for this exemption.)',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'predischargeClaim',
          label: 'Do you have a pre-discharge claim pending with VA? (Item 10C)',
          type: 'radio',
          required: true,
          helpText:
            'The funding fee may be waived for a veteran rated eligible to receive compensation as the result of a pre-discharge disability exam and rating (or a memorandum rating). If the rating is not obtained before closing, the exemption does not apply.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
      ],
    },

    // ─── Step 5: Active Service — Period 1 (Item 11A) ──────────────────────
    {
      id: 'activeService1',
      title: 'Active Service — Period 1',
      description:
        'List your active-duty service. Do NOT include Active Duty for Training or Active Guard Reserve service here — but DO include any Reserve or Guard activation under Title 10, or full-time National Guard duty under Title 32 §§ 316, 502, 503, 504, or 505.',
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
          label: 'Date Entered',
          type: 'date',
          required: true,
          profilePath: 'servicePeriods[0].date_entered',
        },
        {
          id: 'service1Separated',
          label: 'Date Separated',
          type: 'date',
          profilePath: 'servicePeriods[0].date_separated',
          helpText: 'Leave blank if you are still serving.',
        },
      ],
    },

    // ─── Step 6: Active Service — Periods 2–4 (Item 11A) ───────────────────
    {
      id: 'activeService234',
      title: 'Active Service — Additional Periods',
      description:
        'If you served additional periods of active duty, enter them here. Leave blank any period that does not apply.',
      fields: [
        { id: 'service2Branch',    label: 'Period 2 — Branch',         type: 'select', profilePath: 'servicePeriods[1].branch', options: branchOptions },
        { id: 'service2Entered',   label: 'Period 2 — Date Entered',   type: 'date',   profilePath: 'servicePeriods[1].date_entered' },
        { id: 'service2Separated', label: 'Period 2 — Date Separated', type: 'date',   profilePath: 'servicePeriods[1].date_separated' },
        { id: 'service3Branch',    label: 'Period 3 — Branch',         type: 'select', profilePath: 'servicePeriods[2].branch', options: branchOptions },
        { id: 'service3Entered',   label: 'Period 3 — Date Entered',   type: 'date',   profilePath: 'servicePeriods[2].date_entered' },
        { id: 'service3Separated', label: 'Period 3 — Date Separated', type: 'date',   profilePath: 'servicePeriods[2].date_separated' },
        { id: 'service4Branch',    label: 'Period 4 — Branch',         type: 'select', options: branchOptions },
        { id: 'service4Entered',   label: 'Period 4 — Date Entered',   type: 'date' },
        { id: 'service4Separated', label: 'Period 4 — Date Separated', type: 'date' },
      ],
    },

    // ─── Step 7: Reserve / National Guard Service (Item 11B) ───────────────
    {
      id: 'guardReserve',
      title: 'Reserve / National Guard Service',
      description:
        'Enter Selected Reserve or National Guard service here, INCLUDING any Active Duty for Training (ADT) or Active Guard Reserve service. Do NOT include Title 10 activations or full-time Title 32 National Guard duty (those belong under Active Service). Leave blank if this does not apply.',
      fields: [
        {
          id: 'hadGuardReserveService',
          label: 'Did you serve in the Selected Reserve or National Guard?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        { id: 'guardService1Branch',    label: 'Period 1 — Branch',         type: 'select', condition: { field: 'hadGuardReserveService', value: 'Yes' }, options: branchOptions },
        { id: 'guardService1Entered',   label: 'Period 1 — Date Entered',   type: 'date',   condition: { field: 'hadGuardReserveService', value: 'Yes' } },
        { id: 'guardService1Separated', label: 'Period 1 — Date Separated', type: 'date',   condition: { field: 'hadGuardReserveService', value: 'Yes' } },
        { id: 'guardService2Branch',    label: 'Period 2 — Branch',         type: 'select', condition: { field: 'hadGuardReserveService', value: 'Yes' }, options: branchOptions },
        { id: 'guardService2Entered',   label: 'Period 2 — Date Entered',   type: 'date',   condition: { field: 'hadGuardReserveService', value: 'Yes' } },
        { id: 'guardService2Separated', label: 'Period 2 — Date Separated', type: 'date',   condition: { field: 'hadGuardReserveService', value: 'Yes' } },
        { id: 'guardService3Branch',    label: 'Period 3 — Branch',         type: 'select', condition: { field: 'hadGuardReserveService', value: 'Yes' }, options: branchOptions },
        { id: 'guardService3Entered',   label: 'Period 3 — Date Entered',   type: 'date',   condition: { field: 'hadGuardReserveService', value: 'Yes' } },
        { id: 'guardService3Separated', label: 'Period 3 — Date Separated', type: 'date',   condition: { field: 'hadGuardReserveService', value: 'Yes' } },
        { id: 'guardService4Branch',    label: 'Period 4 — Branch',         type: 'select', condition: { field: 'hadGuardReserveService', value: 'Yes' }, options: branchOptions },
        { id: 'guardService4Entered',   label: 'Period 4 — Date Entered',   type: 'date',   condition: { field: 'hadGuardReserveService', value: 'Yes' } },
        { id: 'guardService4Separated', label: 'Period 4 — Date Separated', type: 'date',   condition: { field: 'hadGuardReserveService', value: 'Yes' } },
      ],
    },

    // ─── Step 8: How You'll Use Your COE (Section III, Item 12) ────────────
    {
      id: 'loanPurpose',
      title: 'How You Will Use Your COE',
      description: 'Indicate how you intend to use your Certificate of Eligibility.',
      fields: [
        {
          id: 'loanPurpose',
          label: 'How will you use your Certificate of Eligibility? (Item 12)',
          type: 'radio',
          required: true,
          options: [
            { label: 'Entitlement inquiry only', value: 'Inquiry' },
            { label: 'Purchase a home', value: 'Purchase' },
            { label: 'Cash-out refinance', value: 'CashOut' },
            { label: 'Interest Rate Reduction Refinance Loan (IRRRL)', value: 'IRRRL' },
          ],
        },
      ],
    },

    // ─── Step 9: Previous VA Loans (Section III, Items 13–16) ──────────────
    {
      id: 'priorLoans',
      title: 'Previous VA Loans',
      description:
        'VA needs to know about prior VA-guaranteed home loans to determine your remaining entitlement and whether any entitlement can be restored.',
      fields: [
        {
          id: 'priorUse',
          label: 'Have you used the VA home loan program before? (Item 13A)',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'stillOwnHomes',
          label: 'Do you still own any of the homes you used the VA home loan program for? (Item 13B)',
          type: 'radio',
          condition: { field: 'priorUse', value: 'Yes' },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },

        // Previous loan 1 (Items 14A–14D)
        {
          id: 'priorLoan1Address',
          label: 'Loan 1 — Property Address (Item 14A)',
          type: 'textarea',
          condition: { field: 'stillOwnHomes', value: 'Yes' },
        },
        {
          id: 'priorLoan1Number',
          label: 'Loan 1 — VA Loan Number (Item 14B)',
          type: 'text',
          condition: { field: 'stillOwnHomes', value: 'Yes' },
        },
        {
          id: 'priorLoan1Date',
          label: 'Loan 1 — Date of Loan (Item 14C)',
          type: 'text',
          condition: { field: 'stillOwnHomes', value: 'Yes' },
          placeholder: 'Month and year (e.g., June 2018)',
        },
        {
          id: 'restorationType1',
          label: 'Loan 1 — Are you applying for entitlement restoration? (Item 14D)',
          type: 'radio',
          condition: { field: 'stillOwnHomes', value: 'Yes' },
          options: restorationOptions,
        },

        // Previous loan 2 (Items 15A–15D)
        {
          id: 'hadPriorLoan2',
          label: 'Do you have a second previous VA loan to report?',
          type: 'radio',
          condition: { field: 'stillOwnHomes', value: 'Yes' },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'priorLoan2Address',
          label: 'Loan 2 — Property Address (Item 15A)',
          type: 'textarea',
          condition: { field: 'hadPriorLoan2', value: 'Yes' },
        },
        {
          id: 'priorLoan2Number',
          label: 'Loan 2 — VA Loan Number (Item 15B)',
          type: 'text',
          condition: { field: 'hadPriorLoan2', value: 'Yes' },
        },
        {
          id: 'priorLoan2Date',
          label: 'Loan 2 — Date of Loan (Item 15C)',
          type: 'text',
          condition: { field: 'hadPriorLoan2', value: 'Yes' },
          placeholder: 'Month and year',
        },
        {
          id: 'restorationType2',
          label: 'Loan 2 — Are you applying for entitlement restoration? (Item 15D)',
          type: 'radio',
          condition: { field: 'hadPriorLoan2', value: 'Yes' },
          options: restorationOptions,
        },

        // Previous loan 3 (Items 16A–16D)
        {
          id: 'hadPriorLoan3',
          label: 'Do you have a third previous VA loan to report?',
          type: 'radio',
          condition: { field: 'hadPriorLoan2', value: 'Yes' },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'priorLoan3Address',
          label: 'Loan 3 — Property Address (Item 16A)',
          type: 'textarea',
          condition: { field: 'hadPriorLoan3', value: 'Yes' },
        },
        {
          id: 'priorLoan3Number',
          label: 'Loan 3 — VA Loan Number (Item 16B)',
          type: 'text',
          condition: { field: 'hadPriorLoan3', value: 'Yes' },
        },
        {
          id: 'priorLoan3Date',
          label: 'Loan 3 — Date of Loan (Item 16C)',
          type: 'text',
          condition: { field: 'hadPriorLoan3', value: 'Yes' },
          placeholder: 'Month and year',
        },
        {
          id: 'restorationType3',
          label: 'Loan 3 — Are you applying for entitlement restoration? (Item 16D)',
          type: 'radio',
          condition: { field: 'hadPriorLoan3', value: 'Yes' },
          options: restorationOptions,
        },
      ],
    },

    // ─── Step 10: Natural Disaster (Section III, Item 17) ──────────────────
    {
      id: 'disaster',
      title: 'Disaster-Damaged Property',
      description:
        'Answer this only if a home you financed with a VA loan was damaged or destroyed by a federally declared natural disaster.',
      fields: [
        {
          id: 'ownDisasterHome',
          label:
            'Do you still own a property financed with a VA home loan that was substantially damaged or destroyed by a federally declared natural disaster? (Item 17A)',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'disasterLoanDate',
          label: 'Date of Loan (Item 17B)',
          type: 'text',
          condition: { field: 'ownDisasterHome', value: 'Yes' },
          placeholder: 'Month and year',
        },
        {
          id: 'disasterLossDate',
          label: 'Date of Loss (Item 17C)',
          type: 'text',
          condition: { field: 'ownDisasterHome', value: 'Yes' },
          placeholder: 'Month and year',
        },
        {
          id: 'disasterPropertyAddress',
          label: 'Address of Property (Item 17D)',
          type: 'textarea',
          condition: { field: 'ownDisasterHome', value: 'Yes' },
        },
      ],
    },

    // ─── Step 11: Remarks (Section III, Item 18) ───────────────────────────
    {
      id: 'remarks',
      title: 'Remarks',
      description: 'Use this space for any additional information you want to provide. Optional.',
      fields: [
        {
          id: 'remarks',
          label: 'Remarks (Item 18)',
          type: 'textarea',
          helpText: 'Optional. Add any clarifications or the address of a property you intend to purchase, if relevant.',
        },
      ],
    },

    // ─── Step 12: Certification & Signature (Section IV, Item 19) ───────────
    {
      id: 'signature',
      title: 'Certification & Signature',
      description:
        'I CERTIFY THAT the statements in this document are true and complete to the best of my knowledge.\n\nFederal statutes provide severe penalties for fraud, intentional misrepresentation, or conspiracy intended to influence the issuance of any guaranty or insurance by the Secretary of Veterans Affairs (e.g., 18 U.S.C. §§ 1001, 372, and 287).',
      fields: [
        {
          id: 'privacyAct',
          label:
            'I certify that the statements in this document are true and complete to the best of my knowledge.',
          type: 'checkbox',
          required: true,
          helpText: 'You must check this box to certify your answers before signing.',
        },
        {
          id: 'signaturePad',
          label: 'Signature of Veteran (Item 19A)',
          type: 'signature',
          required: true,
          helpText: 'Draw your signature using your mouse or finger.',
        },
        {
          id: 'signatureDate',
          label: 'Date Signed (Item 19B)',
          type: 'date',
          required: true,
        },
      ],
    },
  ],

  computeAnswers: (answers) => {
    const s = (v: unknown) => String(v ?? '').trim();

    // Item 1 — Name in "First Middle Last [Suffix]" order
    const first  = s(answers.firstName);
    const mid    = s(answers.middleName);
    const last   = s(answers.lastName);
    const suffix = s(answers.suffix);
    const fullName = [first, mid, last, suffix].filter(Boolean).join(' ');

    // Item 3 — Full address as one line: "Street [Apt], City, ST ZIP"
    const streetLine = [s(answers.street), s(answers.apt)].filter(Boolean).join(' ');
    const statePart  = [s(answers.state), s(answers.zip)].filter(Boolean).join(' ');
    const fullAddress = [streetLine, s(answers.city), statePart].filter(Boolean).join(', ');

    // Item 7 — Phone formatted as "(XXX) XXX-XXXX"
    const rawPhone = s(answers.daytimePhone).replace(/\D/g, '');
    const phoneFormatted = rawPhone.length === 10
      ? `(${rawPhone.slice(0, 3)}) ${rawPhone.slice(3, 6)}-${rawPhone.slice(6)}`
      : s(answers.daytimePhone);

    // Item 5 — SSN is written digits-only by the mapping transform (field maxLength=9)
    return { ...answers, fullName, fullAddress, phoneFormatted };
  },
};
