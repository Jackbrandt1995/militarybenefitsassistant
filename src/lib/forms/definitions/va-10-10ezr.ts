import type { FormDefinition } from '../types';
import { branchOptions, stateOptions } from '@/lib/validation';

export const va1010ezr: FormDefinition = {
  id: 'va-10-10ezr',
  version: 1,
  formNumber: 'VA 10-10EZR',
  title: 'Health Benefits Update Form',
  description:
    'Already enrolled in VA health care? Use VA Form 10-10EZR to keep your information current — update your address and contact details, insurance, income, and dependents so VA can correctly determine your enrollment priority and copays.',
  pdfTemplate: '/forms/VA-10-10EZR.pdf',
  category: 'healthcare',
  nextSteps:
    'Sign and date the form, then mail it to the VA Health Eligibility Center, PO Box 5207, Janesville, WI 53547-5207. You can also update your information at VA.gov or by calling 1-877-222-8387.',
  steps: [

    // ── STEP 1: Name & Identity (Section I) ───────────────────────────────────
    {
      id: 'personal',
      title: 'Name & Identity',
      description:
        'Enter your legal name and identifying information exactly as VA has them on file so your update matches your record.',
      fields: [
        { id: 'firstName',  label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name', maxLength: 30 },
        { id: 'middleName', label: 'Middle Initial', type: 'text', profilePath: 'profile.middle_name', maxLength: 1, helpText: 'One letter only.' },
        { id: 'lastName',   label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name', maxLength: 30 },
        {
          id: 'suffix', label: 'Suffix', type: 'select', profilePath: 'profile.suffix',
          options: [
            { label: 'None', value: '' },
            { label: 'Jr.', value: 'Jr.' },
            { label: 'Sr.', value: 'Sr.' },
            { label: 'II', value: 'II' },
            { label: 'III', value: 'III' },
            { label: 'IV', value: 'IV' },
          ],
        },
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted', helpText: 'Entered securely; used to match your VA health record.' },
        { id: 'dob', label: 'Date of Birth', type: 'date', required: true, profilePath: 'profile.dob' },
        {
          id: 'sex', label: 'Sex (as listed on military records)', type: 'radio', required: true, profilePath: 'profile.sex',
          options: [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
          ],
        },
      ],
    },

    // ── STEP 2: Contact & Address (Section I) ─────────────────────────────────
    {
      id: 'contact',
      title: 'Contact & Address',
      description:
        'Keep your mailing address and contact details current — VA mails correspondence here and may call or email you about your care.',
      fields: [
        { id: 'street', label: 'Mailing Address (Street)', type: 'text', required: true, profilePath: 'profile.address_street', placeholder: '123 Main St' },
        { id: 'apt',    label: 'Apt / Unit Number', type: 'text', profilePath: 'profile.address_apt', placeholder: 'e.g., Apt 4B (optional)' },
        { id: 'city',   label: 'City', type: 'text', required: true, profilePath: 'profile.address_city' },
        { id: 'state',  label: 'State', type: 'select', required: true, profilePath: 'profile.address_state', options: stateOptions },
        { id: 'zip',    label: 'ZIP Code', type: 'text', required: true, profilePath: 'profile.address_zip', maxLength: 10, placeholder: '12345' },
        { id: 'phoneHome',   label: 'Home Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'phoneMobile', label: 'Mobile Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'email',  label: 'Email Address', type: 'email', profilePath: 'profile.email' },
        {
          id: 'maritalStatus', label: 'Current Marital Status', type: 'select', required: true,
          options: [
            { label: 'Married', value: 'Married' },
            { label: 'Never Married', value: 'Single' },
            { label: 'Separated', value: 'Separated' },
            { label: 'Widowed', value: 'Widowed' },
            { label: 'Divorced', value: 'Divorced' },
          ],
        },
      ],
    },

    // ── STEP 3: Health Insurance (Section II) ─────────────────────────────────
    {
      id: 'insurance',
      title: 'Health Insurance',
      description:
        'VA is required by law to bill private insurers for non-service-connected care. Providing your insurance information never affects your eligibility or copays for service-connected care.',
      fields: [
        {
          id: 'hasOtherInsurance', label: 'Do you have any health insurance (including through a spouse)?', type: 'radio', required: true,
          helpText: 'Include private insurance, an employer plan, TRICARE, CHAMPVA, or Medicare Part B.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        { id: 'insuranceCompanyName', label: 'Insurance Company Name', type: 'text', maxLength: 40, condition: { field: 'hasOtherInsurance', value: 'Yes' }, placeholder: 'e.g., Blue Cross Blue Shield' },
        { id: 'insurancePolicyholderName', label: 'Name of Policyholder', type: 'text', maxLength: 40, condition: { field: 'hasOtherInsurance', value: 'Yes' } },
        { id: 'insurancePolicyNumber', label: 'Policy Number', type: 'text', maxLength: 30, condition: { field: 'hasOtherInsurance', value: 'Yes' } },
        { id: 'insuranceGroupNumber', label: 'Group Code', type: 'text', maxLength: 30, condition: { field: 'hasOtherInsurance', value: 'Yes' }, helpText: 'Leave blank if your plan has no group number.' },
        {
          id: 'eligibleForMedicaid', label: 'Are you eligible for Medicaid?', type: 'radio', required: true,
          helpText: 'Medicaid is federal/state health insurance for people with low income.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'medicarePartA', label: 'Are you enrolled in Medicare hospital insurance (Part A)?', type: 'radio', required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        { id: 'medicareEffectiveDate', label: 'Medicare Part A Effective Date', type: 'date', condition: { field: 'medicarePartA', value: 'Yes' } },
        { id: 'medicareClaimNumber', label: 'Medicare Number', type: 'text', condition: { field: 'medicarePartA', value: 'Yes' }, helpText: 'The number printed on your Medicare card.' },
      ],
    },

    // ── STEP 4: Military Service (Section III) ────────────────────────────────
    {
      id: 'militaryService',
      title: 'Military Service',
      description: 'Confirm your most recent period of service. This should match your DD-214.',
      fields: [
        { id: 'serviceBranch', label: 'Last Branch of Service', type: 'select', required: true, profilePath: 'servicePeriods[0].branch', options: branchOptions },
        { id: 'serviceEntryDate', label: 'Last Entry Date', type: 'date', profilePath: 'servicePeriods[0].date_entered' },
        { id: 'serviceSeparationDate', label: 'Last Discharge Date', type: 'date', profilePath: 'servicePeriods[0].date_separated', helpText: 'Leave blank if you are still serving.' },
        {
          id: 'dischargeType', label: 'Discharge Type', type: 'select', profilePath: 'servicePeriods[0].character_of_discharge',
          options: [
            { label: 'Honorable', value: 'Honorable' },
            { label: 'General Under Honorable Conditions', value: 'General Under Honorable' },
            { label: 'Other Than Honorable', value: 'Other Than Honorable' },
            { label: 'Bad Conduct', value: 'Bad Conduct' },
            { label: 'Dishonorable', value: 'Dishonorable' },
            { label: 'Uncharacterized', value: 'Uncharacterized' },
          ],
        },
        { id: 'militaryServiceNumber', label: 'Military Service Number (1F)', type: 'text', placeholder: 'If applicable', helpText: 'Pre-1972 veterans have a separate service number. Leave blank if your SSN is your service number.' },
        {
          id: 'currentlyActiveDuty', label: 'Are you currently on active duty?', type: 'radio', required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        { id: 'expectedSeparationDate', label: 'Future Discharge Date (if still serving)', type: 'date', condition: { field: 'currentlyActiveDuty', value: 'Yes' } },
      ],
    },

    // ── STEP 5: Military History (Section III, Item 2) ────────────────────────
    {
      id: 'militaryHistory',
      title: 'Military History',
      description: 'Answer each yes/no question (Section III, Item 2). These affect your VA health-care enrollment priority.',
      fields: [
        { id: 'purpleHeart', label: 'Are you a Purple Heart award recipient? (2A)', type: 'radio', required: true, options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }] },
        { id: 'formerPOW', label: 'Are you a former prisoner of war (POW)? (2B)', type: 'radio', required: true, options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }] },
        { id: 'combatTheaterPost911', label: 'Did you serve in a combat theater of operations after 11/11/1998? (2C)', type: 'radio', required: true, options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }] },
        { id: 'dischargedForDisability', label: 'Were you discharged or retired from the military for a disability incurred in the line of duty? (2D)', type: 'radio', required: true, options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }] },
        { id: 'swAsiaGulfWar', label: 'Did you serve in SW Asia during the Gulf War between 8/2/1990 and 11/11/1998? (2E)', type: 'radio', required: true, options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }] },
        { id: 'serviceConnectedRating', label: 'Do you have a VA service-connected disability rating? (2F)', type: 'radio', required: true, options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }] },
      ],
    },

    // ── STEP 6: Military Exposure — Locations (Section III, Item 3 A–D) ────────
    {
      id: 'exposureLocations',
      title: 'Military Exposure — Where You Served',
      description: 'Answer each yes/no question. If yes, provide an approximate time-frame (month/year) where asked.',
      fields: [
        { id: 'radiationActivity', label: 'Did you serve in an ionizing-radiation location and take part in nuclear testing, treatments, or cleanup? (3A)', type: 'radio', required: true, options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }] },
        { id: 'gulfWarHazard', label: 'Did you serve in a Gulf War hazard location? (3B)', type: 'radio', required: true, helpText: 'Iraq, Kuwait, Saudi Arabia, Bahrain, Qatar, UAE, Oman, Yemen, Afghanistan, and surrounding waters, among others.', options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }] },
        { id: 'gulfWarFrom', label: 'Gulf War service — From (MM/YYYY)', type: 'text', condition: { field: 'gulfWarHazard', value: 'Yes' }, placeholder: 'MM/YYYY' },
        { id: 'gulfWarTo', label: 'Gulf War service — To (MM/YYYY)', type: 'text', condition: { field: 'gulfWarHazard', value: 'Yes' }, placeholder: 'MM/YYYY' },
        { id: 'combatOperations', label: 'Were you deployed in support of Enduring Freedom, Freedom’s Sentinel, Iraqi Freedom, New Dawn, Inherent Resolve, or Resolute Support? (3C)', type: 'radio', required: true, options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }] },
        { id: 'agentOrangeService', label: 'Did you serve in a herbicide (e.g., Agent Orange) location? (3D)', type: 'radio', required: true, helpText: 'Republic of Vietnam, Thailand bases, Laos, parts of Cambodia, the Korean DMZ, and others.', options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }] },
        { id: 'agentOrangeFrom', label: 'Herbicide-location service — From (MM/YYYY)', type: 'text', condition: { field: 'agentOrangeService', value: 'Yes' }, placeholder: 'MM/YYYY' },
        { id: 'agentOrangeTo', label: 'Herbicide-location service — To (MM/YYYY)', type: 'text', condition: { field: 'agentOrangeService', value: 'Yes' }, placeholder: 'MM/YYYY' },
      ],
    },

    // ── STEP 7: Military Exposure — Hazards (Section III, Item 3E) ─────────────
    {
      id: 'exposureHazards',
      title: 'Military Exposure — What You Were Exposed To',
      description: 'Check every hazard you may have been exposed to during service. Leave all unchecked if none apply.',
      fields: [
        { id: 'expAirPollutants', label: 'Air pollutants (burn pits, sand, oil-well/sulfur fires)', type: 'checkbox' },
        { id: 'expChemicals', label: 'Chemicals (pesticides, herbicides, contaminated water)', type: 'checkbox' },
        { id: 'expCampLejeune', label: 'Contaminated water at Camp Lejeune', type: 'checkbox' },
        { id: 'expRadiation', label: 'Radiation', type: 'checkbox' },
        { id: 'expShad', label: 'SHAD (Shipboard Hazard and Defense)', type: 'checkbox' },
        { id: 'expOccupational', label: 'Occupational hazards (jet fuel, solvents, lead, firefighting foams)', type: 'checkbox' },
        { id: 'expAsbestos', label: 'Asbestos', type: 'checkbox' },
        { id: 'expMustardGas', label: 'Mustard gas', type: 'checkbox' },
        { id: 'expWarfareAgents', label: 'Warfare agents (nerve agents, chemical and biological weapons)', type: 'checkbox' },
        { id: 'expOther', label: 'Other exposure not listed above', type: 'checkbox' },
        { id: 'expOtherSpecify', label: 'If "Other", please specify', type: 'text', condition: { field: 'expOther', value: true } },
      ],
    },

    // ── STEP 8: Spouse & Dependents (Section IV) ──────────────────────────────
    {
      id: 'spouseAndDependents',
      title: 'Spouse & Dependents',
      description: 'If you are married, provide your spouse details so VA can calculate your household income accurately.',
      fields: [
        { id: 'married', label: 'Are you currently married?', type: 'radio', required: true, options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }] },
        { id: 'spouseFirstName', label: "Spouse's First Name", type: 'text', maxLength: 30, condition: { field: 'married', value: 'Yes' } },
        { id: 'spouseLastName', label: "Spouse's Last Name", type: 'text', maxLength: 30, condition: { field: 'married', value: 'Yes' } },
        { id: 'spouseSsn', label: "Spouse's Social Security Number", type: 'ssn', sensitive: true, condition: { field: 'married', value: 'Yes' } },
        {
          id: 'spouseSex', label: "Spouse's Sex", type: 'radio', condition: { field: 'married', value: 'Yes' },
          options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }],
        },
        { id: 'spouseDob', label: "Spouse's Date of Birth", type: 'date', condition: { field: 'married', value: 'Yes' } },
        { id: 'marriageDate', label: 'Date of Marriage', type: 'date', condition: { field: 'married', value: 'Yes' } },
        { id: 'spouseAddress', label: "Spouse's Address & Phone (if different from yours)", type: 'text', condition: { field: 'married', value: 'Yes' }, placeholder: 'Leave blank if same as yours' },
        {
          id: 'providedSupport', label: 'If your spouse or a dependent child did not live with you last year, did you provide support?', type: 'radio', condition: { field: 'married', value: 'Yes' },
          options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }],
        },
      ],
    },

    // ── STEP 9: Income (Section V) ────────────────────────────────────────────
    {
      id: 'income',
      title: 'Previous Year Income',
      description:
        'Report your household gross income for the previous calendar year. VA uses this to determine your enrollment priority and whether copays apply.',
      fields: [
        { id: 'grossEmploymentIncome', label: 'Gross Annual Income from Employment (Section V, line 1)', type: 'number', helpText: 'Wages, bonuses, tips — EXCLUDING farm/ranch/business income. Before taxes.', placeholder: '0' },
        { id: 'netFarmBusinessIncome', label: 'Net Income from Farm, Ranch, Property, or Business (line 2)', type: 'number', helpText: 'Net of business expenses. Report losses as 0.', placeholder: '0' },
        { id: 'otherIncome', label: 'Other Income (Social Security, pension, interest, dividends) (line 3)', type: 'number', helpText: 'Excludes welfare/SSI and VA compensation/pension.', placeholder: '0' },
        { id: 'spouseGrossIncome', label: "Spouse's Gross Employment Income", type: 'number', condition: { field: 'married', value: 'Yes' }, placeholder: '0' },
        { id: 'spouseFarmIncome', label: "Spouse's Net Farm / Business Income", type: 'number', condition: { field: 'married', value: 'Yes' }, helpText: 'Net of business expenses. Report losses as 0.', placeholder: '0' },
        { id: 'spouseOtherIncome', label: "Spouse's Other Income", type: 'number', condition: { field: 'married', value: 'Yes' }, placeholder: '0' },
      ],
    },

    // ── STEP 10: Deductible Expenses (Section VI) ─────────────────────────────
    {
      id: 'deductions',
      title: 'Deductible Expenses',
      description: 'Report deductible expenses you paid last calendar year. These can lower your countable income for VA purposes.',
      fields: [
        { id: 'unreimbursedMedicalExpenses', label: 'Total Non-Reimbursed Medical Expenses Paid by You or Your Spouse (Section VI, line 1)', type: 'number', helpText: 'Out-of-pocket medical/dental/drug/insurance costs not reimbursed by insurance.', placeholder: '0' },
        { id: 'funeralBurialExpenses', label: 'Funeral & Burial Expenses for a Deceased Spouse or Dependent Child (line 2)', type: 'number', placeholder: '0' },
        { id: 'veteranEducationExpenses', label: 'Your Own College or Vocational Education Expenses (line 3)', type: 'number', helpText: 'Tuition, books, fees you paid for YOUR education. Do not list dependents’ expenses.', placeholder: '0' },
      ],
    },

    // ── STEP 11: Certification & Signature (Sections VII–VIII) ─────────────────
    {
      id: 'signature',
      title: 'Certification & Signature',
      description:
        'By signing, you declare under penalty of perjury that the information is true and accurate. You also agree to pay applicable VA copayments and to receive communications from VA at the contact information you provided.\n\nFederal law provides criminal penalties for any materially false, fictitious, or fraudulent statement (18 U.S.C. §§ 287 and 1001).',
      fields: [
        { id: 'privacyAct', label: 'I declare under penalty of perjury that the information in this update is true and accurate to the best of my knowledge.', type: 'checkbox', required: true, helpText: 'You must check this box before you can sign.' },
        { id: 'signaturePad', label: 'Your Signature', type: 'signature', required: true, helpText: 'Draw your signature using your mouse or finger.' },
        { id: 'signatureDate', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  ],

  computeAnswers: (answers) => {
    const s = (v: unknown) => String(v ?? '').trim();

    // The wizard collects marital status twice (the `maritalStatus` select and the
    // `married` Yes/No radio), which can desync. Derive `married` from `maritalStatus`
    // so the MARRIED box (driven by maritalStatus) and the spouse fields (gated by
    // `married`) can never disagree.
    const married = s(answers.maritalStatus) === 'Married' ? 'Yes' : 'No';

    // Veteran name "Last, First Middle" (form field label is "Last, First, Middle Name")
    const last = s(answers.lastName);
    const first = s(answers.firstName);
    const mid = s(answers.middleName);
    const nameParts = [first, mid].filter(Boolean).join(' ');
    const fullName = last && nameParts ? `${last}, ${nameParts}` : last || nameParts;

    // SSN dashed "XXX-XX-XXXX" (the EZR SSN fields have no maxLength)
    const rawSsn = s(answers.ssn).replace(/\D/g, '');
    const ssnFormatted = rawSsn.length === 9
      ? `${rawSsn.slice(0, 3)}-${rawSsn.slice(3, 5)}-${rawSsn.slice(5)}`
      : s(answers.ssn);

    // Spouse name "Last, First"
    const spouseLast = s(answers.spouseLastName);
    const spouseFirst = s(answers.spouseFirstName);
    const spouseFullName = spouseLast && spouseFirst
      ? `${spouseLast}, ${spouseFirst}`
      : spouseLast || spouseFirst;

    // Spouse SSN dashed
    const rawSpouseSsn = s(answers.spouseSsn).replace(/\D/g, '');
    const spouseSsnFormatted = rawSpouseSsn.length === 9
      ? `${rawSpouseSsn.slice(0, 3)}-${rawSpouseSsn.slice(3, 5)}-${rawSpouseSsn.slice(5)}`
      : s(answers.spouseSsn);

    return { ...answers, married, fullName, ssnFormatted, spouseFullName, spouseSsnFormatted };
  },
};
