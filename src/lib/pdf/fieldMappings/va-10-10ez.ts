/**
 * VA 10-10EZ — Application for VA Health Care
 *
 * PDF template: /public/forms/VA-10-10EZ.pdf
 *
 * This form uses an XFA PDF. pdf-lib strips XFA data on load, leaving only
 * the AcroForm compatibility layer. Checkboxes and radio buttons use the
 * 'draw-check' approach (filled square at precise coordinates). Text fields
 * use the F[0].PX[0].FieldName[0] qualified path.
 *
 * Physical page structure (0-indexed):
 *   p=0–2  cover / instructions
 *   p=3    Section I: Personal info, Section II: VA Benefits (F[0].P4[0] fields)
 *   p=4    Section III: Service, exposures (F[0].P4[0] fields continued)
 *   p=5    Section IV–VI: Insurance, spouse, employment, financial, signature
 *          (F[0].P5[0] and F[0].P6[0] fields)
 *
 * Combined fields built by computeAnswers() in the form definition:
 *   fullName         ← "Last, First [Middle]"   from firstName/middleName/lastName
 *   ssnFormatted     ← "XXX-XX-XXXX"            from ssn
 *   placeOfBirth     ← "City, State"             from birthCity/birthStateOrCountry
 *   spouseFullName   ← "First Last"              from spouseFirstName/spouseLastName
 *   spouseSsnFormatted ← "XXX-XX-XXXX"          from spouseSsn
 */

import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va1010ezMapping: FieldMapping = {

  // ── Personal — combined name (raw parts not written directly) ────────────
  // PDF field: LastFirstMiddle[0] on p=3
  fullName:     { pdfFieldName: 'F[0].P4[0].LastFirstMiddle[0]', type: 'text' },
  ssnFormatted: { pdfFieldName: 'F[0].P4[0].SSN[0]',             type: 'text' },
  dob:          { pdfFieldName: 'F[0].P4[0].DOB[0]',             type: 'text', transform: formatDateString },

  // Individual name parts folded into combined keys — no direct PDF fields
  firstName:  [],
  middleName: [],
  lastName:   [],
  suffix:     [],
  ssn:        [],

  mothersMaidenName:   { pdfFieldName: 'F[0].P4[0].MothersMaidenName[0]', type: 'text' },
  placeOfBirth:        { pdfFieldName: 'F[0].P4[0].PlaceOfBirth[0]',      type: 'text' },

  // Raw birth city/state folded into placeOfBirth above — no direct PDF fields
  birthCity:           [],
  birthStateOrCountry: [],

  // Sex — F[0].P4[0].BirthSex[0], options ['1','2'] at p=3
  //   Male   = option '1' cx=37.3 cy=558.0
  //   Female = option '2' cx=37.3 cy=546.0
  sex: [
    { pdfFieldName: 'F[0].P4[0].BirthSex[0]', type: 'draw-check', checkPage: 3, checkCX: 37.3, checkCY: 558.0, transform: (v) => v === 'Male'   ? 'true' : '' },
    { pdfFieldName: 'F[0].P4[0].BirthSex[0]', type: 'draw-check', checkPage: 3, checkCX: 37.3, checkCY: 546.0, transform: (v) => v === 'Female' ? 'true' : '' },
  ],

  // Marital status — CurrentMaritalStatus[0] options ['1'-'5'] at p=3, 5 widgets
  // Widget cx/cy not available from extraction — unmapped
  maritalStatus: [],

  // ── Contact & Address ─────────────────────────────────────────────────────
  street: { pdfFieldName: 'F[0].P4[0].MailingAddress_Street[0]',  type: 'text' },
  apt:    [],   // Separate apt field not confirmed — include in street if needed
  city:   { pdfFieldName: 'F[0].P4[0].MailingAddress_City[0]',    type: 'text' },
  state:  { pdfFieldName: 'F[0].P4[0].MailingAddress_State[0]',   type: 'text' },
  zip:    { pdfFieldName: 'F[0].P4[0].MailingAddress_ZipCode[0]', type: 'text' },

  // Address type (Permanent/Temporary) — radio, cx not confirmed
  addressType: [],

  phoneHome:   { pdfFieldName: 'F[0].P4[0].HOMEPhone[0]',   type: 'text' },
  phoneMobile: { pdfFieldName: 'F[0].P4[0].MOBILEPhone[0]', type: 'text' },
  email:       { pdfFieldName: 'F[0].P4[0].EmailAddress[0]', type: 'text' },

  // ── Section II: VA Benefits & Status (all Yes/No, draw-check, p=3) ────────
  //
  // Left column (cx≈282.5=YES, cx≈306.5=NO):
  //   2A cy=120.0 → Purple Heart
  //   2B cy=96.1  → Medal of Honor
  //   2C cy=72.0  → Former POW
  //
  // Right column (cx≈552.5=YES, cx≈576.5=NO):
  //   2D cy=120.0 → Service-connected disability (Yes/No) — no direct wizard field
  //   2E cy=96.0  → Medicare Part A enrollment
  //   2F cy=72.0  → Medicaid eligibility — not in wizard

  purpleHeart: [
    { pdfFieldName: 'F[0].P4[0].Section2_2A', type: 'draw-check', checkPage: 3, checkCX: 282.5, checkCY: 120.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'F[0].P4[0].Section2_2A', type: 'draw-check', checkPage: 3, checkCX: 306.5, checkCY: 120.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],

  medalOfHonor: [
    { pdfFieldName: 'F[0].P4[0].Section2_2B', type: 'draw-check', checkPage: 3, checkCX: 282.5, checkCY: 96.1,  transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'F[0].P4[0].Section2_2B', type: 'draw-check', checkPage: 3, checkCX: 306.5, checkCY: 96.1,  transform: (v) => v === 'No'  ? 'true' : '' },
  ],

  formerPOW: [
    { pdfFieldName: 'F[0].P4[0].Section2_2C', type: 'draw-check', checkPage: 3, checkCX: 282.5, checkCY: 72.0,  transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'F[0].P4[0].Section2_2C', type: 'draw-check', checkPage: 3, checkCX: 306.5, checkCY: 72.0,  transform: (v) => v === 'No'  ? 'true' : '' },
  ],

  medicarePartA: [
    { pdfFieldName: 'F[0].P4[0].Section2_2E', type: 'draw-check', checkPage: 3, checkCX: 552.5, checkCY: 96.0,  transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'F[0].P4[0].Section2_2E', type: 'draw-check', checkPage: 3, checkCX: 576.5, checkCY: 96.0,  transform: (v) => v === 'No'  ? 'true' : '' },
  ],

  // Service-connected disability rating — 5-option radio, coordinates not available
  disabilityRating: [],

  // ── Section III: Military Service (F[0].P4[0] fields, p=3–4) ─────────────
  serviceBranch:         { pdfFieldName: 'F[0].P4[0].LastBranchOfService[0]',   type: 'text' },
  serviceEntryDate:      { pdfFieldName: 'F[0].P4[0].LASTENTRYDATE[0]',         type: 'text', transform: formatDateString },
  serviceSeparationDate: { pdfFieldName: 'F[0].P4[0].LASTDISCHARGEDATE[0]',     type: 'text', transform: formatDateString },
  dischargeType:         { pdfFieldName: 'F[0].P4[0].DischargeType[0]',         type: 'text' },
  expectedSeparationDate:{ pdfFieldName: 'F[0].P4[0].FUTUREDISCHARGEDATE[0]',   type: 'text', transform: formatDateString },

  // Currently on active duty — Yes/No radio, coordinates not confirmed
  currentlyActiveDuty: [],

  // ── Service Exposures — ExposedToTheFollowing[0–9], draw-check, p=4 ───────
  // Left column cx=299.0, right column cx=371.0
  // Mapping our 7 wizard fields to checkboxes [0]–[6]:
  //   [0] cy=546  combatTheater   (post-9/11 combat theater)
  //   [1] cy=534  swAsiaTheater   (Gulf War SW Asia)
  //   [2] cy=522  agentOrange     (Vietnam / Agent Orange)
  //   [3] cy=510  campLejeune     (Camp Lejeune contamination)
  //   [4] cy=510  radiationRisk   (right column; side-by-side with [3])
  //   [5] cy=498  project112      (Project 112/SHAD)
  //   [6] cy=486  mst             (military sexual trauma)
  //
  // Checkboxes [7]–[9] cover additional exposures not in the wizard.

  combatTheater: [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[0]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 546.0, transform: (v) => v === 'true' ? 'true' : '' }],
  swAsiaTheater: [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[1]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 534.0, transform: (v) => v === 'true' ? 'true' : '' }],
  agentOrange:   [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[2]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 522.0, transform: (v) => v === 'true' ? 'true' : '' }],
  campLejeune:   [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[3]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 510.0, transform: (v) => v === 'true' ? 'true' : '' }],
  radiationRisk: [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[4]', type: 'draw-check', checkPage: 4, checkCX: 371.0, checkCY: 510.0, transform: (v) => v === 'true' ? 'true' : '' }],
  project112:    [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[5]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 498.0, transform: (v) => v === 'true' ? 'true' : '' }],
  mst:           [{ pdfFieldName: 'F[0].P4[0].ExposedToTheFollowing[6]', type: 'draw-check', checkPage: 4, checkCX: 299.0, checkCY: 486.0, transform: (v) => v === 'true' ? 'true' : '' }],

  // ── Health Insurance (F[0].P5[0] fields, p=4–5) ──────────────────────────
  // hasOtherInsurance Yes/No radio — coordinates not confirmed
  hasOtherInsurance: [],

  // NOTE: PDF field name has a deliberate typo — "Hodler" not "Holder"
  insuranceCompanyName:      { pdfFieldName: 'F[0].P5[0].HealthInsuranceInformation[0]', type: 'text' },
  insurancePolicyholderName: { pdfFieldName: 'F[0].P5[0].NameOfPolicyHodler[0]',         type: 'text' },
  insurancePolicyNumber:     { pdfFieldName: 'F[0].P5[0].PolicyNumber[0]',                type: 'text' },
  insuranceGroupNumber:      { pdfFieldName: 'F[0].P5[0].GroupCode[0]',                   type: 'text' },
  insurancePolicyholderDob:  [],   // Not confirmed in extraction

  // ── Spouse & Dependents (F[0].P5[0] fields) ───────────────────────────────
  // spouseFullName built via computeAnswers ("First Last")
  spouseFullName:      { pdfFieldName: 'F[0].P5[0].SpousesName[0]',                type: 'text' },
  spouseSsnFormatted:  { pdfFieldName: 'F[0].P5[0].SPOUSESSN[0]',                  type: 'text' },
  spouseDob:           { pdfFieldName: 'F[0].P5[0].SPOUSEDOB[0]',                  type: 'text', transform: formatDateString },
  marriageDate:        { pdfFieldName: 'F[0].P5[0].DATEOFMARRIAGE[0]',             type: 'text', transform: formatDateString },

  // Raw spouse name parts folded into spouseFullName above
  spouseFirstName: [],
  spouseLastName:  [],
  spouseSsn:       [],

  // spouseLivedWithYou Yes/No radio — coordinates not confirmed
  spouseLivedWithYou: [],

  // ── Employment (F[0].P6[0] fields, p=5) ───────────────────────────────────
  // VeteransEmploymentStatus radio with exact-text options — coordinates not confirmed
  employmentStatus: [],

  employerName:    { pdfFieldName: 'F[0].P6[0].CompanyName[0]',      type: 'text' },
  employerAddress: { pdfFieldName: 'F[0].P6[0].CompleteAddress[0]',  type: 'text' },
  employerPhone:   { pdfFieldName: 'F[0].P6[0].CompanyPhone[0]',     type: 'text' },

  // ── Financial Disclosure (F[0].P6[0].Table1 and Section8, p=5) ───────────
  // Table1 subform[0] = veteran's income (3 fields: employment, farm, other)
  // Table1 subform[1] = spouse income (3 fields)
  grossEmploymentIncome: { pdfFieldName: 'F[0].P6[0].Table1[0].#subform[0].Amount[0]', type: 'text' },
  netFarmBusinessIncome: { pdfFieldName: 'F[0].P6[0].Table1[0].#subform[0].Amount[1]', type: 'text' },
  otherIncome:           { pdfFieldName: 'F[0].P6[0].Table1[0].#subform[0].Amount[2]', type: 'text' },

  spouseGrossIncome: { pdfFieldName: 'F[0].P6[0].Table1[0].#subform[1].Amount[0]', type: 'text' },

  // Section 8 deductions / dependent counts
  unreimbursedMedicalExpenses: { pdfFieldName: 'F[0].P6[0].Section8_Q1[0]', type: 'text' },
  dependentEducationExpenses:  { pdfFieldName: 'F[0].P6[0].Section8_Q2[0]', type: 'text' },
  numberOfDependents:          { pdfFieldName: 'F[0].P6[0].Section8_Q3[0]', type: 'text' },

  numberOfDependentChildren: [],   // Separate dependent children count — not confirmed

  // ── Certification & Signature ─────────────────────────────────────────────
  privacyAct: [],   // Wizard checkbox only — no corresponding PDF checkbox field

  // Signature image drawn over the TextField at p=5 cx=274.4 cy=72.5 w=219.3 h=23
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
