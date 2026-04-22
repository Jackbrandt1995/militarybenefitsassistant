/**
 * VA 22-1990 Field Mapping
 *
 * This is an XFA-based PDF. AcroForm checkboxes do NOT render visually on save
 * (pdf-lib's check() modifies the AcroForm layer but the XFA engine overrides the
 * visual output). All checkboxes use 'draw-check' type instead, which draws a
 * filled 6×6 pt square at precise coordinates derived from pypdf field-rect analysis.
 *
 * Coordinates (cx, cy) are the center of each checkbox widget, 0-indexed page numbers:
 *   page 3 = subform[3] = form page 1  (personal info, benefit, direct deposit)
 *   page 4 = subform[4] = form page 2  (education type, service)
 *   page 5 = subform[5] = form page 3  (education history, employment, additional)
 *   page 6 = subform[6] = form page 4  (remarks, family, signature)
 *
 * Text fields (type: 'text') use the full XFA qualified path and work normally via
 * pdf-lib's AcroForm compatibility layer.
 */

import type { FieldMapping } from '../fillPdf';
import { formatSSNParts, formatPhoneParts, formatDateForPdf, formatDateString } from '../fillPdf';

export const va221990Mapping: FieldMapping = {

  // ── BENEFIT SELECTION ─────────────────────────────────────────────────────
  // Part II: page 3. part2_1 (top) = Ch.33, part2_2 = Ch.30, confirmed via text extraction.
  benefitChapter: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'chapter33'   ? 'true' : '', checkPage: 3, checkCX: 46,    checkCY: 315,   checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'chapter30'   ? 'true' : '', checkPage: 3, checkCX: 46,    checkCY: 296.4, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'chapter1606' ? 'true' : '', checkPage: 3, checkCX: 46,    checkCY: 284.4, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'chapter32'   ? 'true' : '', checkPage: 3, checkCX: 46,    checkCY: 270.6, checkSize: 6 },
  ],

  // ── PERSONAL INFORMATION ──────────────────────────────────────────────────
  ssn: [
    { pdfFieldName: 'form1[0].#subform[3].#area[1].ssna1[0]', type: 'text', transform: v => formatSSNParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[3].#area[1].ssna2[0]', type: 'text', transform: v => formatSSNParts(v).middle2 },
    { pdfFieldName: 'form1[0].#subform[3].#area[1].ssna3[0]', type: 'text', transform: v => formatSSNParts(v).last4 },
    { pdfFieldName: 'form1[0].#subform[4].ssna1[1]', type: 'text', transform: v => formatSSNParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[4].ssna2[1]', type: 'text', transform: v => formatSSNParts(v).middle2 },
    { pdfFieldName: 'form1[0].#subform[4].ssna3[1]', type: 'text', transform: v => formatSSNParts(v).last4 },
    { pdfFieldName: 'form1[0].#subform[5].ssna1[2]', type: 'text', transform: v => formatSSNParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[5].ssna2[2]', type: 'text', transform: v => formatSSNParts(v).middle2 },
    { pdfFieldName: 'form1[0].#subform[5].ssna3[2]', type: 'text', transform: v => formatSSNParts(v).last4 },
    { pdfFieldName: 'form1[0].#subform[6].ssna1[3]', type: 'text', transform: v => formatSSNParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[6].ssna2[3]', type: 'text', transform: v => formatSSNParts(v).middle2 },
    { pdfFieldName: 'form1[0].#subform[6].ssna3[3]', type: 'text', transform: v => formatSSNParts(v).last4 },
  ],

  // Sex: page 3. Confirmed via user test: left box (262.4) = Female, right box (316.4) = Male.
  sex: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Male'   ? 'true' : '', checkPage: 3, checkCX: 316.4, checkCY: 634.4, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Female' ? 'true' : '', checkPage: 3, checkCX: 262.4, checkCY: 634.4, checkSize: 6 },
  ],

  dob: [
    { pdfFieldName: 'form1[0].#subform[3].#area[0].dateofbirth1[0]', type: 'text', transform: v => formatDateForPdf(v).month },
    { pdfFieldName: 'form1[0].#subform[3].#area[0].dateofbirth2[0]', type: 'text', transform: v => formatDateForPdf(v).day },
    { pdfFieldName: 'form1[0].#subform[3].#area[0].dateofbirth3[0]', type: 'text', transform: v => formatDateForPdf(v).year },
  ],

  firstName:  { pdfFieldName: 'form1[0].#subform[3].namefirst[0]',  type: 'text' },
  middleName: { pdfFieldName: 'form1[0].#subform[3].namemiddle[0]', type: 'text', transform: v => v ? v.charAt(0).toUpperCase() : '' },
  lastName:   { pdfFieldName: 'form1[0].#subform[3].namelast[0]',   type: 'text' },

  // ── CONTACT INFORMATION ───────────────────────────────────────────────────
  street:  { pdfFieldName: 'form1[0].#subform[3].noandstreet1[0]',   type: 'text' },
  street2: { pdfFieldName: 'form1[0].#subform[3].noandstreet100[0]', type: 'text' },
  apt:     { pdfFieldName: 'form1[0].#subform[3].aptno1[0]',         type: 'text' },
  city:    { pdfFieldName: 'form1[0].#subform[3].city1[0]',          type: 'text' },
  state:   { pdfFieldName: 'form1[0].#subform[3].state1[0]',         type: 'text' },
  zip:     { pdfFieldName: 'form1[0].#subform[3].zip1[0]',           type: 'text' },
  email:   { pdfFieldName: 'form1[0].#subform[3].email1[0]',         type: 'text' },

  // Primary phone (left column = Home): areacodep1, primaryphone1, primaryphone4
  phonePrimary: [
    { pdfFieldName: 'form1[0].#subform[3].areacodep1[0]',      type: 'text', transform: v => formatPhoneParts(v).areaCode },
    { pdfFieldName: 'form1[0].#subform[3].primaryphone1[0]',   type: 'text', transform: v => formatPhoneParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[3].primaryphone4[0]',   type: 'text', transform: v => formatPhoneParts(v).last4 },
  ],
  // Secondary phone (right column = Mobile): areacodes1, secondaryphone1, secondaryphone4
  phoneSecondary: [
    { pdfFieldName: 'form1[0].#subform[3].areacodes1[0]',      type: 'text', transform: v => formatPhoneParts(v).areaCode },
    { pdfFieldName: 'form1[0].#subform[3].secondaryphone1[0]', type: 'text', transform: v => formatPhoneParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[3].secondaryphone4[0]', type: 'text', transform: v => formatPhoneParts(v).last4 },
  ],
  // "None" telephone checkbox — injected when both phonePrimary and phoneSecondary are empty.
  // Estimated coordinates; adjust if square lands in wrong location after testing.
  phoneNone: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 3, checkCX: 43, checkCY: 508, checkSize: 6 },

  // ── DIRECT DEPOSIT ────────────────────────────────────────────────────────
  // checking cx=248.7 cy=417.1, savings cx=308.7 cy=417.1 — page 3
  accountType: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Checking' ? 'true' : '', checkPage: 3, checkCX: 248.7, checkCY: 417.1, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Savings'  ? 'true' : '', checkPage: 3, checkCX: 308.7, checkCY: 417.1, checkSize: 6 },
  ],
  routingNumber: { pdfFieldName: 'form1[0].#subform[3].routingno1[0]', type: 'text' },
  accountNumber: { pdfFieldName: 'form1[0].#subform[3].accountno1[0]', type: 'text' },

  // ── EMERGENCY CONTACT ─────────────────────────────────────────────────────
  emergencyName:    { pdfFieldName: 'form1[0].#subform[3].Aname[0]',    type: 'text' },
  emergencyAddress: { pdfFieldName: 'form1[0].#subform[3].Baddress[0]', type: 'text' },
  emergencyPhone:   { pdfFieldName: 'form1[0].#subform[3].Cnumber[0]',  type: 'text' },

  // ── EDUCATION TYPE (page 4) ───────────────────────────────────────────────
  // Left column: type9A_1–4 (cy=669.9 down to 633.5), Right column: type9A_5–7 (cy=669.9 to 645.6)
  educationType: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'college'       ? 'true' : '', checkPage: 4, checkCX:  37.8, checkCY: 669.9, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'correspondence' ? 'true' : '', checkPage: 4, checkCX:  37.8, checkCY: 657.8, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'apprenticeship' ? 'true' : '', checkPage: 4, checkCX:  37.8, checkCY: 645.6, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'flight'         ? 'true' : '', checkPage: 4, checkCX:  37.8, checkCY: 633.5, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'nationalTest'   ? 'true' : '', checkPage: 4, checkCX: 259.8, checkCY: 669.9, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'licensingTest'  ? 'true' : '', checkPage: 4, checkCX: 259.8, checkCY: 657.8, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'taTopUp'        ? 'true' : '', checkPage: 4, checkCX: 259.8, checkCY: 645.6, checkSize: 6 },
  ],
  schoolNameAddress:  { pdfFieldName: 'form1[0].#subform[4].providethefullname[0]', type: 'text' },
  educationObjective: { pdfFieldName: 'form1[0].#subform[4].pleasespecify[0]',      type: 'text' },

  // ── ACTIVE DUTY STATUS (page 4) ───────────────────────────────────────────
  // Q11: yes cx=40.1 no cx=82.2 cy=364.3 | Q12: same x, cy=334.3
  onActiveDuty: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 4, checkCX:  40.1, checkCY: 364.3, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 4, checkCX:  82.2, checkCY: 364.3, checkSize: 6 },
  ],
  onTerminalLeave: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 4, checkCX:  40.1, checkCY: 334.3, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 4, checkCX:  82.2, checkCY: 334.3, checkSize: 6 },
  ],

  // ── SERVICE PERIODS (page 4) ──────────────────────────────────────────────
  service1Entered:     { pdfFieldName: 'form1[0].#subform[4].Dateentered1[0]',         type: 'text', transform: formatDateString },
  service1Separated:   { pdfFieldName: 'form1[0].#subform[4].Dateseperated1[0]',       type: 'text', transform: formatDateString },
  service1Branch:      { pdfFieldName: 'form1[0].#subform[4].servicecomp1[0]',         type: 'text' },
  service1Status:      { pdfFieldName: 'form1[0].#subform[4].servicestatus1[0]',       type: 'text' },
  service1Involuntary: { pdfFieldName: 'form1[0].#subform[4].InvoluntarilyCalled1[0]', type: 'text' },

  service2Entered:   { pdfFieldName: 'form1[0].#subform[4].Dateentered2[0]',   type: 'text', transform: formatDateString },
  service2Separated: { pdfFieldName: 'form1[0].#subform[4].Dateseperated2[0]', type: 'text', transform: formatDateString },
  service2Branch:    { pdfFieldName: 'form1[0].#subform[4].servicecomp2[0]',   type: 'text' },
  service2Status:    { pdfFieldName: 'form1[0].#subform[4].servicestatus2[0]', type: 'text' },

  service3Entered:   { pdfFieldName: 'form1[0].#subform[4].Dateentered3[0]',   type: 'text', transform: formatDateString },
  service3Separated: { pdfFieldName: 'form1[0].#subform[4].Dateseperated3[0]', type: 'text', transform: formatDateString },
  service3Branch:    { pdfFieldName: 'form1[0].#subform[4].servicecomp3[0]',   type: 'text' },

  // Q14a: ROTC (yes cx=38.6 no cx=176.9 cy=137.3) — page 4
  // Q14b: Service Academy — same row, right column (yes cx=322.2 no cx=364.2 cy=136.7) — page 4
  seniorROTC: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 4, checkCX:  38.6, checkCY: 137.3, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 4, checkCX: 176.9, checkCY: 137.3, checkSize: 6 },
  ],
  serviceAcademy: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 4, checkCX: 322.2, checkCY: 136.7, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 4, checkCX: 364.2, checkCY: 136.7, checkSize: 6 },
  ],
  // serviceAcademyYear maps to gradyear[0] (page 5) — user-confirmed as service academy graduation year
  serviceAcademyYear: { pdfFieldName: 'form1[0].#subform[5].gradyear[0]', type: 'text' },

  // ── EDUCATION BACKGROUND (page 5) ────────────────────────────────────────
  // Q7: HS diploma — yes cx=450.3 no cx=492.3 cy=462.0
  // Q8: FAA certs  — yes cx=450.3 no cx=492.3 cy=426.0
  hsGrad: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true'  ? 'true' : '', checkPage: 5, checkCX: 450.3, checkCY: 462.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'false' ? 'true' : '', checkPage: 5, checkCX: 492.3, checkCY: 462.0, checkSize: 6 },
  ],
  faaFlightCerts: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 5, checkCX: 450.3, checkCY: 426.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 5, checkCX: 492.3, checkCY: 426.0, checkSize: 6 },
  ],

  // ── COLLEGE & TRAINING HISTORY (page 5) ──────────────────────────────────
  edu1Name:   { pdfFieldName: 'form1[0].#subform[5].nameandlocation1[0]', type: 'text' },
  edu1From:   { pdfFieldName: 'form1[0].#subform[5].Datetrainfrom1[0]',   type: 'text', transform: formatDateString },
  edu1To:     { pdfFieldName: 'form1[0].#subform[5].DateTo1[0]',          type: 'text', transform: formatDateString },
  edu1Hours:  { pdfFieldName: 'form1[0].#subform[5].noandtype1[0]',       type: 'text' },
  edu1Degree: { pdfFieldName: 'form1[0].#subform[5].degree1[0]',          type: 'text' },
  edu1Major:  { pdfFieldName: 'form1[0].#subform[5].majorfield1[0]',      type: 'text' },

  edu2Name:   { pdfFieldName: 'form1[0].#subform[5].nameandlocation2[0]', type: 'text' },
  edu2From:   { pdfFieldName: 'form1[0].#subform[5].Datetrainfrom2[0]',   type: 'text', transform: formatDateString },
  edu2To:     { pdfFieldName: 'form1[0].#subform[5].DateTo2[0]',          type: 'text', transform: formatDateString },
  edu2Hours:  { pdfFieldName: 'form1[0].#subform[5].noandtype2[0]',       type: 'text' },
  edu2Degree: { pdfFieldName: 'form1[0].#subform[5].degree2[0]',          type: 'text' },
  edu2Major:  { pdfFieldName: 'form1[0].#subform[5].majorfield2[0]',      type: 'text' },

  // ── EMPLOYMENT (page 5) ───────────────────────────────────────────────────
  emp1Occupation: { pdfFieldName: 'form1[0].#subform[5].principaloccupation1[0]', type: 'text' },
  emp1Months:     { pdfFieldName: 'form1[0].#subform[5].noofmonths1[0]',          type: 'text' },
  emp1License:    { pdfFieldName: 'form1[0].#subform[5].licorrating1[0]',         type: 'text' },
  emp2Occupation: { pdfFieldName: 'form1[0].#subform[5].principaloccupation2[0]', type: 'text' },
  emp2Months:     { pdfFieldName: 'form1[0].#subform[5].noofmonths2[0]',          type: 'text' },
  emp2License:    { pdfFieldName: 'form1[0].#subform[5].licorrating2[0]',         type: 'text' },

  // ── CONTRIBUTIONS & SPECIAL BENEFITS (page 5) ────────────────────────────
  // Q9: MGIB contributions — yes cx=450.3 no cx=492.3 cy=402.0
  // Q10: Active duty kicker — yes cx=450.3 no cx=492.3 cy=354.0
  // Q11[1]: Reserve kicker  — yes cx=450.3 no cx=492.3 cy=168.0
  // Q12[1]: Military tuition — yes cx=450.3 no cx=492.3 cy=144.0
  mgibContributions: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 5, checkCX: 450.3, checkCY: 402.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 5, checkCX: 492.3, checkCY: 402.0, checkSize: 6 },
  ],
  activeDutyKicker: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 5, checkCX: 450.3, checkCY: 354.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 5, checkCX: 492.3, checkCY: 354.0, checkSize: 6 },
  ],
  reserveKicker: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 5, checkCX: 450.3, checkCY: 168.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 5, checkCX: 492.3, checkCY: 168.0, checkSize: 6 },
  ],
  receivingMilitaryTuition: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 5, checkCX: 450.3, checkCY: 144.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 5, checkCX: 492.3, checkCY: 144.0, checkSize: 6 },
  ],

  // ── PRIOR BENEFITS (page 5) ───────────────────────────────────────────────
  // Q13: Federal benefits — yes cx=450.3 no cx=492.3 cy=114.0
  // Q14: VA benefits      — yes cx=450.3 no cx=492.3 cy=66.0
  previousFederalBenefits: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 5, checkCX: 450.3, checkCY: 114.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 5, checkCX: 492.3, checkCY: 114.0, checkSize: 6 },
  ],
  previousVABenefits: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 5, checkCX: 450.3, checkCY:  66.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 5, checkCX: 492.3, checkCY:  66.0, checkSize: 6 },
  ],

  // ── FAMILY & DEPENDENTS (page 6) ─────────────────────────────────────────
  // Q22: married          — yes cx=43.5 no cx=85.5 cy=642.0
  // Q23: dependent child  — yes cx=43.5 no cx=85.5 cy=600.0
  // Q24: dependent parent — yes cx=43.5 no cx=85.5 cy=570.0
  married: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 6, checkCX: 43.5, checkCY: 642.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 6, checkCX: 85.5, checkCY: 642.0, checkSize: 6 },
  ],
  dependentChildren: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 6, checkCX: 43.5, checkCY: 600.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 6, checkCX: 85.5, checkCY: 600.0, checkSize: 6 },
  ],
  dependentParent: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 6, checkCX: 43.5, checkCY: 570.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 6, checkCX: 85.5, checkCY: 570.0, checkSize: 6 },
  ],

  // Checkhere (page 6, cy=705): "I have previously applied for this benefit"
  previouslyApplied: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => (v === 'true' || v === true as unknown as string) ? 'true' : '', checkPage: 6, checkCX: 259.0, checkCY: 705.0, checkSize: 6 },

  // ── REMARKS & SIGNATURE (page 6) ─────────────────────────────────────────
  remarks: { pdfFieldName: 'form1[0].#subform[6].remarks[0]', type: 'text' },

  // Signature: image overlay (drawn PNG from SignaturePad) + draw-text fallback.
  // The image is placed at imageY=80 (~1.1" from bottom) on the signature line.
  // The draw-text entry at the same coordinates prints a text marker if the PNG
  // ever fails to render (e.g., in strict XFA viewers).
  signaturePad: [
    {
      pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY',
      type: 'image',
      imagePage: 6,
      imageX: 36,
      imageY: 80,
      imageWidth: 230,
      imageHeight: 50,
    },
  ],

  // Signature date: try the AcroForm text field first; the draw-text entry burns
  // the formatted date directly onto the page as a reliable fallback.
  signatureDate: [
    { pdfFieldName: 'form1[0].#subform[6].Datesigned[0]', type: 'text', transform: formatDateString },
    { pdfFieldName: 'DRAW_TEXT', type: 'draw-text', transform: formatDateString, textPage: 6, textX: 370, textY: 88, textSize: 10 },
  ],
};
