import type { FormDefinition } from '../types';
import { branchOptions, stateOptions } from '@/lib/validation';

export const va1010ez: FormDefinition = {
  id: 'va-10-10ez',
  version: 2,
  formNumber: 'VA 10-10EZ',
  title: 'Application for VA Health Care',
  description:
    'Enroll in VA health care benefits. Most veterans who served on active duty and were discharged under conditions other than dishonorable qualify. Enrollment is free and covers a wide range of medical services.',
  pdfTemplate: '/forms/VA-10-10EZ.pdf',
  category: 'healthcare',
  nextSteps:
    'Submit this form to your nearest VA medical center or mail it to the VA Health Eligibility Center, P.O. Box 17885, Denver, CO 80217-0885.',
  steps: [

    // ── STEP 1: Name & Identity ───────────────────────────────────────────────
    {
      id: 'personal',
      title: 'Name & Identity',
      description:
        'Enter your legal name exactly as it appears on your discharge papers or government-issued ID. Your Social Security Number and date of birth are required by law (38 U.S.C. § 1705) to process your enrollment.',
      fields: [
        {
          id: 'benefitType',
          label: 'What are you applying for?',
          type: 'radio',
          required: true,
          helpText:
            'Enrollment gives you the full VA medical benefits package. Registration is for veterans who only need care under a special eligibility (e.g., a service-connected condition, MST, or catastrophic disability) and do not need full enrollment.',
          options: [
            { label: 'Enrollment — full VA medical benefits', value: 'Enrollment' },
            { label: 'Registration — care under a special eligibility only', value: 'Registration' },
          ],
        },
        {
          id: 'firstName',
          label: 'First Name',
          type: 'text',
          required: true,
          profilePath: 'profile.first_name',
          maxLength: 30,
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
          maxLength: 30,
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
          id: 'ssn',
          label: 'Social Security Number',
          type: 'ssn',
          required: true,
          profilePath: 'profile.ssn_encrypted',
          helpText: 'Entered securely. Required by law (38 U.S.C. § 1705) to process your VA health care enrollment.',
        },
        {
          id: 'dob',
          label: 'Date of Birth',
          type: 'date',
          required: true,
          profilePath: 'profile.dob',
        },
      ],
    },

    // ── STEP 2: Birth & Status ────────────────────────────────────────────────
    {
      id: 'personal-status',
      title: 'Birth & Status',
      description:
        'Provide your birth details and current marital status. Your mother\'s maiden name is used by VA as a secondary identity verification check.',
      fields: [
        {
          id: 'sex',
          label: 'Sex (as listed on military records)',
          type: 'radio',
          required: true,
          profilePath: 'profile.sex',
          helpText: 'Select as shown on your DD-214 or military records. This is used for clinical care purposes.',
          options: [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
          ],
        },
        {
          id: 'mothersMaidenName',
          label: "Mother's Maiden Name",
          type: 'text',
          required: true,
          maxLength: 35,
          helpText: "Your mother's last name before she was married. VA uses this as a secondary identity verification.",
          placeholder: 'e.g., Smith',
        },
        {
          id: 'birthCity',
          label: 'City of Birth',
          type: 'text',
          required: true,
          maxLength: 30,
          placeholder: 'e.g., Chicago',
          helpText: 'The city where you were born.',
        },
        {
          id: 'birthStateOrCountry',
          label: 'State or Country of Birth',
          type: 'text',
          required: true,
          maxLength: 30,
          placeholder: 'e.g., IL or Mexico',
          helpText: 'Enter a US state abbreviation (e.g., IL) or the full country name if born outside the US.',
        },
        {
          id: 'maritalStatus',
          label: 'Marital Status',
          type: 'select',
          required: true,
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

    // ── STEP 2: Contact & Address ──────────────────────────────────────────────
    {
      id: 'contact',
      title: 'Contact & Address',
      description:
        'VA will mail your enrollment card, appointment reminders, and important correspondence to this address. Keep your contact information current — you can update it later through My HealtheVet or by calling 1-877-222-8387.',
      fields: [
        {
          id: 'street',
          label: 'Street Address',
          type: 'text',
          required: true,
          profilePath: 'profile.address_street',
          placeholder: '123 Main St',
        },
        {
          id: 'apt',
          label: 'Apt / Unit Number',
          type: 'text',
          profilePath: 'profile.address_apt',
          placeholder: 'e.g., Apt 4B (optional)',
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
          maxLength: 10,
          placeholder: '12345',
        },
        {
          id: 'phoneHome',
          label: 'Home Phone',
          type: 'phone',
          profilePath: 'profile.phone_home',
          helpText: 'Your home or landline number.',
        },
        {
          id: 'phoneMobile',
          label: 'Mobile / Cell Phone',
          type: 'phone',
          profilePath: 'profile.phone_mobile',
          helpText: 'Your cell phone number (optional).',
        },
        {
          id: 'email',
          label: 'Email Address',
          type: 'email',
          profilePath: 'profile.email',
          helpText: 'VA may use your email to send appointment reminders and enrollment updates.',
        },
      ],
    },

    // ── STEP 3: Military History (Section II, Item 2) ─────────────────────────
    {
      id: 'militaryHistory',
      title: 'Military History',
      description:
        'These six yes/no questions (Section II, Item 2 on the form) help VA assign your enrollment priority group, which affects your copays and access to care. Answer each one.',
      fields: [
        {
          id: 'purpleHeart',
          label: 'Are you a Purple Heart award recipient? (2A)',
          type: 'radio',
          required: true,
          helpText: 'Purple Heart recipients receive enhanced enrollment priority. You may be asked to provide documentation.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'formerPOW',
          label: 'Are you a former prisoner of war (POW)? (2B)',
          type: 'radio',
          required: true,
          helpText: 'Former POWs receive high enrollment priority and qualify for a comprehensive medical evaluation.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'combatTheaterPost911',
          label: 'Did you serve in a combat theater of operations after 11/11/1998? (2C)',
          type: 'radio',
          required: true,
          helpText: 'Includes Iraq, Afghanistan, and other designated combat zones. Recently discharged combat veterans get an enhanced eligibility period for VA care.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'dischargedForDisability',
          label: 'Were you discharged or retired from the military for a disability incurred in the line of duty? (2D)',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'swAsiaGulfWar',
          label: 'Did you serve in SW Asia during the Gulf War between 8/2/1990 and 11/11/1998? (2E)',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'serviceConnectedRating',
          label: 'Do you have a VA service-connected disability rating? (2F)',
          type: 'radio',
          required: true,
          helpText: 'A VA-assigned rating for a condition connected to your service. A rating of 50% or higher (or any compensable rating) places you in a higher enrollment priority group.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
      ],
    },

    // ── STEP 4: Military Service ───────────────────────────────────────────────
    {
      id: 'militaryService',
      title: 'Military Service',
      description:
        'Enter information about your most recent period of active duty service. This must match your DD-214. Discharge status affects eligibility — most discharges other than Dishonorable qualify for VA health care. If your character of discharge is Other Than Honorable, VA will still review your case and may determine eligibility.',
      fields: [
        {
          id: 'serviceBranch',
          label: 'Most Recent Branch of Service',
          type: 'select',
          required: true,
          profilePath: 'servicePeriods[0].branch',
          options: branchOptions,
        },
        {
          id: 'serviceEntryDate',
          label: 'Date Entered Active Duty',
          type: 'date',
          required: true,
          profilePath: 'servicePeriods[0].date_entered',
          helpText: 'The date you began your most recent period of active duty service.',
        },
        {
          id: 'serviceSeparationDate',
          label: 'Date of Discharge or Release',
          type: 'date',
          profilePath: 'servicePeriods[0].date_separated',
          helpText: 'Leave blank if you are currently on active duty.',
        },
        {
          id: 'dischargeType',
          label: 'Character of Discharge',
          type: 'select',
          required: true,
          profilePath: 'servicePeriods[0].character_of_discharge',
          helpText: 'Found in Box 24 of your DD-214. If you have multiple discharge types across service periods, enter the most recent.',
          options: [
            { label: 'Honorable', value: 'Honorable' },
            { label: 'General Under Honorable Conditions', value: 'General Under Honorable' },
            { label: 'Other Than Honorable', value: 'Other Than Honorable' },
            { label: 'Bad Conduct', value: 'Bad Conduct' },
            { label: 'Dishonorable', value: 'Dishonorable' },
            { label: 'Uncharacterized', value: 'Uncharacterized' },
          ],
        },
        {
          id: 'militaryServiceNumber',
          label: 'Military Service Number (1F)',
          type: 'text',
          placeholder: 'If applicable',
          helpText: 'Veterans who served before July 1972 were assigned a separate service number. Leave blank if your SSN is your service number.',
        },
        {
          id: 'currentlyActiveDuty',
          label: 'Are you currently on active duty?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes — I am currently serving on active duty', value: 'Yes' },
            { label: 'No — I have separated or am in the reserves/Guard', value: 'No' },
          ],
        },
        {
          id: 'expectedSeparationDate',
          label: 'Future Discharge Date (if still serving)',
          type: 'date',
          condition: { field: 'currentlyActiveDuty', value: 'Yes' },
          helpText: 'If you are still on active duty, enter your scheduled separation date (Item 1C on the form).',
        },
      ],
    },

    // ── STEP 5a: Military Exposure — Locations (Section II, Item 3 A–D) ────────
    {
      id: 'exposureLocations',
      title: 'Military Exposure — Where You Served',
      description:
        'Section II, Item 3 asks whether you served in locations associated with toxic or radiation exposure. Answer each yes/no question. If yes, provide an approximate time-frame (month/year) where asked. This helps VA screen you for related conditions at no cost.',
      fields: [
        {
          id: 'radiationActivity',
          label: 'Did you serve in an ionizing-radiation location and take part in nuclear testing, treatments, or cleanup? (3A)',
          type: 'radio',
          required: true,
          helpText: 'Examples: Hiroshima/Nagasaki cleanup, Enewetak Atoll cleanup, the Palomares or Thule B-52 nuclear-weapon incidents.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'gulfWarHazard',
          label: 'Did you serve in a Gulf War hazard location? (3B)',
          type: 'radio',
          required: true,
          helpText: 'Iraq, Kuwait, Saudi Arabia, Bahrain, Qatar, UAE, Oman, Yemen, Afghanistan, and surrounding waters, among others.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'gulfWarFrom',
          label: 'Gulf War service — From (MM/YYYY)',
          type: 'text',
          condition: { field: 'gulfWarHazard', value: 'Yes' },
          placeholder: 'MM/YYYY',
        },
        {
          id: 'gulfWarTo',
          label: 'Gulf War service — To (MM/YYYY)',
          type: 'text',
          condition: { field: 'gulfWarHazard', value: 'Yes' },
          placeholder: 'MM/YYYY',
        },
        {
          id: 'combatOperations',
          label: 'Were you deployed in support of Enduring Freedom, Freedom’s Sentinel, Iraqi Freedom, New Dawn, Inherent Resolve, or Resolute Support? (3C)',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'agentOrangeService',
          label: 'Did you serve in a herbicide (e.g., Agent Orange) location? (3D)',
          type: 'radio',
          required: true,
          helpText: 'Republic of Vietnam (incl. territorial waters), Thailand bases, Laos, parts of Cambodia, the Korean DMZ, Guam/American Samoa, Johnston Atoll, or aboard a C-123 used to spray herbicides, among others.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'agentOrangeFrom',
          label: 'Herbicide-location service — From (MM/YYYY)',
          type: 'text',
          condition: { field: 'agentOrangeService', value: 'Yes' },
          placeholder: 'MM/YYYY',
        },
        {
          id: 'agentOrangeTo',
          label: 'Herbicide-location service — To (MM/YYYY)',
          type: 'text',
          condition: { field: 'agentOrangeService', value: 'Yes' },
          placeholder: 'MM/YYYY',
        },
      ],
    },

    // ── STEP 5b: Military Exposure — Hazards (Section II, Item 3E) ─────────────
    {
      id: 'exposureHazards',
      title: 'Military Exposure — What You Were Exposed To',
      description:
        'Section II, Item 3E — check every hazard you may have been exposed to during service. Leave all unchecked if none apply. You can find additional exposure categories at publichealth.va.gov/exposures.',
      fields: [
        { id: 'expAirPollutants', label: 'Air pollutants (burn pits, sand, oil-well/sulfur fires)', type: 'checkbox' },
        { id: 'expChemicals',     label: 'Chemicals (pesticides, herbicides, contaminated water)', type: 'checkbox' },
        { id: 'expCampLejeune',   label: 'Contaminated water at Camp Lejeune', type: 'checkbox' },
        { id: 'expRadiation',     label: 'Radiation', type: 'checkbox' },
        { id: 'expShad',          label: 'SHAD (Shipboard Hazard and Defense)', type: 'checkbox' },
        { id: 'expOccupational',  label: 'Occupational hazards (jet fuel, industrial solvents, lead, firefighting foams)', type: 'checkbox' },
        { id: 'expAsbestos',      label: 'Asbestos', type: 'checkbox' },
        { id: 'expMustardGas',    label: 'Mustard gas', type: 'checkbox' },
        { id: 'expWarfareAgents', label: 'Warfare agents (nerve agents, chemical and biological weapons)', type: 'checkbox' },
        { id: 'expOther',         label: 'Other exposure not listed above', type: 'checkbox' },
        {
          id: 'expOtherSpecify',
          label: 'If "Other", please specify',
          type: 'text',
          condition: { field: 'expOther', value: true },
        },
      ],
    },

    // ── STEP 6: Health Insurance ───────────────────────────────────────────────
    {
      id: 'healthInsurance',
      title: 'Health Insurance',
      description:
        'VA is required by law to bill private health insurers for care related to non-service-connected conditions. Providing your insurance information does not affect your eligibility or copays for service-connected care. VA will never bill you for care that is covered at no cost.',
      fields: [
        {
          id: 'hasOtherInsurance',
          label: 'Do you have health insurance coverage other than Medicare Part A?',
          type: 'radio',
          required: true,
          helpText: 'Include any private insurance, employer health plan, TRICARE, CHAMPVA, Medicaid, or Medicare Part B.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'insuranceCompanyName',
          label: 'Insurance Company Name',
          type: 'text',
          required: true,
          maxLength: 40,
          placeholder: 'e.g., Blue Cross Blue Shield',
          condition: { field: 'hasOtherInsurance', value: 'Yes' },
        },
        {
          id: 'insurancePolicyNumber',
          label: 'Insurance Policy Number',
          type: 'text',
          required: true,
          maxLength: 30,
          placeholder: 'Found on your insurance card',
          condition: { field: 'hasOtherInsurance', value: 'Yes' },
        },
        {
          id: 'insuranceGroupNumber',
          label: 'Insurance Group Number',
          type: 'text',
          maxLength: 30,
          placeholder: 'Found on your insurance card (if applicable)',
          helpText: 'Leave blank if your policy does not have a group number (common for individual plans).',
          condition: { field: 'hasOtherInsurance', value: 'Yes' },
        },
        {
          id: 'insurancePolicyholderName',
          label: 'Name of Policyholder',
          type: 'text',
          required: true,
          maxLength: 40,
          placeholder: 'Name on the insurance policy',
          helpText: 'If the policy is in your name, enter your name. If it is a spouse\'s or employer plan, enter the primary policyholder\'s name.',
          condition: { field: 'hasOtherInsurance', value: 'Yes' },
        },
        {
          id: 'eligibleForMedicaid',
          label: 'Are you eligible for Medicaid?',
          type: 'radio',
          required: true,
          helpText: 'Medicaid is federal/state health insurance for people with low income. Veterans receiving Medicaid are exempt from VA financial disclosure.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'medicarePartA',
          label: 'Are you enrolled in Medicare hospital insurance (Part A)?',
          type: 'radio',
          required: true,
          helpText: 'Medicare Part A covers hospital stays. If enrolled, VA coordinates benefits with Medicare.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'medicareEffectiveDate',
          label: 'Medicare Part A Effective Date',
          type: 'date',
          condition: { field: 'medicarePartA', value: 'Yes' },
        },
        {
          id: 'medicareClaimNumber',
          label: 'Medicare Number',
          type: 'text',
          condition: { field: 'medicarePartA', value: 'Yes' },
          helpText: 'The number printed on your Medicare card.',
        },
      ],
    },

    // ── STEP 7: Employment ─────────────────────────────────────────────────────
    {
      id: 'employment',
      title: 'Employment',
      description:
        'VA uses employment and income information to determine your priority group and whether you qualify for cost-free care. Veterans with higher incomes who are not service-connected may have copays. This information is kept confidential.',
      fields: [
        {
          id: 'employmentStatus',
          label: 'Employment Status',
          type: 'radio',
          required: true,
          helpText: 'The form records full-time, part-time, not employed, or retired.',
          options: [
            { label: 'Employed full-time', value: 'Employed full-time' },
            { label: 'Employed part-time', value: 'Employed part-time' },
            { label: 'Not employed', value: 'Not employed' },
            { label: 'Retired', value: 'Retired' },
          ],
        },
        {
          id: 'retirementDate',
          label: 'Date of Retirement',
          type: 'date',
          condition: { field: 'employmentStatus', value: 'Retired' },
        },
        {
          id: 'employerName',
          label: 'Company Name',
          type: 'text',
          maxLength: 40,
          placeholder: 'e.g., ABC Corporation',
          helpText: 'Complete if employed or retired.',
        },
        {
          id: 'employerAddress',
          label: 'Company Address',
          type: 'text',
          maxLength: 60,
          placeholder: '123 Business Blvd, Chicago, IL 60601',
          helpText: 'Complete if employed or retired.',
        },
        {
          id: 'employerPhone',
          label: 'Company Phone',
          type: 'phone',
        },
      ],
    },

    // ── STEP 8: Financial Disclosure ───────────────────────────────────────────
    {
      id: 'financialDisclosure',
      title: 'Financial Disclosure',
      description:
        'VA uses your gross household income from last year to determine your priority group and copay obligations. You are NOT required to provide financial information — veterans who decline are placed in Priority Group 8 and may be responsible for copays. Completing this section may qualify you for a higher priority group and lower or no copays. All amounts should be for the prior calendar year.',
      fields: [
        {
          id: 'provideFinancialInfo',
          label: 'Do you want to provide your household financial information (Sections VII–VIII)?',
          type: 'radio',
          required: true,
          helpText:
            'Disclosure is voluntary, but VA is not currently enrolling new applicants who decline unless they have another qualifying eligibility factor. Providing it may qualify you for cost-free care, medications, or travel assistance.',
          options: [
            { label: 'Yes — I will provide my financial information', value: 'Yes' },
            { label: 'No — I do not wish to provide it (I agree to pay applicable copays)', value: 'No' },
          ],
        },
        {
          id: 'grossEmploymentIncome',
          label: 'Gross Annual Income from Employment (Section VII, line 1)',
          type: 'number',
          condition: { field: 'provideFinancialInfo', value: 'Yes' },
          helpText: 'Wages, bonuses, tips, etc. — EXCLUDING income from your farm, ranch, property, or business. Report the prior calendar year, before taxes.',
          placeholder: '0',
        },
        {
          id: 'netFarmBusinessIncome',
          label: 'Net Income from Farm, Ranch, Property, or Business (Section VII, line 2)',
          type: 'number',
          condition: { field: 'provideFinancialInfo', value: 'Yes' },
          helpText: 'Net income after business expenses. Report losses as 0 (do not enter negative numbers).',
          placeholder: '0',
        },
        {
          id: 'otherIncome',
          label: 'Other Income (Social Security, pension, interest, dividends, etc.) (Section VII, line 3)',
          type: 'number',
          condition: { field: 'provideFinancialInfo', value: 'Yes' },
          helpText: 'Excludes welfare and SSI. Do not include VA disability compensation or VA pension.',
          placeholder: '0',
        },
        {
          id: 'unreimbursedMedicalExpenses',
          label: 'Total Non-Reimbursed Medical Expenses Paid by You or Your Spouse (Section VIII, line 1)',
          type: 'number',
          condition: { field: 'provideFinancialInfo', value: 'Yes' },
          helpText: 'Out-of-pocket medical/dental/drug/insurance costs not reimbursed by insurance. VA calculates a deductible.',
          placeholder: '0',
        },
        {
          id: 'funeralBurialExpenses',
          label: 'Funeral & Burial Expenses Paid for a Deceased Spouse or Dependent Child (Section VIII, line 2)',
          type: 'number',
          condition: { field: 'provideFinancialInfo', value: 'Yes' },
          helpText: 'Amount you paid last calendar year for funeral/burial (including prepaid burial) for your deceased spouse or dependent child.',
          placeholder: '0',
        },
        {
          id: 'veteranEducationExpenses',
          label: 'Your Own College or Vocational Education Expenses (Section VIII, line 3)',
          type: 'number',
          condition: { field: 'provideFinancialInfo', value: 'Yes' },
          helpText: 'Tuition, books, fees, and materials YOU paid last year for your own education. Do NOT list your dependents’ education expenses.',
          placeholder: '0',
        },
      ],
    },

    // ── STEP 9: Spouse & Dependents ───────────────────────────────────────────
    {
      id: 'spouseAndDependents',
      title: 'Spouse & Dependents',
      description:
        'If you reported income above, VA needs your spouse\'s information to calculate your combined household income and determine your priority group accurately. Spouse information is not used for benefit eligibility — only for income calculations.',
      fields: [
        {
          id: 'married',
          label: 'Are you currently married or do you have dependents?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'spouseFirstName',
          label: "Spouse's First Name",
          type: 'text',
          maxLength: 30,
          condition: { field: 'married', value: 'Yes' },
        },
        {
          id: 'spouseLastName',
          label: "Spouse's Last Name",
          type: 'text',
          maxLength: 30,
          condition: { field: 'married', value: 'Yes' },
        },
        {
          id: 'spouseSsn',
          label: "Spouse's Social Security Number",
          type: 'ssn',
          sensitive: true,
          condition: { field: 'married', value: 'Yes' },
          helpText: 'Required to verify household income. Stored securely and only used for benefit calculation.',
        },
        {
          id: 'spouseSex',
          label: "Spouse's Sex",
          type: 'radio',
          condition: { field: 'married', value: 'Yes' },
          options: [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
          ],
        },
        {
          id: 'spouseDob',
          label: "Spouse's Date of Birth",
          type: 'date',
          condition: { field: 'married', value: 'Yes' },
        },
        {
          id: 'marriageDate',
          label: 'Date of Marriage',
          type: 'date',
          condition: { field: 'married', value: 'Yes' },
          helpText: 'The date of your current marriage.',
        },
        {
          id: 'spouseAddress',
          label: "Spouse's Address & Phone (if different from yours)",
          type: 'text',
          condition: { field: 'married', value: 'Yes' },
          placeholder: 'Street, City, State, ZIP — leave blank if same as yours',
        },
        {
          id: 'providedSupport',
          label: 'If your spouse or a dependent child did not live with you last year, did you provide support?',
          type: 'radio',
          condition: { field: 'married', value: 'Yes' },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'spouseGrossIncome',
          label: "Spouse's Gross Annual Income from Employment",
          type: 'number',
          condition: { field: 'married', value: 'Yes' },
          helpText: 'Your spouse\'s gross employment income (before taxes) for the prior calendar year.',
          placeholder: '0',
        },
        {
          id: 'spouseOtherIncome',
          label: "Spouse's Other Income (Social Security, pension, interest, etc.)",
          type: 'number',
          condition: { field: 'married', value: 'Yes' },
          placeholder: '0',
        },
      ],
    },

    // ── STEP 10: Required Documents ───────────────────────────────────────────
    {
      id: 'requiredDocs',
      title: 'Required Documents — Upload Now',
      description:
        'Upload your DD-214 before submitting. VA uses it to verify your service dates, branch, and character of discharge. If you served multiple periods of active duty, attach a DD-214 for each period. Your application may be delayed if this document is missing.',
      requiredAttachments: [
        {
          label: 'DD-214, Member 4 Copy — one per period of active duty service',
          helpText: 'Box 24 (character of discharge) and Box 28 (narrative reason for separation) are required for eligibility review. If lost, request a copy from the National Archives at archives.gov/veterans.',
        },
      ],
      optionalAttachments: [
        {
          label: 'Insurance card or policy information if claiming other health insurance',
          helpText: 'Speeds up VA billing coordination with your private insurer.',
        },
      ],
      fields: [],
    },

    // ── STEP 11: Certification & Signature ────────────────────────────────────
    {
      id: 'signature',
      title: 'Certification & Signature',
      description:
        'CERTIFICATION: I certify that the statements on this form are true and correct to the best of my knowledge and belief. I authorize the release of information from my records to the VA for the purpose of determining my eligibility for VA health care benefits.\n\nPENALTY: Willfully providing false information or concealing material facts to obtain VA health care benefits is a crime and may result in fines, imprisonment, or both under 18 U.S.C. § 1001 and 38 U.S.C. § 1001.\n\nPRIVACY ACT: Information collected on this form may be disclosed outside the VA only as permitted by law. Providing your SSN is mandatory under 38 U.S.C. § 1705.',
      fields: [
        {
          id: 'privacyAct',
          label: 'I have read and understand the certification statement above and certify that my answers are true and correct.',
          type: 'checkbox',
          required: true,
          helpText: 'You must check this box before you can sign and submit.',
        },
        {
          id: 'signaturePad',
          label: 'Your Signature',
          type: 'signature',
          required: true,
          helpText: 'Draw your signature using your mouse or finger. By signing, you certify that all information provided on this application is true and correct.',
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

    // Full name in "Last, First [Middle]" format (PDF LastFirstMiddle field)
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

    // Place of birth: "City, State/Country"
    const placeOfBirth = [s(answers.birthCity), s(answers.birthStateOrCountry)]
      .filter(Boolean).join(', ');

    // Spouse full name: "Last, First" (Section IV field is "Last, First, Middle Name")
    const spouseLast  = s(answers.spouseLastName);
    const spouseFirst = s(answers.spouseFirstName);
    const spouseFullName = spouseLast && spouseFirst
      ? `${spouseLast}, ${spouseFirst}`
      : spouseLast || spouseFirst;

    // Spouse SSN formatted as "XXX-XX-XXXX"
    const rawSpouseSsn = s(answers.spouseSsn).replace(/\D/g, '');
    const spouseSsnFormatted = rawSpouseSsn.length === 9
      ? `${rawSpouseSsn.slice(0, 3)}-${rawSpouseSsn.slice(3, 5)}-${rawSpouseSsn.slice(5)}`
      : s(answers.spouseSsn);

    return { ...answers, fullName, ssnFormatted, placeOfBirth, spouseFullName, spouseSsnFormatted };
  },
};
