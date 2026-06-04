/**
 * VA 10-10EZ Field Mapping — SKELETON
 *
 * The PDF template must be placed at /public/forms/VA-10-10EZ.pdf
 * Download from: https://www.va.gov/vaforms/medical/pdf/vha-10-10ez-fill.pdf
 *
 * After placing the PDF, run the field extraction script to get actual AcroForm
 * field names and checkbox coordinates, then fill in each mapping entry below.
 *
 * All values are currently set to [] (empty array), which means the wizard will
 * render and validate correctly but no data will be written to the PDF until the
 * mappings are completed.
 */

import type { FieldMapping } from '../fillPdf';

export const va1010ezMapping: FieldMapping = {

  // ── PERSONAL INFORMATION ──────────────────────────────────────────────────
  // TODO: Map to PDF AcroForm text fields for veteran name (first/middle/last/suffix)
  firstName:        [],
  middleName:       [],
  lastName:         [],
  suffix:           [],

  // TODO: Map to PDF AcroForm text field for mother's maiden name
  mothersMaidenName: [],

  // TODO: SSN is typically split into three boxes (3 digits / 2 digits / 4 digits)
  // Use formatSSNParts(v).first3, .middle2, .last4 transforms like other forms
  ssn: [],

  // TODO: DOB is typically split into month / day / year boxes
  // Use formatDateForPdf(v).month, .day, .year transforms
  dob: [],

  // TODO: Sex — radio buttons. Confirm checkbox coordinates via PDF extraction.
  // Use draw-check entries: transform v => v === 'Male' ? 'true' : '' etc.
  sex: [],

  // TODO: Map to PDF text fields for city and state/country of birth
  birthCity:            [],
  birthStateOrCountry:  [],

  // TODO: Marital status — typically a set of checkboxes (Single / Married / Separated / Divorced / Widowed)
  // Use draw-check entries with transform for each value
  maritalStatus: [],

  // ── CONTACT & ADDRESS ─────────────────────────────────────────────────────
  // TODO: Map to AcroForm text fields for mailing address
  street:  [],
  apt:     [],
  city:    [],
  state:   [],
  zip:     [],

  // TODO: Address type — radio buttons (Permanent / Temporary)
  // Use draw-check entries
  addressType: [],

  // TODO: Phone numbers are typically split into area code / prefix / suffix boxes
  // Use formatPhoneParts(v).areaCode, .first3, .last4 transforms
  phoneHome:   [],
  phoneMobile: [],

  // TODO: Map to AcroForm email text field
  email: [],

  // ── VA BENEFITS & STATUS ──────────────────────────────────────────────────
  // TODO: Purple Heart — Yes/No radio. Use draw-check entries.
  purpleHeart: [],

  // TODO: Medal of Honor — Yes/No radio. Use draw-check entries.
  medalOfHonor: [],

  // TODO: Medicare Part A enrollment — Yes/No radio. Use draw-check entries.
  medicarePartA: [],

  // TODO: Service-connected disability rating — radio group with 5 options
  // (None / 10-20% / 30-40% / 50-60% / 70%+). Use draw-check entries for each value.
  disabilityRating: [],

  // TODO: Former POW — Yes/No radio. Use draw-check entries.
  formerPOW: [],

  // ── MILITARY SERVICE ──────────────────────────────────────────────────────
  // TODO: Map to AcroForm text field for branch of service
  serviceBranch: [],

  // TODO: Service dates — may be split into month/day/year boxes or a single text field
  // Use formatDateForPdf or formatDateString transform as appropriate
  serviceEntryDate:      [],
  serviceSeparationDate: [],

  // TODO: Discharge type — typically a set of checkboxes or a dropdown
  // Use draw-check entries if checkboxes, or type: 'text' if dropdown/text field
  dischargeType: [],

  // TODO: Currently on active duty — Yes/No radio. Use draw-check entries.
  currentlyActiveDuty: [],

  // TODO: Expected separation date — date field, conditional on currentlyActiveDuty = Yes
  expectedSeparationDate: [],

  // ── SERVICE EXPOSURES ─────────────────────────────────────────────────────
  // TODO: Each exposure is a standalone checkbox. Confirm page and coordinates via PDF extraction.
  // Use draw-check with transform: v => (v === 'true' || v === true) ? 'true' : ''
  combatTheater: [],
  swAsiaTheater: [],
  agentOrange:   [],
  campLejeune:   [],
  radiationRisk: [],
  project112:    [],
  mst:           [],

  // ── HEALTH INSURANCE ─────────────────────────────────────────────────────
  // TODO: Has other insurance — Yes/No radio. Use draw-check entries.
  hasOtherInsurance: [],

  // TODO: Insurance details — AcroForm text fields, conditional on hasOtherInsurance = Yes
  insuranceCompanyName:      [],
  insurancePolicyNumber:     [],
  insuranceGroupNumber:      [],
  insurancePolicyholderName: [],

  // TODO: Policyholder DOB — may be split into month/day/year or a single text field
  insurancePolicyholderDob: [],

  // ── EMPLOYMENT ────────────────────────────────────────────────────────────
  // TODO: Employment status — radio group with 5 options. Use draw-check entries for each value.
  employmentStatus: [],

  // TODO: Employer details — AcroForm text fields, conditional on employed status
  employerName:    [],
  employerAddress: [],
  employerPhone:   [],

  // ── FINANCIAL DISCLOSURE ──────────────────────────────────────────────────
  // TODO: Map each income/expense amount to its AcroForm number/text field
  grossEmploymentIncome:      [],
  netFarmBusinessIncome:      [],
  otherIncome:                [],
  unreimbursedMedicalExpenses: [],
  numberOfDependents:         [],
  dependentEducationExpenses: [],

  // ── SPOUSE & DEPENDENTS ───────────────────────────────────────────────────
  // TODO: Married / has dependents — Yes/No radio. Use draw-check entries.
  married: [],

  // TODO: Spouse name and identifying info — AcroForm text fields
  spouseFirstName: [],
  spouseLastName:  [],

  // TODO: Spouse SSN — typically split into three boxes like veteran SSN
  spouseSsn: [],

  // TODO: Spouse DOB — may be split into month/day/year or a single text field
  spouseDob: [],

  // TODO: Marriage date — may be split into month/day/year or a single text field
  marriageDate: [],

  // TODO: Spouse lived with veteran — Yes/No radio. Use draw-check entries.
  spouseLivedWithYou: [],

  // TODO: Spouse gross income — AcroForm number/text field
  spouseGrossIncome: [],

  // TODO: Number of dependent children — AcroForm number/text field
  numberOfDependentChildren: [],

  // ── CERTIFICATION & SIGNATURE ─────────────────────────────────────────────
  // TODO: Privacy Act / certification checkbox. Use draw-check entry.
  privacyAct: [],

  // TODO: Signature image overlay — use type: 'image' with imagePage/imageX/imageY/imageWidth/imageHeight
  // Measure the signature box coordinates from the PDF after extraction.
  signaturePad: [],

  // TODO: Signature date — AcroForm text field or draw-text
  signatureDate: [],
};
