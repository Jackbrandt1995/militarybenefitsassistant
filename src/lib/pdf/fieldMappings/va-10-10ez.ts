/**
 * VA 10-10EZ (FEB 2025) — Application for Health Benefits
 *
 * PDF template: /public/forms/VA-10-10EZ.pdf
 *
 * XFA PDF — pdf-lib strips XFA on load, leaving the AcroForm layer. Radios and
 * checkboxes are written with the 'draw-check' approach (filled square at the
 * widget's exact coordinates); text fields by their qualified F[0].PX[0] name.
 *
 * Physical page indices (0-based): p=0–2 instructions; p=3 Section I + II (P4);
 * p=4 Section II cont. + III + IV (P5); p=5 Section V–IX (P6).
 *
 * Verified against the printed form text + field geometry (extract-fields.mjs).
 *
 * Combined fields built by computeAnswers() in the form definition:
 *   fullName       ← "Last, First Middle"   (Item 1A — "Last, First, Middle Name")
 *   ssnFormatted   ← "XXX-XX-XXXX"          (veteran SSN fields have no maxLength)
 *   placeOfBirth   ← "City, State"          (Item 6B)
 *   spouseFullName ← "Last, First Middle"   (Section IV Item 1 — same name order)
 *
 * maxLength landmines (writing too many chars throws and silently blanks):
 *   SPOUSESSN[0]              = 9  → spouse SSN MUST be 9 digits, no dashes
 *   MailingAddress_State[0]   = 2  → 2-letter state code (wizard already supplies)
 */

import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

const onlyDigits9 = (v: string) => v.replace(/\D/g, '').slice(0, 9);
const yes = (v: string) => (v === 'Yes' ? 'true' : '');
const no  = (v: string) => (v === 'No'  ? 'true' : '');
const checked = (v: string | boolean) => (v === 'true' || v === true ? 'true' : '');

export const va1010ezMapping: FieldMapping = {

  // ── Type of benefit (Section I header) — checkboxes p=3 cy=624/612 ────────
  benefitType: [
    { pdfFieldName: 'F[0].P4[0].TypeOfBenefitsApplyingFor[0]', type: 'draw-check', checkPage: 3, checkCX: 37.3, checkCY: 624.0, transform: (v) => v === 'Enrollment'   ? 'true' : '' },
    { pdfFieldName: 'F[0].P4[0].TypeOfBenefitsApplyingFor[1]', type: 'draw-check', checkPage: 3, checkCX: 37.3, checkCY: 612.0, transform: (v) => v === 'Registration' ? 'true' : '' },
  ],

  // ── Item 1A — Name (Last, First, Middle). Repeated on P5/P6 continuation. ─
  fullName: [
    { pdfFieldName: 'F[0].P4[0].LastFirstMiddle[0]', type: 'text' },
    { pdfFieldName: 'F[0].P5[0].LastFirstMiddle[0]', type: 'text' },
    { pdfFieldName: 'F[0].P6[0].LastFirstMiddle[0]', type: 'text' },
  ],
  firstName: [], middleName: [], lastName: [], suffix: [],

  // ── Item 2 — Mother's maiden name ────────────────────────────────────────
  mothersMaidenName: { pdfFieldName: 'F[0].P4[0].MothersMaidenName[0]', type: 'text' },

  // ── Item 3 — Sex. FEMALE is the TOP widget (cy=558); MALE is below (cy=546). ─
  sex: [
    { pdfFieldName: 'F[0].P4[0].BirthSex[0]', type: 'draw-check', checkPage: 3, checkCX: 37.3, checkCY: 558.0, transform: (v) => v === 'Female' ? 'true' : '' },
    { pdfFieldName: 'F[0].P4[0].BirthSex[0]', type: 'draw-check', checkPage: 3, checkCX: 37.3, checkCY: 546.0, transform: (v) => v === 'Male'   ? 'true' : '' },
  ],

  // ── Item 5 — SSN (no maxLength here; dashed is fine). Repeated P5/P6. ─────
  ssnFormatted: [
    { pdfFieldName: 'F[0].P4[0].SSN[0]', type: 'text' },
    { pdfFieldName: 'F[0].P5[0].SSN[0]', type: 'text' },
    { pdfFieldName: 'F[0].P6[0].SSN[0]', type: 'text' },
  ],
  ssn: [],

  // ── Item 6 — DOB + Place of birth ────────────────────────────────────────
  dob:          { pdfFieldName: 'F[0].P4[0].DOB[0]',          type: 'text', transform: formatDateString },
  placeOfBirth: { pdfFieldName: 'F[0].P4[0].PlaceOfBirth[0]', type: 'text' },
  birthCity: [], birthStateOrCountry: [],

  // ── Item 9 — Mailing address + contact ───────────────────────────────────
  street: { pdfFieldName: 'F[0].P4[0].MailingAddress_Street[0]',  type: 'text' },
  apt:    [],
  city:   { pdfFieldName: 'F[0].P4[0].MailingAddress_City[0]',    type: 'text' },
  state:  { pdfFieldName: 'F[0].P4[0].MailingAddress_State[0]',   type: 'text' },
  zip:    { pdfFieldName: 'F[0].P4[0].MailingAddress_ZipCode[0]', type: 'text' },
  addressType: [],   // no permanent/temporary control on this form revision
  phoneHome:   { pdfFieldName: 'F[0].P4[0].HOMEPhone[0]',    type: 'text' },
  phoneMobile: { pdfFieldName: 'F[0].P4[0].MOBILEPhone[0]',  type: 'text' },
  email:       { pdfFieldName: 'F[0].P4[0].EmailAddress[0]', type: 'text' },

  // ── Item 11 — Marital status. Form order: Married / Never Married /
  //     Separated / Widowed / Divorced (cx 37.3 / 97.3 / 187.3 / 259.3 / 325.3, cy=396)
  maritalStatus: [
    { pdfFieldName: 'F[0].P4[0].CurrentMaritalStatus[0]', type: 'draw-check', checkPage: 3, checkCX: 37.3,  checkCY: 396.0, transform: (v) => v === 'Married'   ? 'true' : '' },
    { pdfFieldName: 'F[0].P4[0].CurrentMaritalStatus[0]', type: 'draw-check', checkPage: 3, checkCX: 97.3,  checkCY: 396.0, transform: (v) => v === 'Single'    ? 'true' : '' },
    { pdfFieldName: 'F[0].P4[0].CurrentMaritalStatus[0]', type: 'draw-check', checkPage: 3, checkCX: 187.3, checkCY: 396.0, transform: (v) => v === 'Separated' ? 'true' : '' },
    { pdfFieldName: 'F[0].P4[0].CurrentMaritalStatus[0]', type: 'draw-check', checkPage: 3, checkCX: 259.3, checkCY: 396.0, transform: (v) => v === 'Widowed'   ? 'true' : '' },
    { pdfFieldName: 'F[0].P4[0].CurrentMaritalStatus[0]', type: 'draw-check', checkPage: 3, checkCX: 325.3, checkCY: 396.0, transform: (v) => v === 'Divorced'  ? 'true' : '' },
  ],

  // ── Item 16 — Would you like VA to contact you to schedule first appt? ────
  scheduleFirstAppointment: [
    { pdfFieldName: 'F[0].P4[0].ScheduleFirstAppointment[0]', type: 'draw-check', checkPage: 3, checkCX: 319.3, checkCY: 234.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].ScheduleFirstAppointment[0]', type: 'draw-check', checkPage: 3, checkCX: 361.3, checkCY: 234.0, transform: no  },
  ],

  // ── Section II Item 1 — Most recent service ──────────────────────────────
  serviceBranch:          { pdfFieldName: 'F[0].P4[0].LastBranchOfService[0]',  type: 'text' },
  serviceEntryDate:       { pdfFieldName: 'F[0].P4[0].LASTENTRYDATE[0]',        type: 'text', transform: formatDateString },
  expectedSeparationDate: { pdfFieldName: 'F[0].P4[0].FUTUREDISCHARGEDATE[0]',  type: 'text', transform: formatDateString },
  serviceSeparationDate:  { pdfFieldName: 'F[0].P4[0].LASTDISCHARGEDATE[0]',    type: 'text', transform: formatDateString },
  dischargeType:          { pdfFieldName: 'F[0].P4[0].DischargeType[0]',        type: 'text' },
  militaryServiceNumber:  { pdfFieldName: 'F[0].P4[0].MilitaryServiceNumber[0]', type: 'text' },
  currentlyActiveDuty: [],   // no Yes/No widget on this form (implied by future discharge date)

  // ── Section II Item 2 — Military history (Yes/No). p=3.
  //     Left col  YES cx=282.5 / NO cx=306.5;  Right col YES cx=552.5 / NO cx=576.5
  //     2A Purple Heart (cy=120 L) | 2B Former POW (cy=96 L) | 2C Combat theater (cy=72 L)
  //     2D Discharged for disability (cy=120 R) | 2E SW Asia (cy=96 R) | 2F SC rating (cy=72 R)
  purpleHeart: [
    { pdfFieldName: 'F[0].P4[0].Section2_2A[0]', type: 'draw-check', checkPage: 3, checkCX: 282.5, checkCY: 120.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section2_2A[0]', type: 'draw-check', checkPage: 3, checkCX: 306.5, checkCY: 120.0, transform: no  },
  ],
  formerPOW: [
    { pdfFieldName: 'F[0].P4[0].Section2_2B[0]', type: 'draw-check', checkPage: 3, checkCX: 282.5, checkCY: 96.1, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section2_2B[0]', type: 'draw-check', checkPage: 3, checkCX: 306.5, checkCY: 96.1, transform: no  },
  ],
  combatTheaterPost911: [
    { pdfFieldName: 'F[0].P4[0].Section2_2C[0]', type: 'draw-check', checkPage: 3, checkCX: 282.5, checkCY: 72.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section2_2C[0]', type: 'draw-check', checkPage: 3, checkCX: 306.5, checkCY: 72.0, transform: no  },
  ],
  dischargedForDisability: [
    { pdfFieldName: 'F[0].P4[0].Section2_2D[0]', type: 'draw-check', checkPage: 3, checkCX: 552.5, checkCY: 120.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section2_2D[0]', type: 'draw-check', checkPage: 3, checkCX: 576.5, checkCY: 120.0, transform: no  },
  ],
  swAsiaGulfWar: [
    { pdfFieldName: 'F[0].P4[0].Section2_2E[0]', type: 'draw-check', checkPage: 3, checkCX: 552.5, checkCY: 96.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section2_2E[0]', type: 'draw-check', checkPage: 3, checkCX: 576.5, checkCY: 96.0, transform: no  },
  ],
  serviceConnectedRating: [
    { pdfFieldName: 'F[0].P4[0].Section2_2F[0]', type: 'draw-check', checkPage: 3, checkCX: 552.5, checkCY: 72.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section2_2F[0]', type: 'draw-check', checkPage: 3, checkCX: 576.5, checkCY: 72.0, transform: no  },
  ],

  // ── Section II Item 3 — Military exposure (p=4). Yes/No radios:
  //     3A Radiation  RadioButtonList[0] (YES cx=252.5 / NO cx=276.5, cy=674.9)
  //     3B Gulf War   RadioButtonList[1] (cy=579)  + dates DateFrom1/DateTo1 (cy=534)
  //     3C Operations RadioButtonList[2] (cy=474)
  //     3D Herbicide  RadioButtonList[3] (right: YES cx=552.5 / NO cx=576.5, cy=648) + DateFrom2/DateTo2
  radiationActivity: [
    { pdfFieldName: 'F[0].P5[0].RadioButtonList[0]', type: 'draw-check', checkPage: 4, checkCX: 252.5, checkCY: 674.9, transform: yes },
    { pdfFieldName: 'F[0].P5[0].RadioButtonList[0]', type: 'draw-check', checkPage: 4, checkCX: 276.5, checkCY: 674.9, transform: no  },
  ],
  gulfWarHazard: [
    { pdfFieldName: 'F[0].P5[0].RadioButtonList[1]', type: 'draw-check', checkPage: 4, checkCX: 252.5, checkCY: 579.0, transform: yes },
    { pdfFieldName: 'F[0].P5[0].RadioButtonList[1]', type: 'draw-check', checkPage: 4, checkCX: 276.5, checkCY: 579.0, transform: no  },
  ],
  gulfWarFrom: { pdfFieldName: 'F[0].P5[0].DateFrom1[0]', type: 'text' },
  gulfWarTo:   { pdfFieldName: 'F[0].P5[0].DateTo1[0]',   type: 'text' },
  combatOperations: [
    { pdfFieldName: 'F[0].P5[0].RadioButtonList[2]', type: 'draw-check', checkPage: 4, checkCX: 252.5, checkCY: 474.0, transform: yes },
    { pdfFieldName: 'F[0].P5[0].RadioButtonList[2]', type: 'draw-check', checkPage: 4, checkCX: 276.5, checkCY: 474.0, transform: no  },
  ],
  agentOrangeService: [
    { pdfFieldName: 'F[0].P5[0].RadioButtonList[3]', type: 'draw-check', checkPage: 4, checkCX: 552.5, checkCY: 648.0, transform: yes },
    { pdfFieldName: 'F[0].P5[0].RadioButtonList[3]', type: 'draw-check', checkPage: 4, checkCX: 576.5, checkCY: 648.0, transform: no  },
  ],
  agentOrangeFrom: { pdfFieldName: 'F[0].P5[0].DateFrom2[0]', type: 'text' },
  agentOrangeTo:   { pdfFieldName: 'F[0].P5[0].DateTo2[0]',   type: 'text' },

  // ── Section II Item 3E — "Exposed to any of the following" (check all). p=4 ─
  //   [0] Air pollutants cy=546 | [1] Chemicals 534 | [2] Camp Lejeune 522
  //   [3] Radiation 510 (L) | [4] SHAD 510 (R cx=371) | [5] Occupational 498
  //   [6] Asbestos 486 (L) | [7] Mustard gas 486 (R cx=371) | [8] Warfare 474 | [9] Other 462
  expAirPollutants:   [{ pdfFieldName: 'F[0].P5[0].ExposedToTheFollowing[0]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 546.0, transform: checked }],
  expChemicals:       [{ pdfFieldName: 'F[0].P5[0].ExposedToTheFollowing[1]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 534.0, transform: checked }],
  expCampLejeune:     [{ pdfFieldName: 'F[0].P5[0].ExposedToTheFollowing[2]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 522.0, transform: checked }],
  expRadiation:       [{ pdfFieldName: 'F[0].P5[0].ExposedToTheFollowing[3]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 510.0, transform: checked }],
  expShad:            [{ pdfFieldName: 'F[0].P5[0].ExposedToTheFollowing[4]', type: 'draw-check', checkPage: 4, checkCX: 371.0, checkCY: 510.0, transform: checked }],
  expOccupational:    [{ pdfFieldName: 'F[0].P5[0].ExposedToTheFollowing[5]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 498.0, transform: checked }],
  expAsbestos:        [{ pdfFieldName: 'F[0].P5[0].ExposedToTheFollowing[6]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 486.0, transform: checked }],
  expMustardGas:      [{ pdfFieldName: 'F[0].P5[0].ExposedToTheFollowing[7]', type: 'draw-check', checkPage: 4, checkCX: 371.0, checkCY: 486.0, transform: checked }],
  expWarfareAgents:   [{ pdfFieldName: 'F[0].P5[0].ExposedToTheFollowing[8]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 474.0, transform: checked }],
  expOther:           [{ pdfFieldName: 'F[0].P5[0].ExposedToTheFollowing[9]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 462.0, transform: checked }],
  expOtherSpecify:    { pdfFieldName: 'F[0].P5[0].SpecifyOther[0]', type: 'text' },

  // ── Section III — Insurance (p=4) ────────────────────────────────────────
  hasOtherInsurance: [],   // wizard gate — no Yes/No widget; presence of data implies coverage
  insuranceCompanyName:      { pdfFieldName: 'F[0].P5[0].HealthInsuranceInformation[0]', type: 'text' },
  insurancePolicyholderName: { pdfFieldName: 'F[0].P5[0].NameOfPolicyHodler[0]',         type: 'text' },  // PDF typo: "Hodler"
  insurancePolicyNumber:     { pdfFieldName: 'F[0].P5[0].PolicyNumber[0]',                type: 'text' },
  insuranceGroupNumber:      { pdfFieldName: 'F[0].P5[0].GroupCode[0]',                   type: 'text' },
  insurancePolicyholderDob:  [],

  // Section III Item 5 — Medicaid eligible? (YES cx=37.3 / NO cx=79.3, cy=312, p=4)
  eligibleForMedicaid: [
    { pdfFieldName: 'F[0].P5[0].EligibleForMedicaid[0]', type: 'draw-check', checkPage: 4, checkCX: 37.3, checkCY: 312.0, transform: yes },
    { pdfFieldName: 'F[0].P5[0].EligibleForMedicaid[0]', type: 'draw-check', checkPage: 4, checkCX: 79.3, checkCY: 312.0, transform: no  },
  ],
  // Section III Item 6A — Enrolled in Medicare Part A? (YES cx=217.3 / NO cx=259.3, cy=312)
  medicarePartA: [
    { pdfFieldName: 'F[0].P5[0].EnrolledInMedicareHospitalInsurance[0]', type: 'draw-check', checkPage: 4, checkCX: 217.3, checkCY: 312.0, transform: yes },
    { pdfFieldName: 'F[0].P5[0].EnrolledInMedicareHospitalInsurance[0]', type: 'draw-check', checkPage: 4, checkCX: 259.3, checkCY: 312.0, transform: no  },
  ],
  medicareEffectiveDate: { pdfFieldName: 'F[0].P5[0].EffectiveDate[0]',       type: 'text', transform: formatDateString },
  medicareClaimNumber:   { pdfFieldName: 'F[0].P5[0].MedicareClaimNumber[0]', type: 'text' },

  // ── Section IV — Spouse / dependents (p=4) ───────────────────────────────
  spouseFullName:     { pdfFieldName: 'F[0].P5[0].SpousesName[0]', type: 'text' },
  spouseSsnFormatted: { pdfFieldName: 'F[0].P5[0].SPOUSESSN[0]',   type: 'text', transform: onlyDigits9 },  // maxLength=9
  spouseDob:          { pdfFieldName: 'F[0].P5[0].SPOUSEDOB[0]',   type: 'text', transform: formatDateString },
  marriageDate:       { pdfFieldName: 'F[0].P5[0].DATEOFMARRIAGE[0]', type: 'text', transform: formatDateString },
  spouseAddress:      { pdfFieldName: 'F[0].P5[0].SpouseAddressAndTelephoneNumber[0]', type: 'text' },
  spouseFirstName: [], spouseLastName: [], spouseSsn: [],
  // Section IV Item 1C — Spouse's sex (MALE cx=37.3 / FEMALE cx=79.3, cy=192, p=4)
  spouseSex: [
    { pdfFieldName: 'F[0].P5[0].Sex[0]', type: 'draw-check', checkPage: 4, checkCX: 37.3, checkCY: 192.0, transform: (v) => v === 'Male'   ? 'true' : '' },
    { pdfFieldName: 'F[0].P5[0].Sex[0]', type: 'draw-check', checkPage: 4, checkCX: 79.3, checkCY: 192.0, transform: (v) => v === 'Female' ? 'true' : '' },
  ],
  // Section IV Item 3 — Did you provide support to spouse/child not living with you?
  providedSupport: [
    { pdfFieldName: 'F[0].P5[0].DidYouProvideSupportToChildNotLivingWithYou[0]', type: 'draw-check', checkPage: 4, checkCX: 37.3, checkCY: 60.0, transform: yes },
    { pdfFieldName: 'F[0].P5[0].DidYouProvideSupportToChildNotLivingWithYou[0]', type: 'draw-check', checkPage: 4, checkCX: 85.3, checkCY: 60.0, transform: no  },
  ],
  spouseLivedWithYou: [],   // form asks "provide support" (above), not "lived with you"
  numberOfDependentChildren: [],   // no count field — dependents are itemized individually

  // ── Section V — Employment (p=5). cy=690: FULL/PART/NOT/RETIRED. ──────────
  employmentStatus: [
    { pdfFieldName: 'F[0].P6[0].VeteransEmploymentStatus[0]', type: 'draw-check', checkPage: 5, checkCX: 37.3,  checkCY: 690.0, transform: (v) => v === 'Employed full-time' ? 'true' : '' },
    { pdfFieldName: 'F[0].P6[0].VeteransEmploymentStatus[0]', type: 'draw-check', checkPage: 5, checkCX: 115.3, checkCY: 690.0, transform: (v) => v === 'Employed part-time' ? 'true' : '' },
    { pdfFieldName: 'F[0].P6[0].VeteransEmploymentStatus[0]', type: 'draw-check', checkPage: 5, checkCX: 193.3, checkCY: 690.0, transform: (v) => v === 'Not employed'       ? 'true' : '' },
    { pdfFieldName: 'F[0].P6[0].VeteransEmploymentStatus[0]', type: 'draw-check', checkPage: 5, checkCX: 289.3, checkCY: 690.0, transform: (v) => v === 'Retired'            ? 'true' : '' },
  ],
  retirementDate:  { pdfFieldName: 'F[0].P6[0].DATEOFRETIREMENT[0]', type: 'text', transform: formatDateString },
  employerName:    { pdfFieldName: 'F[0].P6[0].CompanyName[0]',      type: 'text' },
  employerAddress: { pdfFieldName: 'F[0].P6[0].CompleteAddress[0]',  type: 'text' },
  employerPhone:   { pdfFieldName: 'F[0].P6[0].CompanyPhone[0]',     type: 'text' },

  // ── Section VI — Financial disclosure opt-in (p=5). No cy=547 / Yes cy=523. ─
  provideFinancialInfo: [
    { pdfFieldName: 'F[0].P6[0].Section6[0]', type: 'draw-check', checkPage: 5, checkCX: 35.0, checkCY: 547.0, transform: no  },
    { pdfFieldName: 'F[0].P6[0].Section6[0]', type: 'draw-check', checkPage: 5, checkCX: 35.0, checkCY: 523.0, transform: yes },
  ],

  // ── Section VII — Income table. subform[1]=veteran, [2]=spouse, [3]=child ─
  grossEmploymentIncome: { pdfFieldName: 'F[0].P6[0].Table1[0].#subform[1].Amount[0]', type: 'text' },
  netFarmBusinessIncome: { pdfFieldName: 'F[0].P6[0].Table1[0].#subform[1].Amount[1]', type: 'text' },
  otherIncome:           { pdfFieldName: 'F[0].P6[0].Table1[0].#subform[1].Amount[2]', type: 'text' },
  spouseGrossIncome:     { pdfFieldName: 'F[0].P6[0].Table1[0].#subform[2].Amount[3]', type: 'text' },
  spouseFarmIncome:      { pdfFieldName: 'F[0].P6[0].Table1[0].#subform[2].Amount[4]', type: 'text' },
  spouseOtherIncome:     { pdfFieldName: 'F[0].P6[0].Table1[0].#subform[2].Amount[5]', type: 'text' },

  // ── Section VIII — Deductible expenses (p=5) ─────────────────────────────
  //   Q1 non-reimbursed medical | Q2 funeral/burial | Q3 YOUR education expenses
  unreimbursedMedicalExpenses: { pdfFieldName: 'F[0].P6[0].Section8_Q1[0]', type: 'text' },
  funeralBurialExpenses:       { pdfFieldName: 'F[0].P6[0].Section8_Q2[0]', type: 'text' },
  veteranEducationExpenses:    { pdfFieldName: 'F[0].P6[0].Section8_Q3[0]', type: 'text' },

  // ── Section IX — Certification & signature (p=5) ─────────────────────────
  privacyAct: [],
  signaturePad: [
    {
      pdfFieldName: 'F[0].P6[0].SignatureOfApplicant[0]',
      type: 'image',
      imagePage: 5,
      imageX: 165,
      imageY: 61,
      imageWidth: 200,
      imageHeight: 21,
    },
  ],
  signatureDate: { pdfFieldName: 'F[0].P6[0].DateSigned[0]', type: 'text', transform: formatDateString },
};
