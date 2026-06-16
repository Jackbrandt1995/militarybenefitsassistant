import type { FormDefinition } from '../types';
import { stateOptions } from '@/lib/validation';

const relationshipOptions = [
  { label: 'Veteran (self)', value: '4' },
  { label: 'Surviving Spouse', value: '5' },
  { label: 'Child (under 18)', value: '6' },
  { label: 'Child (18–23, enrolled in school)', value: '7' },
  { label: 'Child (helpless/permanently disabled)', value: '8' },
  { label: 'Parent', value: '9' },
  { label: 'Court-appointed guardian or fiduciary', value: '10' },
  { label: 'Other', value: '11' },
];

export const va2122a: FormDefinition = {
  id: 'va-21-22a',
  version: 2,
  // Not in the public catalog — surfaced only from the "Have MBA file for me"
  // agent-filing flow, where the veteran appoints MBA as their representative.
  hidden: true,
  formNumber: 'VA 21-22A',
  title: 'Appointment of Individual as Claimant\'s Representative',
  description:
    'Authorize an individual — such as an attorney, accredited claims agent, or trusted family member — to represent you before the VA and act on your behalf in all matters related to your VA benefits.',
  pdfTemplate: '/forms/VA-21-22A.pdf',
  category: 'other',
  nextSteps:
    'Mail or deliver the completed, signed form to your nearest VA Regional Office. Both you (or the claimant) AND the representative must sign before submitting. Find your nearest Regional Office at va.gov/find-locations.',

  steps: [

    // ── STEP 1: Veteran Identity ─────────────────────────────────────────────
    {
      id: 'veteran',
      title: 'Veteran\'s Identity',
      description:
        'Enter the veteran\'s identifying information exactly as it appears on their VA records or DD-214. If you are the veteran, your profile information will be pre-filled.',
      fields: [
        {
          id: 'vetFirstName',
          label: 'First Name',
          type: 'text',
          required: true,
          profilePath: 'profile.first_name',
          maxLength: 30,
        },
        {
          id: 'vetMiddleInitial',
          label: 'Middle Initial',
          type: 'text',
          profilePath: 'profile.middle_name',
          maxLength: 1,
          helpText: 'One letter only.',
        },
        {
          id: 'vetLastName',
          label: 'Last Name',
          type: 'text',
          required: true,
          profilePath: 'profile.last_name',
          maxLength: 30,
        },
        {
          id: 'vetSSN',
          label: 'Social Security Number',
          type: 'ssn',
          required: true,
          profilePath: 'profile.ssn_encrypted',
          helpText: 'The veteran\'s SSN as it appears on VA records.',
        },
        {
          id: 'vetDOB',
          label: 'Date of Birth',
          type: 'date',
          required: true,
          profilePath: 'profile.dob',
        },
        {
          id: 'vetVAFileNumber',
          label: 'VA File Number',
          type: 'text',
          profilePath: 'profile.va_file_number',
          placeholder: 'e.g., C-12345678',
          helpText:
            'Your VA claim file number, if different from your SSN. Starts with "C-". Leave blank if you don\'t have one or it matches your SSN.',
        },
        {
          id: 'vetServiceNumber',
          label: 'Military Service Number',
          type: 'text',
          placeholder: 'Pre-1974 service number (if applicable)',
          helpText:
            'Only veterans who served before 1974 have a separate service number. Leave blank if your SSN is your service number.',
        },
        {
          id: 'branchOfService',
          label: 'Branch of Service (Item 6)',
          type: 'select',
          profilePath: 'servicePeriods[0].branch',
          helpText: 'The veteran\'s branch of service.',
          options: [
            { label: 'Army', value: 'Army' },
            { label: 'Navy', value: 'Navy' },
            { label: 'Air Force', value: 'Air Force' },
            { label: 'Marine Corps', value: 'Marine Corps' },
            { label: 'Coast Guard', value: 'Coast Guard' },
            { label: 'Space Force', value: 'Space Force' },
            { label: 'NOAA', value: 'NOAA' },
            { label: 'USPHS (Public Health Service)', value: 'USPHS' },
          ],
        },
      ],
    },

    // ── STEP 2: Veteran Contact Information ──────────────────────────────────
    {
      id: 'veteran-contact',
      title: 'Veteran\'s Contact Information',
      description:
        'Enter the veteran\'s current mailing address and contact details. VA will use this address to send correspondence about the representation request.',
      fields: [
        {
          id: 'vetStreet',
          label: 'Mailing Address',
          type: 'text',
          required: true,
          profilePath: 'profile.address_street',
          placeholder: '123 Main St',
        },
        {
          id: 'vetApt',
          label: 'Apt / Unit Number',
          type: 'text',
          profilePath: 'profile.address_apt',
          placeholder: 'e.g., Apt 4B (optional)',
        },
        {
          id: 'vetCity',
          label: 'City',
          type: 'text',
          required: true,
          profilePath: 'profile.address_city',
        },
        {
          id: 'vetState',
          label: 'State',
          type: 'select',
          required: true,
          profilePath: 'profile.address_state',
          options: stateOptions,
        },
        {
          id: 'vetZip',
          label: 'ZIP Code',
          type: 'text',
          required: true,
          profilePath: 'profile.address_zip',
          maxLength: 10,
          placeholder: '12345',
        },
        {
          id: 'vetCountry',
          label: 'Country',
          type: 'text',
          placeholder: 'Leave blank if USA',
          helpText: 'Only required if outside the United States.',
        },
        {
          id: 'vetPhone',
          label: 'Daytime Phone',
          type: 'phone',
          profilePath: 'profile.phone_mobile',
        },
        {
          id: 'vetEmail',
          label: 'Email Address',
          type: 'email',
          profilePath: 'profile.email',
        },
      ],
    },

    // ── STEP 2: Claimant Information ────────────────────────────────────────
    {
      id: 'claimant',
      title: 'Claimant\'s Information',
      description:
        'In most cases, the veteran is the claimant. Only complete this section if someone other than the veteran is making the claim — for example, a surviving spouse filing for Dependency and Indemnity Compensation (DIC), or a guardian filing on behalf of an incompetent veteran.',
      fields: [
        {
          id: 'claimantIsVeteran',
          label: 'Is the claimant the same person as the veteran?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes — the veteran is the claimant (skip the fields below)', value: 'Yes' },
            { label: 'No — I am filing on behalf of the veteran as a surviving spouse, guardian, or other claimant', value: 'No' },
          ],
        },
        {
          id: 'claimantRelationshipType',
          label: 'Claimant\'s relationship to the veteran',
          type: 'radio',
          condition: { field: 'claimantIsVeteran', value: 'No' },
          options: relationshipOptions,
          helpText: 'Select the option that best describes your legal relationship to the veteran.',
        },
        {
          id: 'claimantRelationshipOther',
          label: 'Describe your relationship (if "Other" selected above)',
          type: 'text',
          condition: { field: 'claimantRelationshipType', value: '11' },
          placeholder: 'e.g., Stepchild, domestic partner, power of attorney',
        },
        {
          id: 'claimantFirstName',
          label: 'Claimant\'s First Name',
          type: 'text',
          condition: { field: 'claimantIsVeteran', value: 'No' },
          required: false,
          maxLength: 30,
        },
        {
          id: 'claimantMiddleInitial',
          label: 'Claimant\'s Middle Initial',
          type: 'text',
          condition: { field: 'claimantIsVeteran', value: 'No' },
          maxLength: 1,
          helpText: 'One letter only.',
        },
        {
          id: 'claimantLastName',
          label: 'Claimant\'s Last Name',
          type: 'text',
          condition: { field: 'claimantIsVeteran', value: 'No' },
          maxLength: 30,
        },
        {
          id: 'claimantDOB',
          label: 'Claimant\'s Date of Birth',
          type: 'date',
          condition: { field: 'claimantIsVeteran', value: 'No' },
        },
        {
          id: 'claimantStreet',
          label: 'Claimant\'s Mailing Address',
          type: 'text',
          condition: { field: 'claimantIsVeteran', value: 'No' },
          placeholder: '123 Main St',
        },
        {
          id: 'claimantApt',
          label: 'Apt / Unit Number',
          type: 'text',
          condition: { field: 'claimantIsVeteran', value: 'No' },
        },
        {
          id: 'claimantCity',
          label: 'City',
          type: 'text',
          condition: { field: 'claimantIsVeteran', value: 'No' },
        },
        {
          id: 'claimantState',
          label: 'State',
          type: 'select',
          condition: { field: 'claimantIsVeteran', value: 'No' },
          options: stateOptions,
        },
        {
          id: 'claimantZip',
          label: 'ZIP Code',
          type: 'text',
          condition: { field: 'claimantIsVeteran', value: 'No' },
          maxLength: 10,
          placeholder: '12345',
        },
        {
          id: 'claimantCountry',
          label: 'Country',
          type: 'text',
          condition: { field: 'claimantIsVeteran', value: 'No' },
          placeholder: 'Leave blank if USA',
        },
        {
          id: 'claimantPhone',
          label: 'Claimant\'s Phone',
          type: 'phone',
          condition: { field: 'claimantIsVeteran', value: 'No' },
        },
        {
          id: 'claimantEmail',
          label: 'Claimant\'s Email',
          type: 'email',
          condition: { field: 'claimantIsVeteran', value: 'No' },
        },
      ],
    },

    // ── STEP 4: Representative Identity ─────────────────────────────────────
    {
      id: 'representative',
      title: 'Representative\'s Identity',
      description:
        'Enter the name and affiliation of the individual you are appointing to represent you before the VA. Make sure to get their consent before submitting — they will also need to sign this form.',
      fields: [
        {
          id: 'repFirstName',
          label: 'Representative\'s First Name',
          type: 'text',
          required: true,
          maxLength: 30,
        },
        {
          id: 'repMiddleInitial',
          label: 'Representative\'s Middle Initial',
          type: 'text',
          maxLength: 1,
          helpText: 'One letter only.',
        },
        {
          id: 'repLastName',
          label: 'Representative\'s Last Name',
          type: 'text',
          required: true,
          maxLength: 30,
        },
      ],
    },

    // ── STEP 5: Representative Contact ───────────────────────────────────────
    {
      id: 'representative-contact',
      title: 'Representative\'s Contact Information',
      description:
        'Enter the representative\'s mailing address and phone number. VA will send copies of all correspondence about your claim to this address.',
      fields: [
        {
          id: 'repStreet',
          label: 'Mailing Address',
          type: 'text',
          required: true,
          placeholder: '456 Oak Ave',
        },
        {
          id: 'repApt',
          label: 'Suite / Unit Number',
          type: 'text',
          placeholder: 'Suite 200 (optional)',
        },
        {
          id: 'repCity',
          label: 'City',
          type: 'text',
          required: true,
        },
        {
          id: 'repState',
          label: 'State',
          type: 'select',
          options: stateOptions,
        },
        {
          id: 'repZip',
          label: 'ZIP Code',
          type: 'text',
          maxLength: 10,
          placeholder: '12345',
        },
        {
          id: 'repCountry',
          label: 'Country',
          type: 'text',
          placeholder: 'Leave blank if USA',
        },
        {
          id: 'repPhone',
          label: 'Phone',
          type: 'phone',
          required: true,
          helpText: 'Required — VA uses this number to contact your representative directly.',
        },
        {
          id: 'repEmail',
          label: 'Email Address',
          type: 'email',
        },
      ],
    },

    // ── STEP 4: Type of Appointment (Item 16B) ──────────────────────────────
    {
      id: 'appointment',
      title: 'Type of Representative',
      description:
        'Indicate what kind of representative you are appointing (Item 16B on the form). Only an accredited attorney or claims agent may charge a fee; an individual representing you under 38 C.F.R. §14.630 must do so without compensation.',
      fields: [
        {
          id: 'appointmentType',
          label: 'The individual I am appointing is…',
          type: 'radio',
          required: true,
          helpText:
            'Confirm accreditation at va.gov/ogc/apps/accreditation before appointing an attorney or agent. The §14.630 option is for a one-time, no-charge representative (e.g., a family member or friend) and requires both you and the representative to sign Items 17A and 18A.',
          options: [
            { label: 'Attorney', value: 'Attorney' },
            { label: 'VA-accredited claims agent', value: 'Agent' },
            { label: 'Individual representing me without compensation (under 38 C.F.R. §14.630)', value: 'Individual14630' },
            { label: 'Service Organization (VSO) representative', value: 'ServiceOrg' },
          ],
        },
        {
          id: 'repOrganization',
          label: 'Service organization name (Item 16B)',
          type: 'text',
          condition: { field: 'appointmentType', value: 'ServiceOrg' },
          placeholder: 'e.g., Disabled American Veterans',
          helpText:
            'The name of the Veterans Service Organization the representative belongs to. (If your representative is an attorney or agent at a firm, leave this blank — their firm name goes in Item 19a if you authorize affiliated disclosure.)',
        },
      ],
    },

    // ── STEP 5: Authorizations (Section IV — all optional opt-ins) ───────────
    {
      id: 'authorization',
      title: 'Authorizations (Optional)',
      description:
        'These authorizations are optional. By default — if you leave a box unchecked — VA will NOT take that action. Check only the ones you want to grant. None of these are required to appoint your representative.',
      fields: [
        {
          id: 'auth19aAffiliated',
          label: 'Item 19a — Authorize VA to disclose my records to the associate attorneys, claims agents, and support staff affiliated with my representative.',
          type: 'checkbox',
          helpText:
            'Applies only if your representative is an accredited attorney or agent approved for VA IT-system access (38 C.F.R. 1.600–1.603). Does not include the protected records in Items 20–21.',
        },
        {
          id: 'auth19aFirmName',
          label: 'Name of the firm or organization (for Item 19a)',
          type: 'text',
          condition: { field: 'auth19aAffiliated', value: true },
          placeholder: 'Firm / organization name',
        },
        {
          id: 'auth19bAdministrative',
          label: 'Item 19b — Authorize VA to disclose my records to specific named administrative employees of my representative.',
          type: 'checkbox',
          helpText:
            'For disclosures outside of VA electronic IT systems. Does not include the protected records in Items 20–21.',
        },
        {
          id: 'auth20SensitiveRecords',
          label: 'Item 20 — Authorize disclosure of my protected health records (treatment for drug abuse, alcoholism, HIV, or sickle cell anemia) to my representative.',
          type: 'checkbox',
          helpText:
            'IMPORTANT: Leave this UNCHECKED unless you specifically want these sensitive medical records shared with your representative. By law VA will NOT disclose them unless you check this box. You can revoke this authorization in writing at any time.',
        },
        {
          id: 'limitationOfConsent',
          label: 'Item 21 — Limits on the protected-records consent above (optional)',
          type: 'textarea',
          condition: { field: 'auth20SensitiveRecords', value: true },
          placeholder: 'e.g., "Only HIV-related records. Does not include drug or alcohol treatment records."',
          helpText: 'If you checked Item 20, you may narrow exactly which protected records may be disclosed.',
        },
        {
          id: 'auth22ChangeAddress',
          label: 'Item 22 — Authorize my representative to change my address in VA records on my behalf.',
          type: 'checkbox',
          helpText:
            'By default VA will NOT let your representative change your address. Check this box only if you want to grant that authority.',
        },
      ],
    },

    // ── STEP 5: Limitations ─────────────────────────────────────────────────
    {
      id: 'limitations',
      title: 'Limitations on Authority (Optional)',
      description:
        'Most people leave this section blank, which grants your representative full authority in all VA matters. If you want to limit what your representative can do — for example, restricting them to education benefits only, or excluding certain claim types — enter those restrictions here.',
      fields: [
        {
          id: 'limitations',
          label: 'Limitations on representative\'s authority',
          type: 'textarea',
          placeholder:
            'e.g., "Representative is authorized to act only on matters related to education benefits (Chapter 33). This appointment does not extend to compensation or pension claims."',
          helpText:
            'Be specific. Vague limitations may be difficult for the VA to interpret and could slow down your claim.',
        },
      ],
    },

    // ── STEP 6: Certification & Signature ───────────────────────────────────
    {
      id: 'signature',
      title: 'Certification & Signature',
      description:
        'IMPORTANT: After you submit this form for agent filing, your appointed representative will also need to sign the form. We will contact them for their countersignature before mailing.\n\nBy signing, you certify that all statements are true and correct, and that you understand the representative you are appointing has agreed to serve in that capacity.',
      fields: [
        {
          id: 'privacyAct',
          label: 'I certify that the statements on this form are true and correct to the best of my knowledge and belief.',
          type: 'checkbox',
          required: true,
        },
        {
          id: 'signaturePad',
          label: 'Your Signature (Veteran / Claimant)',
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
    // Item 12 relationship is a free-text field; convert the coded selection to a
    // label (or use the "Other" detail) so it can be written as plain text.
    const relMap: Record<string, string> = {
      '4': 'Veteran (self)',
      '5': 'Surviving Spouse',
      '6': 'Child (under 18)',
      '7': 'Child (18–23, enrolled in school)',
      '8': 'Child (helpless/permanently disabled)',
      '9': 'Parent',
      '10': 'Court-appointed guardian or fiduciary',
      '11': 'Other',
    };
    const code = s(answers.claimantRelationshipType);
    const claimantRelationship = !code
      ? ''
      : code === '11'
        ? (s(answers.claimantRelationshipOther) || 'Other')
        : (relMap[code] || '');

    // The §14.630 no-charge case (Item 16B) uses the Item 17A/17B signature block.
    // Surface the applicant signature + date there ONLY for that appointment type;
    // every other case (and always) signs Item 23A/23B instead.
    //   - signature14630 (image overlay) is empty -> fillPdf skips the 17A overlay.
    //   - signatureDate14630 is ALWAYS non-empty (the raw date), gated instead by a
    //     "yes"/"no" prefix the mapping transform reads, so the Item 17B date boxes
    //     stay blank unless §14.630. (Keeping it non-empty avoids a false
    //     "orphan key" verifier flag for a legitimately-conditional field.)
    const is14630 = s(answers.appointmentType) === 'Individual14630';
    const signature14630 = is14630 ? s(answers.signaturePad) : '';
    const signatureDate14630 = `${is14630 ? 'yes' : 'no'}|${s(answers.signatureDate)}`;

    return { ...answers, claimantRelationship, signature14630, signatureDate14630 };
  },
};
