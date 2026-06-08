/**
 * VA 26-1880 (DEC 2025) — Request for a Certificate of Eligibility (Home Loan)
 *
 * PDF template: /public/forms/VA-26-1880.pdf
 *
 * This is an XFA PDF. pdf-lib strips XFA on load, leaving the AcroForm
 * compatibility layer. All radio buttons therefore use the 'draw-check'
 * approach (a filled square drawn at the widget's exact coordinates). Text
 * fields are written by their full XFA-qualified name via getTextField().
 *
 * RADIO MAP — verified against the printed form (page 1 = checkPage 0):
 *   RadioButtonList[0]  Item 9A   Discharged/retired/separated for disability?  cx=36.8  cy 480/468
 *   RadioButtonList[1]  Item 2A   Served under another name?                    cx=414.8 cy 630/618
 *   RadioButtonList[2]  Item 10A  Currently on active duty?                     cx=36.8  cy 420/408
 *   RadioButtonList[3]  Item 10B  Purple Heart recipient?                       cx=204.8 cy 420/408
 *   RadioButtonList[4]  Item 10C  Pre-discharge claim pending?                  cx=372.8 cy 420/408
 *   RadioButtonList[5]  Item 13A  Used the VA home loan program before?         cx=36.8  cy 138/126
 *   RadioButtonList[6]  Item 13B  Still own any of those homes?                 cx=264.8 cy 138/126
 *   RadioButtonList[7]  Item 14D  Restoration type (loan 1, 4 options)          cx=366.8 cy 84/72/60/48
 *   RadioButtonList[8]  Item 12   COE use / loan purpose (4 options)            cy=168
 *   RadioButtonList[9]  Item 17A  Own a disaster-damaged VA-financed home? (p2) cx=36.8  cy 582/570
 *   RadioButtonList[10] Item 15D  Restoration type (loan 2, p2)                 cx=366.8 cy 726/714/702/690
 *   RadioButtonList[11] Item 16D  Restoration type (loan 3, p2)                 cx=366.8 cy 660/648/636/624
 *
 * In every Yes/No pair the YES widget sits at the higher cy.
 *
 * Combined fields built by computeAnswers() in va-26-1880.ts:
 *   fullName       ← "First Middle Last [Suffix]"  (Item 1 wants First, Middle Initial, Last)
 *   fullAddress    ← "Street [Apt], City, ST ZIP"  (Item 3)
 *   phoneFormatted ← "(XXX) XXX-XXXX"              (Item 7)
 *
 * SSN[0] has maxLength=9 — the SSN MUST be written as 9 digits (no dashes) or
 * pdf-lib throws ExceededMaxLengthError and the field is silently left blank.
 */

import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

const onlyDigits9 = (v: string) => v.replace(/\D/g, '').slice(0, 9);

export const va261880Mapping: FieldMapping = {

  // ── Item 1 — Name (First, Middle Initial, Last) ──────────────────────────
  fullName: { pdfFieldName: 'form1[0].#subform[0].NameOfVeteran[0]', type: 'text' },
  // Raw parts folded into fullName — not written directly
  firstName:  [],
  middleName: [],
  lastName:   [],
  suffix:     [],

  // ── Item 2A/2B — Served under another name? + other names ────────────────
  servedUnderAnotherName: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'draw-check', checkPage: 0, checkCX: 414.8, checkCY: 630.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'draw-check', checkPage: 0, checkCX: 414.8, checkCY: 618.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  otherNames: { pdfFieldName: 'form1[0].#subform[0].Other_Names_Used_During_Military_Service[0]', type: 'text' },

  // ── Item 3 — Mailing address (combined) ──────────────────────────────────
  fullAddress: { pdfFieldName: 'form1[0].#subform[0].Address_NumberandStreetorRuralRoute_City_or_PO_State_ZIPCode[0]', type: 'text' },
  street: [], apt: [], city: [], state: [], zip: [],

  // ── Items 4-8 — DOB, SSN, Service Number, Phone, Email ───────────────────
  dob:           { pdfFieldName: 'form1[0].#subform[0].DateOfBirth[0]',   type: 'text', transform: formatDateString },
  ssn:           { pdfFieldName: 'form1[0].#subform[0].SSN[0]',           type: 'text', transform: onlyDigits9 },
  serviceNumber: { pdfFieldName: 'form1[0].#subform[0].ServiceNumber[0]', type: 'text' },
  phoneFormatted:{ pdfFieldName: 'form1[0].#subform[0].TelephoneNumber[0]', type: 'text' },
  daytimePhone:  [],
  email:         { pdfFieldName: 'form1[0].#subform[0].Email[0]',         type: 'text' },

  // ── Item 9A/9B — Discharged for disability? + VA claim number ────────────
  dischargedForDisability: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[0]', type: 'draw-check', checkPage: 0, checkCX: 36.8, checkCY: 480.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[0]', type: 'draw-check', checkPage: 0, checkCX: 36.8, checkCY: 468.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  vaFileNumber: { pdfFieldName: 'form1[0].#subform[0].VAClaimNumber_IfKnown[0]', type: 'text' },

  // ── Item 10A — Currently on active duty? ─────────────────────────────────
  onActiveDuty: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[2]', type: 'draw-check', checkPage: 0, checkCX: 36.8, checkCY: 420.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[2]', type: 'draw-check', checkPage: 0, checkCX: 36.8, checkCY: 408.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  // ── Item 10B — Purple Heart recipient? ───────────────────────────────────
  purpleHeart: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[3]', type: 'draw-check', checkPage: 0, checkCX: 204.8, checkCY: 420.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[3]', type: 'draw-check', checkPage: 0, checkCX: 204.8, checkCY: 408.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  // ── Item 10C — Pre-discharge claim pending? ──────────────────────────────
  predischargeClaim: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[4]', type: 'draw-check', checkPage: 0, checkCX: 372.8, checkCY: 420.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[4]', type: 'draw-check', checkPage: 0, checkCX: 372.8, checkCY: 408.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],

  // ── Item 11A — Active service periods (Branch / Entered / Separated) ──────
  service1Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11A1[0]', type: 'text' },
  service1Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11A1[0]',     type: 'text', transform: formatDateString },
  service1Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11A1[0]',   type: 'text', transform: formatDateString },
  service2Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11A2[0]', type: 'text' },
  service2Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11A2[0]',     type: 'text', transform: formatDateString },
  service2Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11A2[0]',   type: 'text', transform: formatDateString },
  service3Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11A3[0]', type: 'text' },
  service3Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11A3[0]',     type: 'text', transform: formatDateString },
  service3Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11A3[0]',   type: 'text', transform: formatDateString },
  service4Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11A4[0]', type: 'text' },
  service4Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11A4[0]',     type: 'text', transform: formatDateString },
  service4Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11A4[0]',   type: 'text', transform: formatDateString },

  // ── Item 11B — Reserve / National Guard service periods ──────────────────
  hadGuardReserveService: [],   // wizard gate — no PDF field
  guardService1Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11B1[0]', type: 'text' },
  guardService1Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11B1[0]',     type: 'text', transform: formatDateString },
  guardService1Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11B1[0]',   type: 'text', transform: formatDateString },
  guardService2Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11B2[0]', type: 'text' },
  guardService2Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11B2[0]',     type: 'text', transform: formatDateString },
  guardService2Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11B2[0]',   type: 'text', transform: formatDateString },
  guardService3Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11B3[0]', type: 'text' },
  guardService3Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11B3[0]',     type: 'text', transform: formatDateString },
  guardService3Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11B3[0]',   type: 'text', transform: formatDateString },
  guardService4Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11B4[0]', type: 'text' },
  guardService4Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11B4[0]',     type: 'text', transform: formatDateString },
  guardService4Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11B4[0]',   type: 'text', transform: formatDateString },

  // ── Item 12 — How you will use your COE (loan purpose) ───────────────────
  // RadioButtonList[8] at cy=168: Inquiry cx=36.8, Purchase cx=168.8, CashOut cx=270.8, IRRRL cx=384.8
  loanPurpose: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[8]', type: 'draw-check', checkPage: 0, checkCX: 36.8,  checkCY: 168.0, transform: (v) => v === 'Inquiry'  ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[8]', type: 'draw-check', checkPage: 0, checkCX: 168.8, checkCY: 168.0, transform: (v) => v === 'Purchase' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[8]', type: 'draw-check', checkPage: 0, checkCX: 270.8, checkCY: 168.0, transform: (v) => v === 'CashOut'  ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[8]', type: 'draw-check', checkPage: 0, checkCX: 384.8, checkCY: 168.0, transform: (v) => v === 'IRRRL'    ? 'true' : '' },
  ],

  // ── Item 13A — Used the VA home loan program before? ─────────────────────
  priorUse: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[5]', type: 'draw-check', checkPage: 0, checkCX: 36.8, checkCY: 138.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[5]', type: 'draw-check', checkPage: 0, checkCX: 36.8, checkCY: 126.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  // ── Item 13B — Still own any of those homes? ─────────────────────────────
  stillOwnHomes: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[6]', type: 'draw-check', checkPage: 0, checkCX: 264.8, checkCY: 138.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[6]', type: 'draw-check', checkPage: 0, checkCX: 264.8, checkCY: 126.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],

  // ── Items 14A-D — Previous VA loan 1 ─────────────────────────────────────
  priorLoan1Address: { pdfFieldName: 'form1[0].#subform[0].COMPLETE_ADDRESS14[0]', type: 'text' },
  priorLoan1Number:  { pdfFieldName: 'form1[0].#subform[0].LOAN_NUMBER14[0]',      type: 'text' },
  priorLoan1Date:    { pdfFieldName: 'form1[0].#subform[0].DATE_OF_LOAN14[0]',     type: 'text' },
  restorationType1: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[7]', type: 'draw-check', checkPage: 0, checkCX: 366.8, checkCY: 84.0, transform: (v) => v === 'Inquiry'           ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[7]', type: 'draw-check', checkPage: 0, checkCX: 366.8, checkCY: 72.0, transform: (v) => v === 'CashOutRestoration' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[7]', type: 'draw-check', checkPage: 0, checkCX: 366.8, checkCY: 60.0, transform: (v) => v === 'IRRRLRestoration'    ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[7]', type: 'draw-check', checkPage: 0, checkCX: 366.8, checkCY: 48.0, transform: (v) => v === 'OneTimeRestoration'  ? 'true' : '' },
  ],

  // ── Items 15A-D — Previous VA loan 2 (page 2) ────────────────────────────
  hadPriorLoan2:    [],
  priorLoan2Address: { pdfFieldName: 'form1[0].#subform[1].COMPLETE_ADDRESS15[0]', type: 'text' },
  priorLoan2Number:  { pdfFieldName: 'form1[0].#subform[1].LOAN_NUMBER15[0]',      type: 'text' },
  priorLoan2Date:    { pdfFieldName: 'form1[0].#subform[1].DATE_OF_LOAN15[0]',     type: 'text' },
  restorationType2: [
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[10]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 726.0, transform: (v) => v === 'Inquiry'           ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[10]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 714.0, transform: (v) => v === 'CashOutRestoration' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[10]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 702.0, transform: (v) => v === 'IRRRLRestoration'    ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[10]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 690.0, transform: (v) => v === 'OneTimeRestoration'  ? 'true' : '' },
  ],

  // ── Items 16A-D — Previous VA loan 3 (page 2) ────────────────────────────
  hadPriorLoan3:    [],
  priorLoan3Address: { pdfFieldName: 'form1[0].#subform[1].COMPLETE_ADDRESS16[0]', type: 'text' },
  priorLoan3Number:  { pdfFieldName: 'form1[0].#subform[1].LOAN_NUMBER16[0]',      type: 'text' },
  priorLoan3Date:    { pdfFieldName: 'form1[0].#subform[1].DATE_OF_LOAN16[0]',     type: 'text' },
  restorationType3: [
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[11]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 660.0, transform: (v) => v === 'Inquiry'           ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[11]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 648.0, transform: (v) => v === 'CashOutRestoration' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[11]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 636.0, transform: (v) => v === 'IRRRLRestoration'    ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[11]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 624.0, transform: (v) => v === 'OneTimeRestoration'  ? 'true' : '' },
  ],

  // ── Item 17A-D — Disaster-damaged VA-financed home (page 2) ──────────────
  ownDisasterHome: [
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[9]', type: 'draw-check', checkPage: 1, checkCX: 36.8, checkCY: 582.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[9]', type: 'draw-check', checkPage: 1, checkCX: 36.8, checkCY: 570.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  disasterLoanDate:        { pdfFieldName: 'form1[0].#subform[1].DateOfLoan17B[0]',     type: 'text' },
  disasterLossDate:        { pdfFieldName: 'form1[0].#subform[1].DateOfLoss[0]',        type: 'text' },
  disasterPropertyAddress: { pdfFieldName: 'form1[0].#subform[1].AddressOfProperty[0]', type: 'text' },

  // ── Item 18 — Remarks ────────────────────────────────────────────────────
  remarks: { pdfFieldName: 'form1[0].#subform[1].Remarks[0]', type: 'text' },

  // ── Section IV — Certification & Signature (19A/19B) ─────────────────────
  privacyAct: [],   // wizard checkbox — no PDF field
  signaturePad: [
    {
      pdfFieldName: 'form1[0].#subform[1].Signature[0]',
      type: 'image',
      imagePage: 1,
      imageX: 30,
      imageY: 198,
      imageWidth: 200,
      imageHeight: 12,
    },
  ],
  signatureDate: { pdfFieldName: 'form1[0].#subform[1].DateSigned[0]', type: 'text', transform: formatDateString },
};
