/**
 * Submission instructions for every VA form.
 * Used by the complete page to power both the "I'll submit myself" and
 * "MBA files for me" flows.
 */

export interface RPO {
  name: string;
  city: string;
  address: string;
  fax: string;
  states: string[];
  foreignSchools?: boolean;
}

/**
 * VA Regional Processing Offices for education benefits.
 * Source: VA GI Bill® regional processing offices
 */
export const EDUCATION_RPOS: RPO[] = [
  {
    name: 'Eastern Regional Processing Office',
    city: 'Buffalo, NY',
    address: '130 S. Elmwood Ave., Suite 601\nBuffalo, NY 14202',
    fax: '(716) 857-3975',
    states: ['CT', 'DC', 'DE', 'MA', 'MD', 'ME', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'],
  },
  {
    name: 'Central Regional Processing Office',
    city: 'St. Louis, MO',
    address: '9700 Page Ave.\nSt. Louis, MO 63132',
    fax: '(314) 253-4095',
    states: [
      'AL', 'AR', 'FL', 'GA', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
      'MI', 'MN', 'MS', 'MO', 'NC', 'ND', 'NE', 'OH', 'OK', 'SC',
      'SD', 'TN', 'TX', 'VA', 'WV', 'WI',
    ],
    foreignSchools: true,
  },
  {
    name: 'Western Regional Processing Office',
    city: 'Muskogee, OK',
    address: 'P.O. Box 8888\nMuskogee, OK 74402-8888',
    fax: '(918) 781-7559',
    states: ['AK', 'AZ', 'CA', 'CO', 'HI', 'ID', 'MT', 'NM', 'NV', 'OR', 'UT', 'WA', 'WY'],
  },
];

export function getRpoForState(state: string): RPO | null {
  if (!state) return null;
  return EDUCATION_RPOS.find(rpo => rpo.states.includes(state.toUpperCase())) ?? null;
}

export type OfficeType =
  | 'rpo'              // mail to VA Regional Processing Office (education)
  | 'rpo-with-school'  // mail to RPO, but school must also certify separately
  | 'through-school'   // do NOT mail — give directly to school
  | 'regional-office'; // mail/deliver to nearest VA Regional Office (non-education)

export interface SubmissionGuide {
  officeType: OfficeType;
  /** Items the user must include with the mailed package */
  whatToInclude: string[];
  /** General note shown below the mailing address */
  moreInfo?: string;
  /** Specific note about involving a school certifying official */
  schoolNote?: string;
  /** Expected turnaround after VA receives the form */
  timeline?: string;
}

export const SUBMISSION_GUIDES: Record<string, SubmissionGuide> = {
  'va-22-1990': {
    officeType: 'rpo',
    whatToInclude: [
      'Signed VA Form 22-1990 (this download)',
      'DD-214 or NGB-22 — one per period of active duty service, if you have been discharged',
      'DD Form 2384 Notice of Basic Eligibility (NOBE) — Chapter 1606 / MGIB Selected Reserve applicants only',
      'Kicker contract showing dollar amount and effective date — only if claiming a kicker supplement',
      'Voided check or bank deposit slip — only if enrolling in direct deposit',
    ],
    timeline: 'Allow 30 days for processing. VA will mail your Certificate of Eligibility once approved.',
    moreInfo:
      'After VA approves your application, your school must separately submit a VA enrollment certification (VA Form 22-1999) before your payments begin. Contact your school\'s Veterans Services Office to start that process immediately.',
  },

  'va-22-1990e': {
    officeType: 'rpo',
    whatToInclude: [
      'Signed VA Form 22-1990e (this download)',
      'Voided check or bank deposit slip — only if enrolling in direct deposit',
    ],
    timeline: 'Allow 30 days. VA verifies the service member\'s transfer approval directly with DoD — you do not need to submit proof of the transfer.',
    moreInfo:
      'Mail to the RPO that serves the state where the transferring service member is currently stationed, which may differ from your own home state.',
  },

  'va-22-1990t': {
    officeType: 'rpo',
    whatToInclude: [
      'VA Form 22-1990t bearing all required signatures (yours, your tutor\'s, your school certifying official\'s, and your course instructor\'s if Post-9/11)',
      'No additional attachments required',
    ],
    timeline:
      'Submit as soon as possible after tutoring ends. VA will not reimburse tutoring received more than one year before VA receives your claim.',
    schoolNote:
      'The form must be completed in this exact order before mailing:\n\n' +
      '  1. You sign the form first (already done — this download).\n' +
      '  2. Tutor signs and dates Items 14A and 14B, and certifies they are not a close relative.\n' +
      '  3. Your school\'s VA Certifying Official completes Items 15–16 and signs Items 17A–17B.\n' +
      '  4. Post-9/11 GI Bill only — your course instructor signs Item 18A and completes Item 18B.\n\n' +
      'To find your school\'s VA Certifying Official, visit your school\'s Veterans Services Office or call the financial aid office and ask for the "SCO" (School Certifying Official). A directory of VA-approved schools is available at benefits.va.gov/gibill/.',
  },

  'va-22-1995': {
    officeType: 'rpo-with-school',
    whatToInclude: [
      'Signed VA Form 22-1995 (this download)',
      'DD-214 (Member 4 Copy) for any active duty periods not previously reported to VA — if applicable',
      'Military orders for any involuntary call-up periods — if applicable',
      'Voided check or deposit slip — only if updating your direct deposit information',
    ],
    timeline: 'Allow 30 days for processing.',
    schoolNote:
      'Also notify your new school\'s Veterans Services Office about this change. Your new school must submit an updated enrollment certification to VA before your benefit payments resume at the new institution.',
  },

  'va-22-1999c': {
    officeType: 'through-school',
    whatToInclude: [
      'Signed VA Form 22-1999c (this download) — must be signed on or after the 7th calendar day from your enrollment agreement date',
    ],
    timeline: 'Return to your school promptly. Your school then submits to VA.',
    schoolNote:
      'Do NOT mail this form directly to VA — it goes through your school.\n\n' +
      '  • Give Copy 1 and Copy 2 to your school\'s VA Certifying Official.\n' +
      '  • Your school submits Copy 1 together with VA Form 22-1999 directly to VA.\n' +
      '  • Keep Copy 3 for your own records.\n\n' +
      'To find your school\'s VA Certifying Official, contact your school\'s Veterans Services Office or financial aid department and ask for the "School Certifying Official (SCO)." A directory of VA-approved schools is at benefits.va.gov/gibill/.',
  },

  'va-22-0803': {
    officeType: 'rpo',
    whatToInclude: [
      'Signed VA Form 22-0803 (this download)',
      'Copy of your test results — or a copy of the license/certification itself if you already hold it',
      'Receipt showing proof of payment of the test fee',
    ],
    timeline: 'Allow 60 days for reimbursement processing.',
    moreInfo:
      'Submit one VA Form 22-0803 per test. If you are claiming reimbursement for multiple tests, use a separate form for each one.',
  },

  'va-22-0810': {
    officeType: 'rpo',
    whatToInclude: [
      'Signed VA Form 22-0810 (this download)',
      'Copy of your national exam results',
      'Copy of your exam receipt showing proof of payment',
    ],
    timeline: 'Allow 60 days for reimbursement processing.',
    moreInfo:
      'Submit one VA Form 22-0810 per national exam. Attach a separate form for each exam you are claiming.',
  },

  'va-22-5281': {
    officeType: 'rpo',
    whatToInclude: [
      'Signed VA Form 22-5281 (this download)',
      'Notarized form — required only if you have already separated from service (a Notary Public or VA official must certify your signature in person)',
    ],
    timeline: 'Allow 60 days for refund processing.',
    moreInfo:
      'If you are still on active duty, no notarization is required. If separated, most banks, UPS stores, and public libraries offer free or low-cost notary services.',
  },

  'va-22-5490': {
    officeType: 'rpo',
    whatToInclude: [
      'Signed VA Form 22-5490 (this download)',
      'Proof of relationship to the qualifying veteran — birth certificate, marriage certificate, or adoption papers',
      'VA disability rating decision letter showing permanent and total (P&T) service-connected disability — if claiming based on a living veteran\'s disability',
      'Death certificate and/or military line-of-duty determination — if the veteran or service member is deceased',
      'Veteran\'s DD-214 — if not already on file with VA',
    ],
    timeline: 'Allow 30 days for processing.',
    moreInfo:
      'Mail to the RPO that serves the state of the qualifying veteran\'s last known address or active duty station.',
  },

  'va-22-5495': {
    officeType: 'rpo-with-school',
    whatToInclude: [
      'Signed VA Form 22-5495 (this download)',
      'Voided check or deposit slip — only if updating direct deposit information',
    ],
    timeline: 'Allow 30 days for processing.',
    schoolNote:
      'Also contact your new school\'s Veterans Services Office. Your new school must submit an updated enrollment certification to VA before payments resume.',
  },

  'va-22-8691': {
    officeType: 'rpo',
    whatToInclude: [
      'Signed VA Form 22-8691 (this download)',
      'Additional work history details — if more space was needed for Item 12',
      'Additional qualifications details — if more space was needed for Item 14',
    ],
    timeline: 'Work-Study offices process applications locally. Allow up to 30 days for a supervisor to contact you.',
    moreInfo:
      'You may also deliver this form in person to a VA facility that operates a work-study program near you. Call 1-888-GI-BILL-1 (1-888-442-4551) to locate the nearest VA work-study site.',
  },

  'va-28-1900': {
    officeType: 'regional-office',
    whatToInclude: [
      'Signed VA Form 28-1900 (this download)',
      'DD-214 — Certificate of Release or Discharge from Active Duty (if not already on file with VA)',
      'VA service-connected disability rating decision letter (if not already on file with VA)',
    ],
    timeline:
      'Allow 30 days after VA receives your application. A Vocational Rehabilitation Counselor (VRC) will contact you to schedule an initial orientation appointment.',
    moreInfo:
      'VR&E applications go to your nearest VA Regional Office — not an education RPO.\n\n' +
      'To find your nearest VA Regional Office:\n' +
      '  • Visit va.gov/find-locations and select "VA benefits office"\n' +
      '  • Or call VA at 1-800-827-1000\n' +
      '  • Or visit in person — no appointment needed to drop off paperwork',
  },
};

/** US states for the state-selector dropdown */
export const US_STATES: { abbr: string; name: string }[] = [
  { abbr: 'AL', name: 'Alabama' }, { abbr: 'AK', name: 'Alaska' },
  { abbr: 'AZ', name: 'Arizona' }, { abbr: 'AR', name: 'Arkansas' },
  { abbr: 'CA', name: 'California' }, { abbr: 'CO', name: 'Colorado' },
  { abbr: 'CT', name: 'Connecticut' }, { abbr: 'DC', name: 'Washington D.C.' },
  { abbr: 'DE', name: 'Delaware' }, { abbr: 'FL', name: 'Florida' },
  { abbr: 'GA', name: 'Georgia' }, { abbr: 'HI', name: 'Hawaii' },
  { abbr: 'ID', name: 'Idaho' }, { abbr: 'IL', name: 'Illinois' },
  { abbr: 'IN', name: 'Indiana' }, { abbr: 'IA', name: 'Iowa' },
  { abbr: 'KS', name: 'Kansas' }, { abbr: 'KY', name: 'Kentucky' },
  { abbr: 'LA', name: 'Louisiana' }, { abbr: 'ME', name: 'Maine' },
  { abbr: 'MD', name: 'Maryland' }, { abbr: 'MA', name: 'Massachusetts' },
  { abbr: 'MI', name: 'Michigan' }, { abbr: 'MN', name: 'Minnesota' },
  { abbr: 'MS', name: 'Mississippi' }, { abbr: 'MO', name: 'Missouri' },
  { abbr: 'MT', name: 'Montana' }, { abbr: 'NE', name: 'Nebraska' },
  { abbr: 'NV', name: 'Nevada' }, { abbr: 'NH', name: 'New Hampshire' },
  { abbr: 'NJ', name: 'New Jersey' }, { abbr: 'NM', name: 'New Mexico' },
  { abbr: 'NY', name: 'New York' }, { abbr: 'NC', name: 'North Carolina' },
  { abbr: 'ND', name: 'North Dakota' }, { abbr: 'OH', name: 'Ohio' },
  { abbr: 'OK', name: 'Oklahoma' }, { abbr: 'OR', name: 'Oregon' },
  { abbr: 'PA', name: 'Pennsylvania' }, { abbr: 'RI', name: 'Rhode Island' },
  { abbr: 'SC', name: 'South Carolina' }, { abbr: 'SD', name: 'South Dakota' },
  { abbr: 'TN', name: 'Tennessee' }, { abbr: 'TX', name: 'Texas' },
  { abbr: 'UT', name: 'Utah' }, { abbr: 'VT', name: 'Vermont' },
  { abbr: 'VA', name: 'Virginia' }, { abbr: 'WA', name: 'Washington' },
  { abbr: 'WV', name: 'West Virginia' }, { abbr: 'WI', name: 'Wisconsin' },
  { abbr: 'WY', name: 'Wyoming' },
];
