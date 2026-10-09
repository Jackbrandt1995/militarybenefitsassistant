import type { FormDefinition, FormStepDef } from '../types';

/**
 * VA Form 28-1902w (NOV 2024) — Information for Veteran Readiness and
 * Employment Entitlement Determination (Rehabilitation Needs Inventory).
 *
 * Completed for the comprehensive initial evaluation: the Vocational
 * Rehabilitation Counselor (VRC) reviews it with the claimant to make the
 * Chapter 31 entitlement determination. The wizard mirrors ONLY what the
 * printed form asks; VRC-only items (VRC name boxes, Item 9's work-difficulty
 * review, Items 29-30) are not collected; see the mapping file for the
 * documented exclusions.
 *
 * Flow notes (beta feedback, Oct 2026):
 *   - The Section II resume radio drives the job steps: Items 4-8 show ONLY
 *     when the claimant did NOT provide a resume (step-level condition).
 *     Claimants who attach a resume describe job impacts in Item 28 instead,
 *     which mirrors the form's own Section II instruction.
 *   - The five job steps form the 'jobs' group with a "No more jobs to add"
 *     skip button, so nothing in them is required.
 *   - Item 9 (difficulties at work due to SCDs) is reviewed by the VRC at the
 *     evaluation, so it is no longer a wizard step.
 */

/**
 * Verbatim Privacy Act Information + Respondent Burden statement printed on
 * page 8 of the form. Exported so the VR&E package can show the same text
 * beside its own 28-1902w acknowledgment checkbox.
 */
export const VA_28_1902W_PRIVACY_ACT_TEXT =
  'PRIVACY ACT INFORMATION: The responses you submit are considered confidential (38 U.S.C. 5701). Your obligation to respond is required in order to obtain benefits. VA will not disclose information collected on this form to any source other than what has been authorized under the Privacy Act of 1974 or Title 38, Code of Federal Regulations 1.576 for routine uses (i.e., civil or criminal law enforcement, congressional communications, epidemiological or research studies, the collection of money owed to the United States, litigation in which the United States is a party or has an interest, the administration of VA programs and delivery of VA benefits, verification of identity and status, and personnel administration) as identified in the VA system of records, 58VA21/22/28, Compensation, Pension, Education, and Veteran Readiness and Employment Records - VA, published in the Federal Register. Information that you furnish may be utilized in computer matching programs with other Federal or State agencies for the purpose of determining your eligibility to receive VA benefits, as well as to collect any amount owed to the United States by virtue of your participation in any benefit program administered by the Department of Veterans Affairs.\n\n' +
  'RESPONDENT BURDEN: An agency may not conduct or sponsor, and a person is not required to respond to, a collection of information unless it displays a currently valid OMB control number. The OMB control number for this project is 2900-0092, and it expires November 30, 2027. Public reporting burden for this collection of information is estimated to average 45 minutes per respondent, per year, including the time for reviewing instructions, searching existing data sources, gathering and maintaining the data needed, and completing and reviewing the collection of information. Send comments regarding this burden estimate and any other aspect of this collection of information, including suggestions for reducing the burden, to VA Reports Clearance Officer at VACOPaperworkReduAct@va.gov. Please refer to OMB Control No. 2900-0092 in any correspondence. Do not send your completed VA Form 28-1902w to this email address.';

/** Exact /Opt value of the "did not provide resume" radio option (RadioButtonList[0]). */
const NO_RESUME_PROVIDED = 'CLAIMANT DID NOT PROVIDE RESUME (Please complete the section below)';

/**
 * Shared settings for the five job steps (Items 4-8): one skippable group,
 * shown only when the claimant did NOT attach a resume. See FormStepDef.
 */
const JOB_STEP_FLOW: Pick<FormStepDef, 'group' | 'groupSkipLabel' | 'condition'> = {
  group: 'jobs',
  groupSkipLabel: 'No more jobs to add',
  condition: { field: 'providedResume', value: NO_RESUME_PROVIDED },
};

export const va281902w: FormDefinition = {
  id: 'va-28-1902w',
  version: 2,
  formNumber: 'VA 28-1902w',
  title: 'Rehabilitation Needs Inventory for VR&E Entitlement Determination',
  description: 'Complete the Rehabilitation Needs Inventory (RNI) your Vocational Rehabilitation Counselor uses to determine your entitlement to VR&E (Chapter 31) services. Fill it out before your initial evaluation appointment.',
  pdfTemplate: '/forms/VA-28-1902w.pdf',
  category: 'application',
  steps: [
    {
      id: 'personal',
      title: 'Claimant Information',
      description: 'Your name and VA file number as they appear on your VA record. Your Vocational Rehabilitation Counselor (VRC) fills in their own name on the form.',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name', maxLength: 12 },
        { id: 'middleInitial', label: 'Middle Initial', type: 'text', profilePath: 'profile.middle_name', maxLength: 1 },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name', maxLength: 18 },
        { id: 'vaFileNumber', label: 'VA File Number', type: 'text', profilePath: 'profile.va_file_number', helpText: 'Only the last four digits print on this form. Leave blank if unknown.' },
      ],
    },
    {
      id: 'contactVerification',
      title: 'Confirm Your Contact Information (Section I)',
      description: 'Before your initial evaluation, VA needs to confirm that the address, email address, phone number, and marital status it has on file for you are current. Check each box below to confirm that item is up to date. If anything has changed or is different, update your contact information and/or marital status in your VA.gov profile before your appointment. Your Vocational Rehabilitation Counselor will confirm these with you at the evaluation.',
      fields: [
        { id: 'verifiedAddress', label: 'My mailing address on file with VA is current', type: 'checkbox', helpText: 'Checking this affirms that the address VA has for you is correct. If you have moved, update it in your VA.gov profile first.' },
        { id: 'verifiedEmail', label: 'My email address on file with VA is current', type: 'checkbox', helpText: 'Checking this affirms that VA has your correct email address. If it has changed, update it in your VA.gov profile first.' },
        { id: 'verifiedPhone', label: 'My phone number on file with VA is current', type: 'checkbox', helpText: 'Checking this affirms that VA has your correct phone number. If it has changed, update it in your VA.gov profile first.' },
        { id: 'verifiedMaritalStatus', label: 'My marital status on file with VA is current', type: 'checkbox', helpText: 'Checking this affirms that the marital status VA has for you is correct. If it has changed, update it in your VA.gov profile first.' },
      ],
    },
    {
      id: 'employmentStatus',
      title: 'Civilian Employment Status (Items 1-3)',
      description: 'Section II covers your civilian work history, including self-employment. If you attach your resume, you can skip the job sections (Items 4-8). Your counselor will still go over your work history with you at the evaluation.',
      fields: [
        {
          id: 'providedResume',
          label: 'Are you providing a copy of your resume with this form?',
          type: 'radio',
          required: true,
          helpText: 'If you attach your resume, you can skip the job sections (Items 4-8); upload it on the documents step near the end. Then use the Additional Comments step (Item 28) to describe anything your resume does not show: how your job duties affected or aggravated your disabilities, difficulties getting and keeping a job, salary, full-time or part-time status, and why you left each position.',
          options: [
            { label: 'Yes, I am providing my resume', value: 'CLAIMANT PROVIDED RESUME (Please complete fields not on resume)' },
            { label: 'No, I am not providing a resume', value: NO_RESUME_PROVIDED },
          ],
        },
        {
          id: 'currentlyEmployed',
          label: 'Are you currently employed, including self-employment? (Item 1)',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'YES (If "Yes," go to #4)' },
            { label: 'No', value: 'NO (If "No," go to #2)' },
          ],
        },
        {
          id: 'unemployedDuration',
          label: 'How long have you been unemployed? (Item 2)',
          type: 'text',
          placeholder: 'e.g., 8 months',
          condition: { field: 'currentlyEmployed', value: 'NO (If "No," go to #2)' },
        },
        {
          id: 'unemployedActivities',
          label: 'What did you do during your period of unemployment? (Item 3)',
          type: 'textarea',
          helpText: 'For example: job searching, school, caregiving, medical treatment, volunteering.',
          condition: { field: 'currentlyEmployed', value: 'NO (If "No," go to #2)' },
        },
      ],
    },
    {
      id: 'job1',
      ...JOB_STEP_FLOW,
      title: 'Job 1: Current or Most Recent (Item 4)',
      description: 'List your civilian jobs starting with your current or most recent job. Include self-employment. Fill in what you can; your counselor will go over the details with you at the evaluation. If you have no civilian jobs to list, use the "No more jobs to add" button to skip ahead.',
      fields: [
        { id: 'job1Title', label: 'Job Title', type: 'text', profilePath: 'employmentHistory[0].principal_occupation' },
        { id: 'job1Employer', label: 'Name of Employer', type: 'text', helpText: 'If self-employed, enter "Self-employed".' },
        { id: 'job1Dates', label: 'Dates of Employment', type: 'text', placeholder: 'e.g., 03/2019 - 06/2023' },
        {
          id: 'job1Schedule', label: 'Was this job full-time or part-time?', type: 'radio',
          options: [{ label: 'Full-time', value: 'FULL-TIME' }, { label: 'Part-time', value: 'PART-TIME' }],
        },
        { id: 'job1Salary', label: 'Average Gross Monthly Salary', type: 'text', placeholder: 'e.g., $3,200' },
        { id: 'job1Duties', label: 'Describe the job duties in detail', type: 'textarea' },
        { id: 'job1Aggravate', label: 'Do the job duties aggravate your service-connected disabilities? If "Yes," how?', type: 'textarea', helpText: 'Answer Yes or No. If yes, describe how.' },
        { id: 'job1ReasonLeft', label: 'What is your reason for leaving this employment?', type: 'textarea', helpText: 'For example: resigned, fired, hired for another job. Leave blank if you still work here.' },
      ],
    },
    {
      id: 'job2',
      ...JOB_STEP_FLOW,
      title: 'Job 2 (Item 5)',
      description: 'Your next most recent job. If you have no more jobs to list, use the "No more jobs to add" button to skip ahead.',
      fields: [
        { id: 'job2Title', label: 'Job Title', type: 'text', profilePath: 'employmentHistory[1].principal_occupation' },
        { id: 'job2Employer', label: 'Name of Employer', type: 'text' },
        { id: 'job2Dates', label: 'Dates of Employment', type: 'text', placeholder: 'e.g., 01/2016 - 02/2019' },
        {
          id: 'job2Schedule', label: 'Was this job full-time or part-time?', type: 'radio',
          options: [{ label: 'Full-time', value: 'FULL-TIME' }, { label: 'Part-time', value: 'PART-TIME' }],
        },
        { id: 'job2Salary', label: 'Average Gross Monthly Salary', type: 'text' },
        { id: 'job2Duties', label: 'Describe the job duties in detail', type: 'textarea' },
        { id: 'job2Aggravate', label: 'Do the job duties aggravate your service-connected disabilities? If "Yes," how?', type: 'textarea', helpText: 'Answer Yes or No. If yes, describe how.' },
        { id: 'job2ReasonLeft', label: 'What is your reason for leaving this employment?', type: 'textarea', helpText: 'For example: resigned, fired, hired for another job.' },
      ],
    },
    {
      id: 'job3',
      ...JOB_STEP_FLOW,
      title: 'Job 3 (Item 6)',
      description: 'Your next most recent job. If you have no more jobs to list, use the "No more jobs to add" button to skip ahead.',
      fields: [
        { id: 'job3Title', label: 'Job Title', type: 'text', profilePath: 'employmentHistory[2].principal_occupation' },
        { id: 'job3Employer', label: 'Name of Employer', type: 'text' },
        { id: 'job3Dates', label: 'Dates of Employment', type: 'text' },
        {
          id: 'job3Schedule', label: 'Was this job full-time or part-time?', type: 'radio',
          options: [{ label: 'Full-time', value: 'FULL-TIME' }, { label: 'Part-time', value: 'PART-TIME' }],
        },
        { id: 'job3Salary', label: 'Average Gross Monthly Salary', type: 'text' },
        { id: 'job3Duties', label: 'Describe the job duties in detail', type: 'textarea' },
        { id: 'job3Aggravate', label: 'Do the job duties aggravate your service-connected disabilities? If "Yes," how?', type: 'textarea', helpText: 'Answer Yes or No. If yes, describe how.' },
        { id: 'job3ReasonLeft', label: 'What is your reason for leaving this employment?', type: 'textarea', helpText: 'For example: resigned, fired, hired for another job.' },
      ],
    },
    {
      id: 'job4',
      ...JOB_STEP_FLOW,
      title: 'Job 4 (Item 7)',
      description: 'Your next most recent job. If you have no more jobs to list, use the "No more jobs to add" button to skip ahead.',
      fields: [
        { id: 'job4Title', label: 'Job Title', type: 'text', profilePath: 'employmentHistory[3].principal_occupation' },
        { id: 'job4Employer', label: 'Name of Employer', type: 'text' },
        { id: 'job4Dates', label: 'Dates of Employment', type: 'text' },
        {
          id: 'job4Schedule', label: 'Was this job full-time or part-time?', type: 'radio',
          options: [{ label: 'Full-time', value: 'FULL-TIME' }, { label: 'Part-time', value: 'PART-TIME' }],
        },
        { id: 'job4Salary', label: 'Average Gross Monthly Salary', type: 'text' },
        { id: 'job4Duties', label: 'Describe the job duties in detail', type: 'textarea' },
        { id: 'job4Aggravate', label: 'Do the job duties aggravate your service-connected disabilities? If "Yes," how?', type: 'textarea', helpText: 'Answer Yes or No. If yes, describe how.' },
        { id: 'job4ReasonLeft', label: 'What is your reason for leaving this employment?', type: 'textarea', helpText: 'For example: resigned, fired, hired for another job.' },
      ],
    },
    {
      id: 'job5',
      ...JOB_STEP_FLOW,
      title: 'Job 5 (Item 8)',
      description: 'Your next most recent job. This is the last job the form has room for. If you have no more jobs to list, use the "No more jobs to add" button to skip ahead.',
      fields: [
        { id: 'job5Title', label: 'Job Title', type: 'text', profilePath: 'employmentHistory[4].principal_occupation' },
        { id: 'job5Employer', label: 'Name of Employer', type: 'text' },
        { id: 'job5Dates', label: 'Dates of Employment', type: 'text' },
        {
          id: 'job5Schedule', label: 'Was this job full-time or part-time?', type: 'radio',
          options: [{ label: 'Full-time', value: 'FULL-TIME' }, { label: 'Part-time', value: 'PART-TIME' }],
        },
        { id: 'job5Salary', label: 'Average Gross Monthly Salary', type: 'text' },
        { id: 'job5Duties', label: 'Describe the job duties in detail', type: 'textarea' },
        { id: 'job5Aggravate', label: 'Do the job duties aggravate your service-connected disabilities? If "Yes," how?', type: 'textarea', helpText: 'Answer Yes or No. If yes, describe how.' },
        { id: 'job5ReasonLeft', label: 'What is your reason for leaving this employment?', type: 'textarea', helpText: 'For example: resigned, fired, hired for another job.' },
      ],
    },
    // Item 9 (difficulties at work due to SCDs) is intentionally NOT a wizard
    // step: the form frames it as the VRC's review at the initial evaluation.
    {
      id: 'militaryHistory',
      title: 'Military Employment History (Items 10-13)',
      description: 'Section III reviews your military employment history. If you provide your DD-214 or military records, you only need to fill in information that is not on them.',
      fields: [
        {
          id: 'providedDd214',
          label: 'Are you providing your DD-214 or military records?',
          type: 'radio',
          options: [
            { label: 'Yes, I am providing my DD-214 or military records', value: 'CLAIMANT PROVIDED DD-214 OR MILITARY RECORDS (Please complete only fields not on DD-214 or military records)' },
            { label: 'No, I am not providing my DD-214 or military records', value: 'CLAIMANT DID NOT PROVIDE DD-214 OR MILITARY RECORDS (Please complete section below)' },
          ],
        },
        { id: 'enlistmentHistory', label: 'List your military enlistment history (Item 10)', type: 'textarea', helpText: 'List each enlistment or period of service.' },
        { id: 'militaryOccupation', label: 'Job title or Military Occupational Specialty (MOS) (Item 11)', type: 'text', placeholder: 'e.g., 88M Motor Transport Operator' },
        {
          id: 'service1Branch',
          label: 'Name of branch of service - first period (Item 12A)',
          type: 'radio',
          helpText: 'Select "Selected Service" if you are a member or former member of the Selected Reserve (Army, Air Force, Coast Guard, Marine Corps, or Naval Reserve, Air National Guard, or Army National Guard) who served at least one enlistment (or, for an officer, the period of initial obligation) or was discharged for a disability incurred or aggravated in line of duty.',
          options: [
            { label: 'Army', value: 'ARMY' },
            { label: 'Navy', value: 'NAVY' },
            { label: 'Air Force', value: 'AIR FORCE' },
            { label: 'Marine Corps', value: 'MARINE CORPS' },
            { label: 'Coast Guard', value: 'COAST GUARD' },
            { label: 'Space Force', value: 'SPACE FORCE' },
            { label: 'USPHS (U.S. Public Health Service)', value: 'USPHS' },
            { label: 'NOAA', value: 'NOAA' },
            { label: 'Selected Service (Selected Reserve / National Guard)', value: 'YES' },
            { label: 'Other', value: 'OTHER (Specify)' },
          ],
        },
        { id: 'service1BranchOther', label: 'Other branch - please specify', type: 'text', maxLength: 30, condition: { field: 'service1Branch', value: 'OTHER (Specify)' } },
        { id: 'service1Entered', label: 'First period - date entered service (Item 12B)', type: 'date', profilePath: 'servicePeriods[0].date_entered' },
        { id: 'service1Separated', label: 'First period - date separated (Item 12B)', type: 'date', profilePath: 'servicePeriods[0].date_separated', helpText: 'Leave blank if still serving.' },
        { id: 'service1Rank', label: 'Rank (Item 12C)', type: 'text', placeholder: 'e.g., E-5' },
        {
          id: 'service2Branch',
          label: 'Name of branch of service - second period (Item 13A)',
          type: 'radio',
          helpText: 'Only answer if you served more than one term of service and/or in more than one branch of service.',
          options: [
            { label: 'Army', value: 'ARMY' },
            { label: 'Navy', value: 'NAVY' },
            { label: 'Air Force', value: 'AIR FORCE' },
            { label: 'Marine Corps', value: 'MARINE CORPS' },
            { label: 'Coast Guard', value: 'COAST GUARD' },
            { label: 'Space Force', value: 'SPACE FORCE' },
            { label: 'USPHS (U.S. Public Health Service)', value: 'USPHS' },
            { label: 'NOAA', value: 'NOAA' },
            { label: 'Selected Service (Selected Reserve / National Guard)', value: 'YES' },
            { label: 'Other', value: 'OTHER (Specify)' },
          ],
        },
        { id: 'service2BranchOther', label: 'Other branch - please specify', type: 'text', maxLength: 30, condition: { field: 'service2Branch', value: 'OTHER (Specify)' } },
        { id: 'service2Entered', label: 'Second period - date entered service (Item 13B)', type: 'date', profilePath: 'servicePeriods[1].date_entered' },
        { id: 'service2Separated', label: 'Second period - date separated (Item 13B)', type: 'date', profilePath: 'servicePeriods[1].date_separated' },
        { id: 'service2Rank', label: 'Rank (Item 13C)', type: 'text' },
      ],
    },
    {
      id: 'legalHistory',
      title: 'Legal History (Item 14)',
      description: 'Section IV: if you have a history of, or are currently dealing with, legal issues, check each item that applies and describe it below. If none apply, check "Not applicable."',
      fields: [
        { id: 'legalBankruptcy', label: 'Bankruptcy (in the last seven years)', type: 'checkbox' },
        { id: 'legalBankruptcyDesc', label: 'Describe the bankruptcy', type: 'textarea', condition: { field: 'legalBankruptcy', value: true } },
        { id: 'legalMisdemeanor', label: 'Misdemeanor', type: 'checkbox' },
        { id: 'legalMisdemeanorDesc', label: 'Describe the misdemeanor', type: 'textarea', condition: { field: 'legalMisdemeanor', value: true } },
        { id: 'legalFelony', label: 'Felony', type: 'checkbox' },
        { id: 'legalFelonyDesc', label: 'Describe the felony', type: 'textarea', condition: { field: 'legalFelony', value: true } },
        { id: 'legalProbation', label: 'Probation', type: 'checkbox' },
        { id: 'legalProbationDesc', label: 'Describe the probation', type: 'textarea', condition: { field: 'legalProbation', value: true } },
        { id: 'legalParole', label: 'Parole', type: 'checkbox' },
        { id: 'legalParoleDesc', label: 'Describe the parole', type: 'textarea', condition: { field: 'legalParole', value: true } },
        { id: 'legalOther', label: 'Other legal issues', type: 'checkbox' },
        { id: 'legalOtherDesc', label: 'Describe the other legal issues', type: 'textarea', condition: { field: 'legalOther', value: true } },
        { id: 'legalNotApplicable', label: 'Not applicable', type: 'checkbox' },
      ],
    },
    {
      id: 'substanceHistory',
      title: 'Substance Abuse History (Item 15)',
      description: 'Section V: if you have a history of, or are currently dealing with, substance abuse issues, check each item that applies and describe it below. If none apply, check "Not applicable."',
      fields: [
        { id: 'substanceAlcohol', label: 'Alcohol', type: 'checkbox' },
        { id: 'substanceAlcoholDesc', label: 'Describe the alcohol issue', type: 'textarea', condition: { field: 'substanceAlcohol', value: true } },
        { id: 'substanceIllegalDrugs', label: 'Illegal drugs', type: 'checkbox' },
        { id: 'substanceIllegalDrugsDesc', label: 'Describe the illegal drug issue', type: 'textarea', condition: { field: 'substanceIllegalDrugs', value: true } },
        { id: 'substancePrescriptionDrugs', label: 'Prescription drugs', type: 'checkbox' },
        { id: 'substancePrescriptionDrugsDesc', label: 'Describe the prescription drug issue', type: 'textarea', condition: { field: 'substancePrescriptionDrugs', value: true } },
        { id: 'substanceOther', label: 'Other substances', type: 'checkbox' },
        { id: 'substanceOtherDesc', label: 'Describe the other substance issue', type: 'textarea', condition: { field: 'substanceOther', value: true } },
        { id: 'substanceNotApplicable', label: 'Not applicable', type: 'checkbox' },
        { id: 'substanceTreatment', label: 'If you have received, or are currently receiving, ongoing treatment for substance abuse, describe your treatment progress, including dates and locations', type: 'textarea' },
      ],
    },
    {
      id: 'educationTraining',
      title: 'Education and Training History (Items 16-18)',
      description: 'Section VI reviews your education and training history. If you provide academic or training transcripts, certifications, and/or licenses, you do not need to complete every field in this section.',
      fields: [
        {
          id: 'providedTranscripts',
          label: 'Are you providing transcripts, certifications, and/or licenses?',
          type: 'radio',
          options: [
            { label: 'Yes, I am providing transcripts, certifications, and/or licenses', value: 'CLAIMANT PROVIDED TRANSCRIPTS, CERTIFICATIONS, AND/OR LICENSES (Do not need to complete all fields in this section.)' },
            { label: 'No, I am not providing them', value: 'CLAIMANT DID NOT PROVIDE TRANSCRIPTS/CERTIFICATIONS, AND/OR LICENSES (Please complete section below)' },
          ],
        },
        {
          id: 'highestEducation',
          label: 'What is the highest level of education you have completed? (Item 16)',
          type: 'radio',
          options: [
            { label: 'Some high school', value: 'SOME HIGH SCHOOL' },
            { label: 'High school', value: 'HIGH SCHOOL' },
            { label: 'GED certificate', value: 'GENERAL EDUCATIONAL DEVELOPMENT (GED) CERTIFICATE' },
            { label: "Associate's degree", value: "ASSOCIATE'S DEGREE" },
            { label: "Bachelor's degree", value: "BACHELOR'S DEGREE" },
            { label: "Master's degree", value: "MASTER'S DEGREE" },
            { label: 'Postgraduate degree', value: 'POSTGRADUATE DEGREE' },
          ],
        },
        { id: 'fieldOfStudy', label: 'If you have education beyond high school, what was your field of study (degree major)? (Item 17)', type: 'textarea', profilePath: 'educationHistory[0].major' },
        { id: 'certificationsLicenses', label: 'If you have certifications or licenses, please list them (Item 18)', type: 'textarea', helpText: "For example: apprenticeship, journeyman license, Commercial Driver's License (CDL).", profilePath: 'employmentHistory[0].license_or_rating' },
      ],
    },
    {
      id: 'disabilities',
      title: 'Your Disabilities and Treatment (Items 19-23)',
      description: 'Section VII reviews your service-connected and non-service-connected disabilities and how they impact your ability to obtain and maintain employment.',
      fields: [
        { id: 'scdList', label: 'List your service-connected disabilities and impairments (Item 19)', type: 'textarea', helpText: 'Your service-connected disabilities are listed on your VA rating decision letter.' },
        {
          id: 'iuTdiu',
          label: 'Have you filed a claim for, or are you receiving, Individual Unemployability (IU) or Total Disability based on Individual Unemployability (TDIU)? If yes, describe in detail your service-connected disabilities, feasibility, and potential independent living needs. (Item 20)',
          type: 'textarea',
          aiAssist: true,
          helpText: 'Answer Yes or No. If yes, describe in detail your service-connected disabilities, feasibility, and potential independent living needs: which disabilities are involved, whether you believe working is feasible for you right now, and any support you may need to live independently. Rough notes are fine; you can use the help button to organize them in your own words.',
        },
        { id: 'driversLicense', label: "Do you have a valid driver's license? (Item 21)", type: 'textarea', helpText: "Answer Yes or No. If no, please explain the reason for not having a valid driver's license." },
        { id: 'treatmentFacilities', label: 'Name of the medical treatment facilities you are attending (Item 22)', type: 'textarea' },
        { id: 'treatmentFrequency', label: 'How often are you seen for treatment? (Item 23)', type: 'textarea' },
      ],
    },
    {
      id: 'miscellaneous',
      title: 'Referrals and Other Benefits (Items 24-27)',
      description: 'Section VIII: this information is not part of the entitlement determination, but it helps your counselor with referrals, resources, and addressing your needs.',
      fields: [
        {
          id: 'vaMedicalCenter', label: 'Are you registered with a local VA medical center? (Item 24)', type: 'radio',
          options: [{ label: 'Yes', value: 'YES' }, { label: 'No', value: 'NO' }],
        },
        {
          id: 'myHealtheVet', label: 'Are you registered with My HealtheVet? (Item 25)', type: 'radio',
          options: [{ label: 'Yes', value: 'YES' }, { label: 'No', value: 'NO' }],
        },
        {
          id: 'homelessReferral', label: 'Do you require a referral for HUD-VASH or a homeless program? (Item 26)', type: 'radio',
          options: [{ label: 'Yes', value: 'YES' }, { label: 'No', value: 'NO' }],
        },
        { id: 'benefitDisabilityPension', label: 'I am receiving or have applied for: Disability pension (not disability compensation) (Item 27)', type: 'checkbox' },
        {
          id: 'benefitDisabilityPensionType', label: 'Is the disability pension civilian or military?', type: 'radio',
          condition: { field: 'benefitDisabilityPension', value: true },
          options: [{ label: 'Civilian', value: 'CIVILIAN' }, { label: 'Military', value: 'MILITARY )' }],
        },
        { id: 'benefitRetirement', label: 'I am receiving or have applied for: Retirement (Item 27)', type: 'checkbox' },
        {
          id: 'benefitRetirementType', label: 'Is the retirement civilian or military?', type: 'radio',
          condition: { field: 'benefitRetirement', value: true },
          options: [{ label: 'Civilian', value: 'CIVILIAN' }, { label: 'Military', value: 'MILITARY )' }],
        },
        { id: 'benefitMedicare', label: 'I am receiving or have applied for: Medicare / Medicaid (Item 27)', type: 'checkbox' },
        { id: 'benefitSsdi', label: 'I am receiving or have applied for: Social Security Disability Income (SSDI or SSI) (Item 27)', type: 'checkbox' },
        { id: 'benefitWorkersComp', label: 'I am receiving or have applied for: Workers compensation (Item 27)', type: 'checkbox' },
        { id: 'benefitVocRehab', label: 'I am receiving or have applied for: A program of vocational rehabilitation (Item 27)', type: 'checkbox' },
        { id: 'benefitOther', label: 'I am receiving or have applied for: Other benefits (Item 27)', type: 'checkbox' },
        { id: 'benefitOtherDesc', label: 'Other benefits - please describe', type: 'text', condition: { field: 'benefitOther', value: true } },
      ],
    },
    {
      id: 'comments',
      title: 'Additional Comments (Item 28)',
      description: 'Section IX: other relevant information or additional comments that are relevant to the entitlement determination.',
      fields: [
        {
          id: 'additionalComments',
          label: 'Other relevant information or additional comments',
          type: 'textarea',
          helpText: 'If you provided a resume instead of filling in the job sections, describe here: how your job duties affected or aggravated your service-connected disabilities, any difficulties obtaining and maintaining employment, your salary, whether each job was full-time or part-time, and why you left each position. Anything else relevant to your entitlement determination also goes here.',
        },
      ],
    },
    {
      id: 'optionalDocs',
      title: 'Helpful Documents to Provide',
      description: 'The form works best when your counselor can see these documents. Each one you provide means fewer items to fill in by hand.',
      optionalAttachments: [
        { label: 'Resume', condition: 'If you answered that you are providing your resume', helpText: 'Upload it here. With a resume attached you can skip the job sections (Items 4-8); describe anything the resume does not show on the Additional Comments step (Item 28).' },
        { label: 'DD-214 or other military records', condition: 'If not already on file with VA', helpText: 'If provided, you only need to fill in military history details that are not on them (Items 10-13).' },
        { label: 'Academic transcripts, certifications, and/or licenses', helpText: 'If provided, you do not need to complete every education field (Items 16-18).' },
      ],
      fields: [],
    },
    {
      id: 'certification',
      title: 'Privacy Act Notice & Acknowledgment',
      description: `${VA_28_1902W_PRIVACY_ACT_TEXT}\n\nNOTE: This form has no claimant signature block. Your Vocational Rehabilitation Counselor completes Items 29 and 30 (counselor name and date) during your initial evaluation.`,
      fields: [
        {
          id: 'privacyAct',
          label: 'I have read and understand the Privacy Act Information and Respondent Burden statement above for VA Form 28-1902w.',
          type: 'checkbox',
          required: true,
          helpText: 'You must check this box to confirm that you have read the notice above before generating your form. The printed form has no acknowledgment box, so this checkmark stays with your submission record.',
        },
      ],
    },
  ],
  computeAnswers: (answers) => {
    // Item 12B/13B print a single "DATES OF SERVICE" line; derive it from the
    // two date inputs (service1Entered/service1Separated, service2Entered/
    // service2Separated) so profile autofill of service periods still works.
    const fmt = (v: string | boolean | undefined) => {
      const parts = String(v || '').split('-');
      return parts.length === 3 ? `${parts[1]}/${parts[2]}/${parts[0]}` : '';
    };
    const range = (from: string | boolean | undefined, to: string | boolean | undefined) => {
      const f = fmt(from);
      const t = fmt(to);
      if (f && t) return `${f} - ${t}`;
      return f || t;
    };
    return {
      ...answers,
      service1Dates: range(answers.service1Entered, answers.service1Separated),
      service2Dates: range(answers.service2Entered, answers.service2Separated),
    };
  },
  nextSteps: 'Bring this completed form to your VR&E initial evaluation appointment, along with your resume, DD-214 or military records, and any transcripts, certifications, or licenses. Your Vocational Rehabilitation Counselor (VRC) will review it with you to make the entitlement determination.',
};
