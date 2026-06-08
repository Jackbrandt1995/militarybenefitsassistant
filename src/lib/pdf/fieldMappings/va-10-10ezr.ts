/**
 * VA 10-10EZR (FEB 2025) — Health Benefits Update Form
 *
 * PDF template: /public/forms/VA-10-10EZR.pdf
 *
 * XFA PDF — radios/checkboxes use 'draw-check' at exact widget coordinates;
 * text fields by their F[0].PX[0] qualified name.
 *
 * Physical page indices (0-based): instructions on p=0–1; Section I+II on p=2
 * (P3 fields); Section III+IV on p=3 (P4 fields); Section V–VIII on p=4 (P5).
 *
 * Verified against the printed form text + field geometry (extract-fields.mjs).
 * Only the two State fields carry a maxLength (=2); SSN fields are unconstrained,
 * so SSNs are written in dashed "XXX-XX-XXXX" form.
 */

import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

const yes = (v: string) => (v === 'Yes' ? 'true' : '');
const no  = (v: string) => (v === 'No'  ? 'true' : '');
const checked = (v: string | boolean) => (v === 'true' || v === true ? 'true' : '');
const st2 = (v: string) => String(v ?? '').slice(0, 2);

export const va1010ezrMapping: FieldMapping = {

  // ── Section I — General Information (P3, page 2) ──────────────────────────
  fullName: [
    { pdfFieldName: 'F[0].P3[0].VeteransName[0]', type: 'text' },
    { pdfFieldName: 'F[0].P4[0].VeteransName[0]', type: 'text' },
    { pdfFieldName: 'F[0].P5[0].VeteransName[0]', type: 'text' },
  ],
  firstName: [], middleName: [], lastName: [], suffix: [],
  ssnFormatted: [
    { pdfFieldName: 'F[0].P3[0].VeteranSSN[0]', type: 'text' },
    { pdfFieldName: 'F[0].P4[0].VeteranSSN[0]', type: 'text' },
    { pdfFieldName: 'F[0].P5[0].VeteranSSN[0]', type: 'text' },
  ],
  ssn: [],
  dob: { pdfFieldName: 'F[0].P3[0].DateofBirth[0]', type: 'text', transform: formatDateString },
  // Item 3 — Sex. MALE cx=469.3 / FEMALE cx=517.3, cy=648.
  sex: [
    { pdfFieldName: 'F[0].P3[0].Sex[0]', type: 'draw-check', checkPage: 2, checkCX: 469.3, checkCY: 648.0, transform: (v) => v === 'Male'   ? 'true' : '' },
    { pdfFieldName: 'F[0].P3[0].Sex[0]', type: 'draw-check', checkPage: 2, checkCX: 517.3, checkCY: 648.0, transform: (v) => v === 'Female' ? 'true' : '' },
  ],
  phoneHome:   { pdfFieldName: 'F[0].P3[0].HomePhone[0]',   type: 'text' },
  phoneMobile: { pdfFieldName: 'F[0].P3[0].MobilePhone[0]', type: 'text' },
  street: { pdfFieldName: 'F[0].P3[0].MailingAddress_Street[0]',  type: 'text' },
  apt:    [],
  city:   { pdfFieldName: 'F[0].P3[0].MailingAddress_City[0]',    type: 'text' },
  state:  { pdfFieldName: 'F[0].P3[0].MailingAddress_State[0]',   type: 'text', transform: st2 },
  zip:    { pdfFieldName: 'F[0].P3[0].MailingAddress_ZipCode[0]', type: 'text' },
  email:  { pdfFieldName: 'F[0].P3[0].Email[0]', type: 'text' },
  // Item 9 — Marital status. Married 373.3/468 · Never Married 433.3/468 ·
  //   Separated 523.3/468 · Widowed 373.3/456 · Divorced 433.3/456.
  maritalStatus: [
    { pdfFieldName: 'F[0].P3[0].MaritalStatus[0]', type: 'draw-check', checkPage: 2, checkCX: 373.3, checkCY: 468.0, transform: (v) => v === 'Married'   ? 'true' : '' },
    { pdfFieldName: 'F[0].P3[0].MaritalStatus[0]', type: 'draw-check', checkPage: 2, checkCX: 433.3, checkCY: 468.0, transform: (v) => v === 'Single'    ? 'true' : '' },
    { pdfFieldName: 'F[0].P3[0].MaritalStatus[0]', type: 'draw-check', checkPage: 2, checkCX: 523.3, checkCY: 468.0, transform: (v) => v === 'Separated' ? 'true' : '' },
    { pdfFieldName: 'F[0].P3[0].MaritalStatus[0]', type: 'draw-check', checkPage: 2, checkCX: 373.3, checkCY: 456.0, transform: (v) => v === 'Widowed'   ? 'true' : '' },
    { pdfFieldName: 'F[0].P3[0].MaritalStatus[0]', type: 'draw-check', checkPage: 2, checkCX: 433.3, checkCY: 456.0, transform: (v) => v === 'Divorced'  ? 'true' : '' },
  ],

  // ── Section II — Insurance (P3, page 2) ──────────────────────────────────
  hasOtherInsurance: [],
  insuranceCompanyName:      { pdfFieldName: 'F[0].P3[0].HealthInsurance[0]',  type: 'text' },
  insurancePolicyholderName: { pdfFieldName: 'F[0].P3[0].NamePolicyHolder[0]', type: 'text' },
  insurancePolicyNumber:     { pdfFieldName: 'F[0].P3[0].PolicyNo[0]',         type: 'text' },
  insuranceGroupNumber:      { pdfFieldName: 'F[0].P3[0].GroupCode[0]',        type: 'text' },
  // Item 5 — Medicaid eligible? YES 427.3/252 · NO 469.3/252.
  eligibleForMedicaid: [
    { pdfFieldName: 'F[0].P3[0].EligibleForMedicaid[0]', type: 'draw-check', checkPage: 2, checkCX: 427.3, checkCY: 252.0, transform: yes },
    { pdfFieldName: 'F[0].P3[0].EligibleForMedicaid[0]', type: 'draw-check', checkPage: 2, checkCX: 469.3, checkCY: 252.0, transform: no  },
  ],
  // Item 6A — Medicare Part A? YES 289.3/237 · NO 331.3/237.
  medicarePartA: [
    { pdfFieldName: 'F[0].P3[0].EnrolledInMedicareHospitalInsurance[0]', type: 'draw-check', checkPage: 2, checkCX: 289.3, checkCY: 237.0, transform: yes },
    { pdfFieldName: 'F[0].P3[0].EnrolledInMedicareHospitalInsurance[0]', type: 'draw-check', checkPage: 2, checkCX: 331.3, checkCY: 237.0, transform: no  },
  ],
  medicareEffectiveDate: { pdfFieldName: 'F[0].P3[0].EffectiveDate[0]',       type: 'text', transform: formatDateString },
  medicareClaimNumber:   { pdfFieldName: 'F[0].P3[0].MedicareClaimNumber[0]', type: 'text' },

  // ── Section III — Military Service (P4, page 3) ──────────────────────────
  serviceBranch:          { pdfFieldName: 'F[0].P4[0].LastBranchOfService[0]',  type: 'text' },
  serviceEntryDate:       { pdfFieldName: 'F[0].P4[0].LastEntryDate[0]',        type: 'text', transform: formatDateString },
  expectedSeparationDate: { pdfFieldName: 'F[0].P4[0].FutureDischargeDate[0]',  type: 'text', transform: formatDateString },
  serviceSeparationDate:  { pdfFieldName: 'F[0].P4[0].LastDischargeDate[0]',    type: 'text', transform: formatDateString },
  dischargeType:          { pdfFieldName: 'F[0].P4[0].DischargeType[0]',        type: 'text' },
  militaryServiceNumber:  { pdfFieldName: 'F[0].P4[0].MilitaryServiceNumber[0]', type: 'text' },
  currentlyActiveDuty:    [],

  // Item 2 — Military history. Left col YES 282.5 / NO 306.5; right col YES 552.5 / NO 576.5.
  purpleHeart: [
    { pdfFieldName: 'F[0].P4[0].Section3_2A[0]', type: 'draw-check', checkPage: 3, checkCX: 282.5, checkCY: 636.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section3_2A[0]', type: 'draw-check', checkPage: 3, checkCX: 306.5, checkCY: 636.0, transform: no  },
  ],
  formerPOW: [
    { pdfFieldName: 'F[0].P4[0].Section3_2B[0]', type: 'draw-check', checkPage: 3, checkCX: 282.5, checkCY: 612.1, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section3_2B[0]', type: 'draw-check', checkPage: 3, checkCX: 306.5, checkCY: 612.1, transform: no  },
  ],
  combatTheaterPost911: [
    { pdfFieldName: 'F[0].P4[0].Section3_2C[0]', type: 'draw-check', checkPage: 3, checkCX: 282.5, checkCY: 588.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section3_2C[0]', type: 'draw-check', checkPage: 3, checkCX: 306.5, checkCY: 588.0, transform: no  },
  ],
  dischargedForDisability: [
    { pdfFieldName: 'F[0].P4[0].Section3_2D[0]', type: 'draw-check', checkPage: 3, checkCX: 552.5, checkCY: 636.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section3_2D[0]', type: 'draw-check', checkPage: 3, checkCX: 576.5, checkCY: 636.0, transform: no  },
  ],
  swAsiaGulfWar: [
    { pdfFieldName: 'F[0].P4[0].Section3_2E[0]', type: 'draw-check', checkPage: 3, checkCX: 552.5, checkCY: 612.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section3_2E[0]', type: 'draw-check', checkPage: 3, checkCX: 576.5, checkCY: 612.0, transform: no  },
  ],
  serviceConnectedRating: [
    { pdfFieldName: 'F[0].P4[0].Section3_2F[0]', type: 'draw-check', checkPage: 3, checkCX: 552.5, checkCY: 588.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section3_2F[0]', type: 'draw-check', checkPage: 3, checkCX: 576.5, checkCY: 588.0, transform: no  },
  ],

  // Item 3 — Military exposure (Yes/No). Field NAMES are offset from the form's
  // item letters; mapped here by VERIFIED widget POSITION:
  //   3A radiation  = Section3_3A   (left  258.5/282.5  cy=531.1)
  //   3B gulf war   = Section3_3B[0](left  258.5/282.5  cy=453)   + FromDate_3B/ToDate_3B
  //   3C operations = Section3_3B[1](left  258.5/282.5  cy=390)
  //   3D herbicide  = Section3_3C   (right 552.5/576.5  cy=501)   + FromDate_3C/ToDate_3C
  radiationActivity: [
    { pdfFieldName: 'F[0].P4[0].Section3_3A[0]', type: 'draw-check', checkPage: 3, checkCX: 258.5, checkCY: 531.1, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section3_3A[0]', type: 'draw-check', checkPage: 3, checkCX: 282.5, checkCY: 531.1, transform: no  },
  ],
  gulfWarHazard: [
    { pdfFieldName: 'F[0].P4[0].Section3_3B[0]', type: 'draw-check', checkPage: 3, checkCX: 258.5, checkCY: 453.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section3_3B[0]', type: 'draw-check', checkPage: 3, checkCX: 282.5, checkCY: 453.0, transform: no  },
  ],
  gulfWarFrom: { pdfFieldName: 'F[0].P4[0].FromDate_3B[0]', type: 'text' },
  gulfWarTo:   { pdfFieldName: 'F[0].P4[0].ToDate_3B[0]',   type: 'text' },
  combatOperations: [
    { pdfFieldName: 'F[0].P4[0].Section3_3B[1]', type: 'draw-check', checkPage: 3, checkCX: 258.5, checkCY: 390.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section3_3B[1]', type: 'draw-check', checkPage: 3, checkCX: 282.5, checkCY: 390.0, transform: no  },
  ],
  agentOrangeService: [
    { pdfFieldName: 'F[0].P4[0].Section3_3C[0]', type: 'draw-check', checkPage: 3, checkCX: 552.5, checkCY: 501.0, transform: yes },
    { pdfFieldName: 'F[0].P4[0].Section3_3C[0]', type: 'draw-check', checkPage: 3, checkCX: 576.5, checkCY: 501.0, transform: no  },
  ],
  agentOrangeFrom: { pdfFieldName: 'F[0].P4[0].FromDate_3C[0]', type: 'text' },
  agentOrangeTo:   { pdfFieldName: 'F[0].P4[0].ToDate_3C[0]',   type: 'text' },

  // Item 3E — "Exposed to any of the following" (check all). cx=305 (left) / 377 (right).
  expAirPollutants: [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[0]', type: 'draw-check', checkPage: 3, checkCX: 305.0, checkCY: 402.0, transform: checked }],
  expChemicals:     [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[1]', type: 'draw-check', checkPage: 3, checkCX: 305.0, checkCY: 390.0, transform: checked }],
  expCampLejeune:   [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[2]', type: 'draw-check', checkPage: 3, checkCX: 305.0, checkCY: 378.0, transform: checked }],
  expRadiation:     [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[3]', type: 'draw-check', checkPage: 3, checkCX: 305.0, checkCY: 366.0, transform: checked }],
  expShad:          [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[4]', type: 'draw-check', checkPage: 3, checkCX: 377.0, checkCY: 366.0, transform: checked }],
  expOccupational:  [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[5]', type: 'draw-check', checkPage: 3, checkCX: 305.0, checkCY: 354.0, transform: checked }],
  expAsbestos:      [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[6]', type: 'draw-check', checkPage: 3, checkCX: 305.0, checkCY: 342.0, transform: checked }],
  expMustardGas:    [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[7]', type: 'draw-check', checkPage: 3, checkCX: 377.0, checkCY: 342.0, transform: checked }],
  expWarfareAgents: [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[8]', type: 'draw-check', checkPage: 3, checkCX: 305.0, checkCY: 330.0, transform: checked }],
  expOther:         [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[9]', type: 'draw-check', checkPage: 3, checkCX: 305.0, checkCY: 318.0, transform: checked }],
  expOtherSpecify:  { pdfFieldName: 'F[0].P4[0].SpecifyOther[0]', type: 'text' },

  // ── Section IV — Dependents (P4, page 3) ─────────────────────────────────
  spouseFullName:     { pdfFieldName: 'F[0].P4[0].SpouseName[0]',        type: 'text' },
  spouseSsnFormatted: { pdfFieldName: 'F[0].P4[0].SpouseSSN[0]',         type: 'text' },
  spouseDob:          { pdfFieldName: 'F[0].P4[0].SpouseDateofBirth[0]', type: 'text', transform: formatDateString },
  marriageDate:       { pdfFieldName: 'F[0].P4[0].DateofMarriage[0]',    type: 'text', transform: formatDateString },
  spouseAddress:      { pdfFieldName: 'F[0].P4[0].SpouseAddress[0]',     type: 'text' },
  spouseFirstName: [], spouseLastName: [], spouseSsn: [],
  // Item 4 — Spouse's sex. MALE 493.3/240 · FEMALE 535.3/240.
  spouseSex: [
    { pdfFieldName: 'F[0].P4[0].Sex[0]', type: 'draw-check', checkPage: 3, checkCX: 493.3, checkCY: 240.0, transform: (v) => v === 'Male'   ? 'true' : '' },
    { pdfFieldName: 'F[0].P4[0].Sex[0]', type: 'draw-check', checkPage: 3, checkCX: 535.3, checkCY: 240.0, transform: (v) => v === 'Female' ? 'true' : '' },
  ],
  // Item 15 — provided support? YES 433.3/62.8 · NO 475.5/62.8.
  providedSupport: [
    { pdfFieldName: 'F[0].P4[0].YesNo5[0]', type: 'draw-check', checkPage: 3, checkCX: 433.3, checkCY: 62.8, transform: yes },
    { pdfFieldName: 'F[0].P4[0].YesNo5[0]', type: 'draw-check', checkPage: 3, checkCX: 475.5, checkCY: 62.8, transform: no  },
  ],

  // ── Section V — Income (P5, page 4). subform[1]=veteran [2]=spouse [3]=child.
  grossEmploymentIncome: { pdfFieldName: 'F[0].P5[0].Table1[0].#subform[1].Amount[0]', type: 'text' },
  netFarmBusinessIncome: { pdfFieldName: 'F[0].P5[0].Table1[0].#subform[1].Amount[1]', type: 'text' },
  otherIncome:           { pdfFieldName: 'F[0].P5[0].Table1[0].#subform[1].Amount[2]', type: 'text' },
  spouseGrossIncome:     { pdfFieldName: 'F[0].P5[0].Table1[0].#subform[2].Amount[3]', type: 'text' },
  spouseFarmIncome:      { pdfFieldName: 'F[0].P5[0].Table1[0].#subform[2].Amount[4]', type: 'text' },
  spouseOtherIncome:     { pdfFieldName: 'F[0].P5[0].Table1[0].#subform[2].Amount[5]', type: 'text' },

  // ── Section VI — Deductible expenses (P5). Standalone Amount[0..2].
  unreimbursedMedicalExpenses: { pdfFieldName: 'F[0].P5[0].Amount[0]', type: 'text' },
  funeralBurialExpenses:       { pdfFieldName: 'F[0].P5[0].Amount[1]', type: 'text' },
  veteranEducationExpenses:    { pdfFieldName: 'F[0].P5[0].Amount[2]', type: 'text' },

  // ── Section VIII — Signature (P5, page 4) ────────────────────────────────
  privacyAct: [],
  signaturePad: [
    {
      pdfFieldName: 'F[0].P5[0].SignatureOfAppliant[0]',  // PDF typo: "Appliant"
      type: 'image',
      imagePage: 4,
      imageX: 165,
      imageY: 218,
      imageWidth: 200,
      imageHeight: 22,
    },
  ],
  signatureDate: { pdfFieldName: 'F[0].P5[0].DateSigned[0]', type: 'text', transform: formatDateString },
};
