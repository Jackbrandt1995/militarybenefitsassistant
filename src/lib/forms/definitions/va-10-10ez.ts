import type { FormDefinition } from '../types';
import { branchOptions, stateOptions } from '@/lib/validation';

export const va1010ez: FormDefinition = {
  id: 'va-10-10ez',
  version: 1,
  formNumber: 'VA 10-10EZ',
  title: 'Application for VA Health Care',
  description:
    'Enroll in VA health care benefits. Most veterans who served on active duty and were discharged under conditions other than dishonorable qualify. Enrollment is free and covers a wide range of medical services.',
  pdfTemplate: '/forms/VA-10-10EZ.pdf',
  category: 'healthcare',
  nextSteps:
    'Submit this form to your nearest VA medical center or mail it to the VA Health Eligibility Center, P.O. Box 17885, Denver, CO 80217-0885.',
  steps: [

    // ── STEP 1: Personal Information ──────────────────────────────────────────
    {
      id: 'personal',
      title: 'Personal Information',
      description:
        'Your legal name and identifying information are used to match your records across VA systems. Use the exact name shown on your discharge papers or government-issued ID. Your Social Security Number and date of birth are required by law to process your enrollment.',
      fields: [
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
          label: 'Middle Name',
          type: 'text',
          profilePath: 'profile.middle_name',
          maxLength: 30,
          helpText: 'Enter your full middle name if you have one (optional).',
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
          id: 'mothersMaidenName',
          label: "Mother's Maiden Name",
          type: 'text',
          required: true,
          maxLength: 35,
          helpText: 'Your mother\'s last name before she was married. VA uses this as a secondary identity verification.',
          placeholder: 'e.g., Smith',
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
            { label: 'Single', value: 'Single' },
            { label: 'Married', value: 'Married' },
            { label: 'Separated', value: 'Separated' },
            { label: 'Divorced', value: 'Divorced' },
            { label: 'Widowed', value: 'Widowed' },
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
          id: 'addressType',
          label: 'Is this address permanent or temporary?',
          type: 'radio',
          required: true,
          helpText: 'Permanent addresses are used for all future VA mail. If you are temporarily staying somewhere (e.g., staying with family during a transition), select Temporary.',
          options: [
            { label: 'Permanent', value: 'Permanent' },
            { label: 'Temporary', value: 'Temporary' },
          ],
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

    // ── STEP 3: VA Benefits & Status ──────────────────────────────────────────
    {
      id: 'vaBenefitsStatus',
      title: 'VA Benefits & Status',
      description:
        'These questions help VA assign you to the correct priority group, which determines your copay levels and access to care. Veterans with higher disability ratings, special honors, or POW status are placed in higher priority groups and typically pay lower (or no) copays.',
      fields: [
        {
          id: 'purpleHeart',
          label: 'Are you a Purple Heart recipient?',
          type: 'radio',
          required: true,
          helpText: 'Purple Heart recipients are enrolled in Priority Group 3 and receive enhanced benefits. You may be asked to provide documentation.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'medalOfHonor',
          label: 'Are you a Medal of Honor recipient?',
          type: 'radio',
          required: true,
          helpText: 'Medal of Honor recipients are enrolled in Priority Group 1 — the highest priority — and have no copays for VA health care.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'medicarePartA',
          label: 'Are you currently enrolled in Medicare Part A (hospital insurance)?',
          type: 'radio',
          required: true,
          helpText: 'Medicare Part A covers hospital stays. If enrolled, VA coordinates benefits with Medicare so you are not billed twice. Medicare Part B (doctor visits) is a separate question.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'disabilityRating',
          label: 'What is your VA service-connected disability rating?',
          type: 'radio',
          required: true,
          helpText: 'Your combined disability rating determines your priority group. A rating of 50% or higher places you in Priority Group 1 (no copays for most services). Select "None" if you have not received a rating or it has not been service-connected.',
          options: [
            { label: 'None / Not rated', value: 'None' },
            { label: '10% – 20%', value: '10-20' },
            { label: '30% – 40%', value: '30-40' },
            { label: '50% – 60%', value: '50-60' },
            { label: '70% or higher', value: '70+' },
          ],
        },
        {
          id: 'formerPOW',
          label: 'Were you a prisoner of war (POW)?',
          type: 'radio',
          required: true,
          helpText: 'Former POWs are enrolled in Priority Group 1 and qualify for a comprehensive medical evaluation. VA has specific health conditions presumed to be related to POW captivity.',
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
          label: 'Expected Date of Separation',
          type: 'date',
          condition: { field: 'currentlyActiveDuty', value: 'Yes' },
          helpText: 'Enter your scheduled date of separation from active duty. You can apply for VA health care up to 180 days before separation.',
        },
      ],
    },

    // ── STEP 5: Service Exposures ──────────────────────────────────────────────
    {
      id: 'serviceExposures',
      title: 'Service Exposures',
      description:
        'VA presumes certain health conditions are connected to specific service environments. If you served in any of these locations or were exposed to these hazards, check all that apply. VA will use this information to screen for related conditions and ensure you receive appropriate care — at no additional cost to you.',
      fields: [
        {
          id: 'combatTheater',
          label: 'Served in a combat theater of operations after November 11, 1998',
          type: 'checkbox',
          helpText: 'Includes Iraq, Afghanistan, and other locations designated as combat zones after 11/11/1998. Combat veterans may receive free care for any illness — even if not service-connected — for 5 years after discharge.',
        },
        {
          id: 'swAsiaTheater',
          label: 'Served in Southwest Asia theater of operations (Gulf War 1990 – present)',
          type: 'checkbox',
          helpText: 'Includes service in the Persian Gulf, Iraq, Kuwait, Saudi Arabia, Bahrain, Qatar, UAE, Oman, Afghanistan, or nearby waters from August 2, 1990 to present. VA presumes certain undiagnosed illnesses (Gulf War Syndrome) are service-connected.',
        },
        {
          id: 'agentOrange',
          label: 'Served in Vietnam and may have been exposed to Agent Orange (1962 – 1975)',
          type: 'checkbox',
          helpText: 'Includes service in the Republic of Vietnam, the Korean demilitarized zone (1968–1969), or certain other locations where Agent Orange was used or stored. VA presumes many cancers and other conditions are service-connected.',
        },
        {
          id: 'campLejeune',
          label: 'Lived or worked at Camp Lejeune, NC for at least 30 days (1953 – 1987)',
          type: 'checkbox',
          helpText: 'Veterans (and their family members) who lived or worked at Camp Lejeune during this period may have been exposed to contaminated drinking water. VA provides free health care for 15 related conditions.',
        },
        {
          id: 'radiationRisk',
          label: 'Participated in radiation risk activities during service',
          type: 'checkbox',
          helpText: 'Includes onsite participation in atmospheric nuclear tests, post-war occupation of Hiroshima or Nagasaki, or other radiation-related duties. VA presumes certain cancers are related to radiation exposure.',
        },
        {
          id: 'project112',
          label: 'Participated in Project 112/SHAD (1962 – 1975)',
          type: 'checkbox',
          helpText: 'Project 112 and Shipboard Hazard and Defense (SHAD) were classified Cold War tests of biological and chemical warfare agents. Veterans who participated may qualify for related health care.',
        },
        {
          id: 'mst',
          label: 'Experienced military sexual trauma (MST) during service',
          type: 'checkbox',
          helpText: 'Military sexual trauma means sexual assault or repeated, threatening sexual harassment that occurred during military service. VA provides free, confidential counseling and treatment for MST-related conditions — no VA disability rating is required.',
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
          id: 'insurancePolicyholderDob',
          label: "Policyholder's Date of Birth",
          type: 'date',
          required: true,
          condition: { field: 'hasOtherInsurance', value: 'Yes' },
          helpText: 'Required to identify the policyholder in insurance billing.',
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
          options: [
            { label: 'Employed full-time', value: 'Employed full-time' },
            { label: 'Employed part-time', value: 'Employed part-time' },
            { label: 'Self-employed', value: 'Self-employed' },
            { label: 'Not employed', value: 'Not employed' },
            { label: 'Retired', value: 'Retired' },
          ],
        },
        {
          id: 'employerName',
          label: 'Employer Name',
          type: 'text',
          maxLength: 40,
          placeholder: 'e.g., ABC Corporation',
          condition: { field: 'employmentStatus', value: 'Employed full-time' },
        },
        {
          id: 'employerAddress',
          label: 'Employer Address',
          type: 'text',
          maxLength: 60,
          placeholder: '123 Business Blvd, Chicago, IL 60601',
          condition: { field: 'employmentStatus', value: 'Employed full-time' },
        },
        {
          id: 'employerPhone',
          label: 'Employer Phone',
          type: 'phone',
          condition: { field: 'employmentStatus', value: 'Employed full-time' },
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
          id: 'grossEmploymentIncome',
          label: 'Gross Annual Income from Employment',
          type: 'number',
          required: false,
          helpText: 'Include wages, salaries, tips, and other compensation from employment. Report the total before taxes and deductions. Do not include your spouse\'s income here.',
          placeholder: '0',
        },
        {
          id: 'netFarmBusinessIncome',
          label: 'Net Income from Farm, Ranch, Self-Employment, or Business',
          type: 'number',
          required: false,
          helpText: 'Net income after business expenses are deducted. Report losses as 0 (do not enter negative numbers).',
          placeholder: '0',
        },
        {
          id: 'otherIncome',
          label: 'Other Income (Social Security, pension, interest, dividends, etc.)',
          type: 'number',
          required: false,
          helpText: 'Include Social Security benefits (not SSI), pension payments, annuities, investment income, rental income, and other recurring income. Do not include VA disability compensation or VA pension.',
          placeholder: '0',
        },
        {
          id: 'unreimbursedMedicalExpenses',
          label: 'Total Non-Reimbursable Medical Expenses Paid by You or Your Spouse',
          type: 'number',
          required: false,
          helpText: 'Medical expenses paid out-of-pocket that were not reimbursed by insurance. Include doctor visits, prescriptions, dental, vision, and other health costs. This deduction can reduce your income for VA priority purposes.',
          placeholder: '0',
        },
        {
          id: 'numberOfDependents',
          label: 'Number of Dependent Children and/or Other Dependents',
          type: 'number',
          required: false,
          helpText: 'Count all children under 18, children 18–23 who are full-time students, and any other dependents you financially support (e.g., a dependent parent). Each dependent increases the income threshold for your priority group.',
          placeholder: '0',
        },
        {
          id: 'dependentEducationExpenses',
          label: 'Total Education Expenses Paid for Dependents',
          type: 'number',
          required: false,
          helpText: 'Tuition, fees, and other education costs you paid for dependent children in college or a training program. This deduction may help lower your effective income for VA purposes.',
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
          id: 'spouseLivedWithYou',
          label: 'Did your spouse live with you last year?',
          type: 'radio',
          condition: { field: 'married', value: 'Yes' },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'spouseGrossIncome',
          label: "Spouse's Gross Annual Income",
          type: 'number',
          condition: { field: 'married', value: 'Yes' },
          helpText: 'Your spouse\'s total gross income from all sources before taxes, for the prior calendar year.',
          placeholder: '0',
        },
        {
          id: 'numberOfDependentChildren',
          label: 'Number of Dependent Children',
          type: 'number',
          helpText: 'Enter the total number of children you claim as dependents, including step-children and adopted children.',
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
};
