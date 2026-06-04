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
  version: 1,
  formNumber: 'VA 21-22A',
  title: 'Appointment of Individual as Claimant\'s Representative',
  description:
    'Authorize an individual — such as an attorney, accredited claims agent, or trusted family member — to represent you before the VA and act on your behalf in all matters related to your VA benefits.',
  pdfTemplate: '/forms/VA-21-22A.pdf',
  category: 'other',
  nextSteps:
    'Mail or deliver the completed, signed form to your nearest VA Regional Office. Both you (or the claimant) AND the representative must sign before submitting. Find your nearest Regional Office at va.gov/find-locations.',

  steps: [

    // ── STEP 1: Veteran Information ─────────────────────────────────────────
    {
      id: 'veteran',
      title: 'Veteran\'s Information',
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

    // ── STEP 3: Representative Information ─────────────────────────────────
    {
      id: 'representative',
      title: 'Representative\'s Information',
      description:
        'Enter the full contact information of the individual you are appointing to represent you. This person will be authorized to communicate with the VA on your behalf. Make sure to get their consent before submitting this form — they will also need to sign.',
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
        },
        {
          id: 'repLastName',
          label: 'Representative\'s Last Name',
          type: 'text',
          required: true,
          maxLength: 30,
        },
        {
          id: 'repOrganization',
          label: 'Organization or Firm Name (if applicable)',
          type: 'text',
          placeholder: 'e.g., Smith Law Group, Veterans Aid Society',
          helpText:
            'If the representative is affiliated with a law firm, accredited organization, or other entity, enter its name here. Leave blank if they are an unaffiliated individual.',
        },
        {
          id: 'repStreet',
          label: 'Representative\'s Mailing Address',
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
          label: 'Representative\'s Phone',
          type: 'phone',
          required: true,
        },
        {
          id: 'repEmail',
          label: 'Representative\'s Email',
          type: 'email',
        },
      ],
    },

    // ── STEP 4: Type of Appointment & Authorization ─────────────────────────
    {
      id: 'authorization',
      title: 'Type of Appointment & Authorization',
      description:
        'Select the type of appointment. Attorneys and accredited VA claims agents are permitted to charge a fee for their services; all others must represent you without compensation. Also check the boxes below to specify exactly what your representative is authorized to do.',
      fields: [
        {
          id: 'appointmentType',
          label: 'Type of representative',
          type: 'radio',
          required: true,
          helpText:
            'Choose the category that best describes the person you are appointing. If unsure, "Individual acting without compensation" applies to family members and friends helping you at no charge.',
          options: [
            { label: 'Individual acting without compensation (family member, friend, etc.)', value: '4' },
            { label: 'Attorney-at-law', value: '1' },
            { label: 'VA-accredited claims agent', value: '3' },
            { label: 'Other', value: '2' },
          ],
        },
        {
          id: 'authRecords',
          label: 'Authorize representative to access my VA records',
          type: 'checkbox',
          helpText:
            'Checking this box allows your representative to view your VA files, medical records, and claims information.',
        },
        {
          id: 'authActOnBehalf',
          label: 'Authorize representative to act on my behalf for all VA claims and related matters',
          type: 'checkbox',
          helpText:
            'Checking this box allows your representative to submit correspondence, appeals, and other documents to the VA in your name.',
        },
        {
          id: 'authDiscloseRecordsToRep',
          label: 'Authorize VA to disclose information from my records to my representative',
          type: 'checkbox',
          helpText:
            'The VA will share your records and claim information directly with your representative when this box is checked.',
        },
        {
          id: 'authDiscloseRecordsToClaimant',
          label: 'Authorize VA to disclose information from my records to me (as claimant)',
          type: 'checkbox',
          helpText:
            'Ensures the VA may also communicate records and decisions directly back to you (the claimant), not only through your representative.',
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
};
