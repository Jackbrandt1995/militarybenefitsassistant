import type { FormDefinition } from '../types';
import { branchOptions, stateOptions } from '@/lib/validation';

export const va221990: FormDefinition = {
  id: 'va-22-1990',
  formNumber: 'VA 22-1990',
  title: 'Application for VA Education Benefits',
  description: 'Apply for VA education benefits under the GI Bill, MGIB, VEAP, or other programs. This is the primary application form for veterans seeking education benefits.',
  pdfTemplate: '/forms/VA-22-1990.pdf',
  category: 'application',
  steps: [

    // ── STEP 1: Benefit Selection ──────────────────────────────────────────
    {
      id: 'benefit',
      title: 'Benefit Selection',
      description: 'Choose which GI Bill chapter you are applying for. If you served on active duty after September 10, 2001, you most likely qualify for Chapter 33 (Post-9/11 GI Bill), which is the most generous benefit — it covers full tuition, housing, and a book stipend.',
      fields: [
        {
          id: 'benefitChapter',
          label: 'Which education benefit are you applying for?',
          type: 'radio',
          required: true,
          helpText: 'Select the chapter that matches your service and eligibility. You can only receive one chapter at a time.',
          options: [
            { label: 'Chapter 33 – Post-9/11 GI Bill (served after 9/10/2001)', value: 'chapter33' },
            { label: 'Chapter 30 – Montgomery GI Bill Active Duty (MGIB-AD)', value: 'chapter30' },
            { label: 'Chapter 1606 – Montgomery GI Bill Selected Reserve (MGIB-SR)', value: 'chapter1606' },
            { label: 'Chapter 32 / Section 903 – Veterans Educational Assistance Program (VEAP)', value: 'chapter32' },
          ],
        },
      ],
    },

    // ── STEP 2: Personal Information ──────────────────────────────────────
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Your legal name and identifying information must match your military records exactly. Use the name shown on your DD-214 or service records.',
      fields: [
        {
          id: 'ssn',
          label: 'Social Security Number',
          type: 'ssn',
          required: true,
          profilePath: 'profile.ssn_encrypted',
          helpText: 'Entered securely and used to match your VA records.',
        },
        {
          id: 'dob',
          label: 'Date of Birth',
          type: 'date',
          required: true,
          profilePath: 'profile.dob',
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
          id: 'sex',
          label: 'Sex (as listed on military records)',
          type: 'radio',
          required: true,
          profilePath: 'profile.sex',
          helpText: 'Select as shown on your DD-214 or service records.',
          options: [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
          ],
        },
      ],
    },

    // ── STEP 3: Contact Information ────────────────────────────────────────
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Provide your current mailing address. VA will mail your Certificate of Eligibility and other correspondence here. Keep this updated if you move.',
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
          id: 'street2',
          label: 'Address Line 2',
          type: 'text',
          profilePath: 'profile.address_apt2',
          placeholder: 'Suite, Building, PO Box (optional)',
        },
        {
          id: 'apt',
          label: 'Apt / Unit Number',
          type: 'text',
          profilePath: 'profile.address_apt',
          placeholder: 'e.g., Apt 4B',
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
          id: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          profilePath: 'profile.email',
          helpText: 'VA may send status updates to this address.',
        },
        {
          id: 'phonePrimary',
          label: 'Home Phone',
          type: 'phone',
          profilePath: 'profile.phone_home',
          helpText: 'Your home or landline number.',
        },
        {
          id: 'phoneSecondary',
          label: 'Mobile / Cell Phone',
          type: 'phone',
          profilePath: 'profile.phone_mobile',
          helpText: 'Your cell phone number (optional).',
        },
      ],
    },

    // ── STEP 4: Direct Deposit ─────────────────────────────────────────────
    {
      id: 'directDeposit',
      title: 'Direct Deposit',
      description: 'VA education benefit payments are deposited directly to your bank account. Have a voided check handy — your routing number is the 9-digit number on the bottom left, and your account number is next to it.',
      fields: [
        {
          id: 'accountType',
          label: 'Account Type',
          type: 'radio',
          profilePath: 'directDeposit.account_type',
          options: [
            { label: 'Checking', value: 'Checking' },
            { label: 'Savings', value: 'Savings' },
          ],
        },
        {
          id: 'routingNumber',
          label: 'Routing / Transit Number',
          type: 'text',
          profilePath: 'directDeposit.routing_number_encrypted',
          maxLength: 9,
          sensitive: true,
          placeholder: '9-digit number',
          helpText: 'Found at the bottom-left of a check. Always 9 digits.',
        },
        {
          id: 'accountNumber',
          label: 'Account Number',
          type: 'text',
          profilePath: 'directDeposit.account_number_encrypted',
          sensitive: true,
          helpText: 'Found at the bottom of a check, after the routing number.',
        },
      ],
    },

    // ── STEP 5: Emergency Contact ──────────────────────────────────────────
    {
      id: 'emergencyContact',
      title: 'Emergency Contact',
      description: 'Provide someone the VA can contact if they are unable to reach you — a parent, spouse, sibling, or trusted friend who will always know how to get in touch with you.',
      fields: [
        {
          id: 'emergencyName',
          label: 'Full Name',
          type: 'text',
          placeholder: 'Jane Doe',
        },
        {
          id: 'emergencyAddress',
          label: 'Address',
          type: 'text',
          placeholder: '456 Oak Ave, Springfield, IL 62701',
        },
        {
          id: 'emergencyPhone',
          label: 'Phone Number',
          type: 'phone',
        },
      ],
    },

    // ── STEP 6: Education Type & School ───────────────────────────────────
    {
      id: 'educationType',
      title: 'Education Type & School',
      description: 'Tell VA what type of training or education program you plan to enroll in. Most veterans attending a college or university should select "College or Other School." If you are not sure, select what best describes your program.',
      fields: [
        {
          id: 'educationType',
          label: 'Type of education or training program',
          type: 'radio',
          required: true,
          options: [
            { label: 'College, University, or Trade School', value: 'college' },
            { label: 'Apprenticeship / On-the-Job Training (OJT)', value: 'apprenticeship' },
            { label: 'Correspondence Course', value: 'correspondence' },
            { label: 'Vocational Flight Training', value: 'flight' },
            { label: 'National Test Reimbursement (SAT, ACT, CLEP, etc.)', value: 'nationalTest' },
            { label: 'Licensing or Certification Test (trade/professional)', value: 'licensingTest' },
            { label: 'Tuition Assistance Top-Up', value: 'taTopUp' },
          ],
        },
        {
          id: 'schoolNameAddress',
          label: 'School Name and Full Address',
          type: 'textarea',
          helpText: 'Include the full name and address of the school you plan to attend. Leave blank if you selected National Test Reimbursement or TA Top-Up.',
          placeholder: 'Example: University of Illinois at Chicago\n1200 W Harrison St, Chicago, IL 60607',
        },
        {
          id: 'educationObjective',
          label: 'Educational or Career Objective',
          type: 'text',
          helpText: 'Describe what degree, certificate, or skill you are working toward.',
          placeholder: 'e.g., Bachelor of Science in Nursing, welding certification, FAA commercial pilot license',
        },
      ],
    },

    // ── STEP 7: Active Duty Status ─────────────────────────────────────────
    {
      id: 'activeDuty',
      title: 'Active Duty Status',
      description: 'Answer these two questions about your current military status. "Terminal leave" means you have been released from duty pending official separation — your last weeks before officially leaving the military.',
      fields: [
        {
          id: 'onActiveDuty',
          label: 'Are you currently on active duty?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes — I am currently serving on active duty', value: 'Yes' },
            { label: 'No — I have separated or am in the reserves/Guard', value: 'No' },
          ],
        },
        {
          id: 'onTerminalLeave',
          label: 'Are you currently on terminal leave (final leave before separation)?',
          type: 'radio',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
      ],
    },

    // ── STEP 8: Service History ────────────────────────────────────────────
    {
      id: 'serviceHistory',
      title: 'Service History',
      description: 'Enter your military service periods. List them in order, starting with the most recent. You must include all active duty periods that qualify you for the benefit you selected. Dates should match your DD-214.',
      fields: [
        // Period 1
        { id: 'service1Branch', label: 'Period 1 – Branch / Component', type: 'select', profilePath: 'servicePeriods[0].branch', options: branchOptions, helpText: 'e.g., Army Active Duty, Marine Corps Reserve, Navy' },
        { id: 'service1Entered', label: 'Period 1 – Date Entered Service', type: 'date', profilePath: 'servicePeriods[0].date_entered' },
        { id: 'service1Separated', label: 'Period 1 – Date Separated / Discharged', type: 'date', profilePath: 'servicePeriods[0].date_separated', helpText: 'Leave blank if still serving.' },
        { id: 'service1Status', label: 'Period 1 – Service Status', type: 'text', profilePath: 'servicePeriods[0].service_status', placeholder: 'e.g., Active duty, Drilling reservist, AGR, IRR' },
        { id: 'service1Involuntary', label: 'Period 1 – Were you involuntarily called to active duty?', type: 'text', placeholder: 'Yes / No — if Yes, explain briefly' },

        // Period 2
        { id: 'service2Branch', label: 'Period 2 – Branch / Component', type: 'select', profilePath: 'servicePeriods[1].branch', options: branchOptions },
        { id: 'service2Entered', label: 'Period 2 – Date Entered Service', type: 'date', profilePath: 'servicePeriods[1].date_entered' },
        { id: 'service2Separated', label: 'Period 2 – Date Separated / Discharged', type: 'date', profilePath: 'servicePeriods[1].date_separated' },
        { id: 'service2Status', label: 'Period 2 – Service Status', type: 'text', profilePath: 'servicePeriods[1].service_status' },

        // Period 3
        { id: 'service3Branch', label: 'Period 3 – Branch / Component', type: 'select', profilePath: 'servicePeriods[2].branch', options: branchOptions },
        { id: 'service3Entered', label: 'Period 3 – Date Entered Service', type: 'date', profilePath: 'servicePeriods[2].date_entered' },
        { id: 'service3Separated', label: 'Period 3 – Date Separated / Discharged', type: 'date', profilePath: 'servicePeriods[2].date_separated' },
      ],
    },

    // ── STEP 9: Diplomas & Certifications ─────────────────────────────────
    {
      id: 'educationCerts',
      title: 'Diplomas & Certifications',
      description: 'VA needs to know your existing educational credentials. A high school diploma or GED is required to receive most GI Bill benefits.',
      fields: [
        {
          id: 'hsGrad',
          label: 'Do you have a high school diploma or GED?',
          type: 'radio',
          profilePath: 'profile.high_school_diploma',
          options: [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ],
        },
        {
          id: 'hsGradDate',
          label: 'Date diploma or GED was awarded',
          type: 'date',
          profilePath: 'profile.high_school_diploma_date',
          helpText: 'Approximate year is fine if you do not remember the exact date.',
        },
        {
          id: 'faaFlightCerts',
          label: 'Do you hold any FAA flight certificates or ratings?',
          type: 'radio',
          options: [
            { label: 'Yes – I hold FAA pilot/flight certificates', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
          helpText: 'Relevant only if you selected Vocational Flight Training in the previous section.',
        },
      ],
    },

    // ── STEP 10: College & Training History ───────────────────────────────
    {
      id: 'collegeHistory',
      title: 'College & Training History',
      description: 'List any colleges, trade schools, or training programs you have previously attended. VA uses this to understand your educational background. You may list up to two institutions. Leave fields blank if they do not apply.',
      fields: [
        // Institution 1
        { id: 'edu1Name', label: 'Institution 1 – Name & Location', type: 'text', profilePath: 'educationHistory[0].institution', placeholder: 'e.g., Columbus State Community College, Columbus, OH' },
        { id: 'edu1From', label: 'Institution 1 – Start Date', type: 'date', profilePath: 'educationHistory[0].date_from' },
        { id: 'edu1To', label: 'Institution 1 – End Date', type: 'date', profilePath: 'educationHistory[0].date_to', helpText: 'Leave blank if currently enrolled.' },
        { id: 'edu1Hours', label: 'Institution 1 – Credit Hours Completed', type: 'text', profilePath: 'educationHistory[0].hours_count', placeholder: 'e.g., 60 semester hours', helpText: 'Enter number and type (semester/quarter/clock hours).' },
        { id: 'edu1Degree', label: 'Institution 1 – Degree or Certificate Earned', type: 'text', profilePath: 'educationHistory[0].degree', placeholder: 'e.g., Associate of Arts, none' },
        { id: 'edu1Major', label: 'Institution 1 – Major Field of Study', type: 'text', profilePath: 'educationHistory[0].major', placeholder: 'e.g., Business Administration' },

        // Institution 2
        { id: 'edu2Name', label: 'Institution 2 – Name & Location', type: 'text', profilePath: 'educationHistory[1].institution', placeholder: 'Second college or training program (if applicable)' },
        { id: 'edu2From', label: 'Institution 2 – Start Date', type: 'date', profilePath: 'educationHistory[1].date_from' },
        { id: 'edu2To', label: 'Institution 2 – End Date', type: 'date', profilePath: 'educationHistory[1].date_to' },
        { id: 'edu2Hours', label: 'Institution 2 – Credit Hours Completed', type: 'text', profilePath: 'educationHistory[1].hours_count', placeholder: 'e.g., 30 quarter hours' },
        { id: 'edu2Degree', label: 'Institution 2 – Degree or Certificate Earned', type: 'text', profilePath: 'educationHistory[1].degree' },
        { id: 'edu2Major', label: 'Institution 2 – Major Field of Study', type: 'text', profilePath: 'educationHistory[1].major' },
      ],
    },

    // ── STEP 11: Employment History ────────────────────────────────────────
    {
      id: 'employment',
      title: 'Employment History',
      description: 'Only complete this section if you held a professional license or journeyman rating in a licensed trade BEFORE or AFTER your military service (for example: licensed electrician, plumber, HVAC technician, RN, contractor, CDL driver). Leave blank if this does not apply to you.',
      fields: [
        {
          id: 'emp1Occupation',
          label: 'Licensed occupation BEFORE service',
          type: 'text',
          profilePath: 'employmentHistory[0].principal_occupation',
          helpText: 'Examples: Licensed Electrician, Plumber, Contractor, Registered Nurse, HVAC Technician',
          placeholder: 'e.g., Licensed Electrician',
        },
        { id: 'emp1Months', label: 'Months worked in that occupation before service', type: 'number' },
        {
          id: 'emp1License',
          label: 'License or Journeyman rating number (before service)',
          type: 'text',
          profilePath: 'employmentHistory[0].license_or_rating',
          placeholder: 'e.g., EL-12345, RN-67890',
        },
        {
          id: 'emp2Occupation',
          label: 'Licensed occupation AFTER service (if different)',
          type: 'text',
          helpText: 'Leave blank if same as before service or not applicable.',
          placeholder: 'e.g., Licensed Plumber',
        },
        { id: 'emp2Months', label: 'Months worked after service', type: 'number' },
        {
          id: 'emp2License',
          label: 'License or Journeyman rating number (after service)',
          type: 'text',
        },
      ],
    },

    // ── STEP 12: Additional Benefits & Contributions ───────────────────────
    {
      id: 'contributions',
      title: 'Contributions & Special Benefits',
      description: 'Answer these questions about additional MGIB contributions and special payments. These only apply if you are applying for Chapter 30 (MGIB-AD) or Chapter 1606. Skip if you selected Post-9/11 GI Bill (Chapter 33).',
      fields: [
        {
          id: 'mgibContributions',
          label: 'Did you contribute up to $600 in additional MGIB contributions while on active duty?',
          type: 'radio',
          helpText: 'These voluntary contributions ($20–$600) increase your Chapter 30 monthly benefit.',
          options: [
            { label: 'Yes – I made additional $600 contributions', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'activeDutyKicker',
          label: 'Do you have an Active Duty College Fund / Kicker from your enlistment contract?',
          type: 'radio',
          helpText: 'A "kicker" (also called College Fund) is extra money added to your GI Bill benefits as a recruiting incentive, written into your enlistment contract.',
          options: [
            { label: 'Yes – my enlistment contract includes an Active Duty Kicker', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'reserveKicker',
          label: 'Do you have a Reserve Kicker from your enlistment contract?',
          type: 'radio',
          helpText: 'Similar to the Active Duty Kicker, but for Selected Reserve (Chapter 1606) members.',
          options: [
            { label: 'Yes – my contract includes a Reserve Kicker', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'seniorROTC',
          label: 'Were you commissioned through a Senior ROTC scholarship program?',
          type: 'radio',
          helpText: 'Applies to officers who received a Senior ROTC scholarship during college and are now applying for VA education benefits.',
          options: [
            { label: 'Yes – I was commissioned via Senior ROTC scholarship', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'receivingMilitaryTuition',
          label: 'Is the Armed Forces paying for any part of the training/course you are applying for?',
          type: 'radio',
          helpText: 'Tuition Assistance (TA) from your branch of service counts as military tuition. If yes, VA will coordinate your benefits to avoid duplication.',
          options: [
            { label: 'Yes – my branch is covering some or all tuition (Tuition Assistance)', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
      ],
    },

    // ── STEP 13: Family & Dependents ──────────────────────────────────────
    {
      id: 'family',
      title: 'Family & Dependents',
      description: 'VA collects this information to determine if you may be eligible for additional benefits or dependency-based adjustments.',
      fields: [
        {
          id: 'married',
          label: 'Are you currently married?',
          type: 'radio',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'dependentChildren',
          label: 'Do you have any dependent children under age 18, or 18–22 and in school?',
          type: 'radio',
          helpText: 'A dependent child is one you financially support and who is under 18, or 18–22 and a full-time student.',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'dependentParent',
          label: 'Do you have a dependent parent (one who relies on you for financial support)?',
          type: 'radio',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
      ],
    },

    // ── STEP 14: Prior Benefits & Remarks ─────────────────────────────────
    {
      id: 'priorBenefits',
      title: 'Prior Benefits & Remarks',
      description: 'Disclose any VA or federal education benefits you have received in the past. This is required — VA will verify it. Also use the Remarks box to add any clarifications.',
      fields: [
        {
          id: 'previousFederalBenefits',
          label: 'Have you ever received benefits under any federal education or training program?',
          type: 'radio',
          helpText: 'This includes the GI Bill (any chapter), ROTC scholarships, DANTES, TA Top-Up, or any VA-sponsored vocational rehabilitation.',
          options: [
            { label: 'Yes – I have received federal education benefits before', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
        },
        {
          id: 'previousVABenefits',
          label: 'Have you previously applied for or received VA education benefits specifically?',
          type: 'radio',
          helpText: 'If you filed a VA education claim before — even if it was denied or you never used the benefit — select Yes.',
          options: [
            { label: 'Yes – I applied for or received VA education benefits before', value: 'Yes' },
            { label: 'No – this is my first VA education application', value: 'No' },
          ],
        },
        {
          id: 'previouslyApplied',
          label: 'Check this box if you have previously applied for or received the specific benefit you are applying for now',
          type: 'checkbox',
          helpText: 'Only check this if you previously received the exact chapter (e.g., Chapter 33) that you are applying for in this application.',
        },
        {
          id: 'remarks',
          label: 'Remarks (optional)',
          type: 'textarea',
          helpText: 'Use this space to explain anything unusual in your application. Examples: gap in service dates, name change, transfer from another chapter, concurrent enrollment at two schools, or anything else VA may need to know.',
          placeholder: 'e.g., I previously used Chapter 30 and am now transferring to Chapter 33. I changed my legal name in 2019 — documentation attached.',
        },
      ],
    },

    // ── STEP 15: Supporting Documents ─────────────────────────────────────
    {
      id: 'documents',
      title: 'Supporting Documents',
      description: 'Gather the following documents to submit with your application.',
      fields: [
        {
          id: 'documentsInfo',
          label: 'Required & Recommended Documents',
          type: 'document',
          helpText: `REQUIRED (attach to your application):
• DD Form 214 – Certificate of Release or Discharge from Active Duty (for ALL periods of service)
• Voided blank check or bank letter – for direct deposit setup

RECOMMENDED (speeds up processing):
• Notice of Basic Eligibility (NOBE) letter – for Chapter 1606 (Selected Reserve)
• Any ROTC scholarship contracts – if applicable
• Any conditional approval letters from VA – if you received one before

HELPFUL (submit if available):
• Official college transcripts – if you previously attended college
• Marriage certificate – if married
• Birth certificates of dependent children – if applicable
• Divorce decree – if applicable`
        },
      ],
    },

    // ── STEP 16: Certification & Signature ────────────────────────────────
    {
      id: 'signature',
      title: 'Certification & Signature',
      description: 'CERTIFICATION: I certify that all statements on this form are true and correct to the best of my knowledge and belief. WARNING: Title 38, United States Code, allows VA to request certain information to determine eligibility for benefits. Respondents are not required to respond unless it displays a valid OMB Control Number. Title 38 USC 1001 provides severe penalties for intentional misrepresentation.',
      fields: [
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
};
