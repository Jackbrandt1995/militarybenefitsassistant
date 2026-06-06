/**
 * VA 26-1880 — Request for Certificate of Eligibility (Home Loan)
 *
 * PDF template: /public/forms/VA-26-1880.pdf  (VBA-26-1880-ARE.pdf)
 *
 * This form uses an XFA PDF. pdf-lib strips XFA data on load, leaving only
 * the AcroForm compatibility layer. All radio buttons and checkboxes therefore
 * use the 'draw-check' approach (filled square drawn at precise coordinates).
 * Text fields use the full XFA-qualified field path via getTextField().
 *
 * Combined fields — the PDF uses single fields for what the wizard stores
 * separately. These derived keys are built by computeAnswers() in the form
 * definition (va-26-1880.ts) and then mapped below:
 *
 *   fullName      ← "Last, First [Middle]"  from firstName/middleName/lastName
 *   ssnFormatted  ← "XXX-XX-XXXX"           from ssn
 *   fullAddress   ← "Street [Apt], City, ST ZIP"  from street/apt/city/state/zip
 *   phoneFormatted← "(XXX) XXX-XXXX"        from daytimePhone
 *
 * NOTE: TypeOfDischarge fields (11A1–A4, 11B1–B4) exist in the XFA layer only
 * and are NOT present in the AcroForm compatibility layer. They are mapped to []
 * so the wizard still collects the value but skips PDF fill.
 */

import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va261880Mapping: FieldMapping = {

  // ── Personal — combined fields (raw parts not written directly) ───────────
  fullName:     { pdfFieldName: 'form1[0].#subform[0].NameOfVeteran[0]',           type: 'text' },
  ssnFormatted: { pdfFieldName: 'form1[0].#subform[0].SSN[0]',                     type: 'text' },
  dob:          { pdfFieldName: 'form1[0].#subform[0].DateOfBirth[0]',             type: 'text', transform: formatDateString },
  vaFileNumber: { pdfFieldName: 'form1[0].#subform[0].VAClaimNumber_IfKnown[0]',   type: 'text' },
  otherNames:   { pdfFieldName: 'form1[0].#subform[0].Other_Names_Used_During_Military_Service[0]', type: 'text' },
  serviceNumber:{ pdfFieldName: 'form1[0].#subform[0].ServiceNumber[0]',           type: 'text' },

  // Raw wizard fields folded into combined keys above — no direct PDF fields
  firstName:  [],
  middleName: [],
  lastName:   [],
  suffix:     [],
  ssn:        [],

  // ── Contact — combined address & phone (raw parts not written directly) ───
  fullAddress:    { pdfFieldName: 'form1[0].#subform[0].Address_NumberandStreetorRuralRoute_City_or_PO_State_ZIPCode[0]', type: 'text' },
  phoneFormatted: { pdfFieldName: 'form1[0].#subform[0].TelephoneNumber[0]', type: 'text' },
  email:          { pdfFieldName: 'form1[0].#subform[0].Email[0]',           type: 'text' },

  // Raw address parts folded into fullAddress above — no direct PDF fields
  street:       [],
  apt:          [],
  city:         [],
  state:        [],
  zip:          [],
  daytimePhone: [],

  // ── Loan Purpose — RadioButtonList[8], draw-check per option ──────────────
  // PDF options at p=0 cy=168:
  //   cx=36.8  → ENTITLEMENT INQUIRY ONLY (no wizard value)
  //   cx=168.8 → PURCHASE A HOME         (wizard 'Purchase')
  //   cx=270.8 → CASH-OUT REFINANCE      (wizard 'CashOutRefi')
  //   cx=384.8 → INTEREST RATE REDUCTION REFINANCE LOAN (wizard 'IRRRL')
  loanPurpose: [
    {
      pdfFieldName: 'form1[0].#subform[0].RadioButtonList[8]',
      type: 'draw-check',
      checkPage: 0,
      checkCX: 168.8,
      checkCY: 168.0,
      transform: (v) => v === 'Purchase' ? 'true' : '',
    },
    {
      pdfFieldName: 'form1[0].#subform[0].RadioButtonList[8]',
      type: 'draw-check',
      checkPage: 0,
      checkCX: 270.8,
      checkCY: 168.0,
      transform: (v) => v === 'CashOutRefi' ? 'true' : '',
    },
    {
      pdfFieldName: 'form1[0].#subform[0].RadioButtonList[8]',
      type: 'draw-check',
      checkPage: 0,
      checkCX: 384.8,
      checkCY: 168.0,
      transform: (v) => v === 'IRRRL' ? 'true' : '',
    },
    // 'ManufacturedHome' and 'NADL' have no corresponding option on this PDF
  ],

  // Property address written to the Remarks section on page 2
  propertyAddress: { pdfFieldName: 'form1[0].#subform[1].Remarks[0]', type: 'text' },

  // ── Prior use / entitlement — Yes/No draw-checks ─────────────────────────
  // RadioButtonList[1] p=0 cx=414.8 cy=630/618 — "Have you used VA loan entitlement before?"
  priorUse: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'draw-check', checkPage: 0, checkCX: 414.8, checkCY: 630.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'draw-check', checkPage: 0, checkCX: 414.8, checkCY: 618.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  // RadioButtonList[5] p=0 cx=36.8 cy=138/126 — "Was entitlement restored?"
  entitlementRestored: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[5]', type: 'draw-check', checkPage: 0, checkCX: 36.8, checkCY: 138.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[5]', type: 'draw-check', checkPage: 0, checkCX: 36.8, checkCY: 126.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  // RadioButtonList[6] p=0 cx=264.8 cy=138/126 — "Do you still own the prior home?"
  stillOwnPriorHome: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[6]', type: 'draw-check', checkPage: 0, checkCX: 264.8, checkCY: 138.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[6]', type: 'draw-check', checkPage: 0, checkCX: 264.8, checkCY: 126.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],

  // ── Active Duty — RadioButtonList[0] options ['1','2'], p=0 cx=36.8 ────────
  onActiveDuty: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[0]', type: 'draw-check', checkPage: 0, checkCX: 36.8, checkCY: 480.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[0]', type: 'draw-check', checkPage: 0, checkCX: 36.8, checkCY: 468.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  expectedSeparation: [],

  // ── Military Service — Active Duty Period 1 (Item 11A, row 1) ────────────
  service1Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11A1[0]',   type: 'text' },
  service1Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11A1[0]',        type: 'text', transform: formatDateString },
  service1Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11A1[0]',      type: 'text', transform: formatDateString },
  service1Discharge: [],   // TypeOfDischarge is XFA-only; not in AcroForm layer

  // ── Military Service — Active Duty Period 2 (Item 11A, row 2) ────────────
  service2Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11A2[0]',   type: 'text' },
  service2Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11A2[0]',        type: 'text', transform: formatDateString },
  service2Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11A2[0]',      type: 'text', transform: formatDateString },
  service2Discharge: [],

  // ── Military Service — Active Duty Period 3 (Item 11A, row 3) ────────────
  service3Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11A3[0]',   type: 'text' },
  service3Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11A3[0]',        type: 'text', transform: formatDateString },
  service3Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11A3[0]',      type: 'text', transform: formatDateString },
  service3Discharge: [],

  // ── Military Service — Active Duty Period 4 (Item 11A, row 4) ────────────
  service4Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11A4[0]',   type: 'text' },
  service4Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11A4[0]',        type: 'text', transform: formatDateString },
  service4Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11A4[0]',      type: 'text', transform: formatDateString },
  service4Discharge: [],

  // ── National Guard / Reserve — Period 1 (Item 11B, row 1) ────────────────
  hadGuardReserveService: [],   // wizard gate question — no PDF field
  guardService1Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11B1[0]', type: 'text' },
  guardService1Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11B1[0]',     type: 'text', transform: formatDateString },
  guardService1Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11B1[0]',   type: 'text', transform: formatDateString },

  // ── National Guard / Reserve — Period 2 (Item 11B, row 2) ────────────────
  guardService2Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11B2[0]', type: 'text' },
  guardService2Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11B2[0]',     type: 'text', transform: formatDateString },
  guardService2Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11B2[0]',   type: 'text', transform: formatDateString },

  // ── National Guard / Reserve — Period 3 (Item 11B, row 3) ────────────────
  guardService3Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11B3[0]', type: 'text' },
  guardService3Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11B3[0]',     type: 'text', transform: formatDateString },
  guardService3Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11B3[0]',   type: 'text', transform: formatDateString },

  // ── National Guard / Reserve — Period 4 (Item 11B, row 4) ────────────────
  guardService4Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11B4[0]', type: 'text' },
  guardService4Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11B4[0]',     type: 'text', transform: formatDateString },
  guardService4Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11B4[0]',   type: 'text', transform: formatDateString },

  // ── Prior VA Loans (Item 14) — Loan 1 ────────────────────────────────────
  // Three Yes/No radios side-by-side at p=0 cy=420/408:
  //   RadioButtonList[2] cx=36.8  — "Have you ever had a VA home loan?"
  //   RadioButtonList[3] cx=204.8 — "Was the loan paid in full?"
  //   RadioButtonList[4] cx=372.8 — "Was the property sold?"
  hadPriorLoan: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[2]', type: 'draw-check', checkPage: 0, checkCX: 36.8,  checkCY: 420.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[2]', type: 'draw-check', checkPage: 0, checkCX: 36.8,  checkCY: 408.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  priorLoanAddress: { pdfFieldName: 'form1[0].#subform[0].COMPLETE_ADDRESS14[0]',  type: 'text' },
  priorLoanNumber:  { pdfFieldName: 'form1[0].#subform[0].LOAN_NUMBER14[0]',        type: 'text' },
  priorLoanAmount:  [],   // No dedicated amount field in AcroForm layer
  priorLoanDate:    { pdfFieldName: 'form1[0].#subform[0].DATE_OF_LOAN14[0]',       type: 'text' },
  priorLoanPaidOff: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[3]', type: 'draw-check', checkPage: 0, checkCX: 204.8, checkCY: 420.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[3]', type: 'draw-check', checkPage: 0, checkCX: 204.8, checkCY: 408.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  priorPropertySold: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[4]', type: 'draw-check', checkPage: 0, checkCX: 372.8, checkCY: 420.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[4]', type: 'draw-check', checkPage: 0, checkCX: 372.8, checkCY: 408.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  // RadioButtonList[7] — Type of restoration requested for Loan 1 (4 options at cx=366.8, cy=84/72/60/48)
  restorationType: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[7]', type: 'draw-check', checkPage: 0, checkCX: 366.8, checkCY: 84.0, transform: (v) => v === 'Inquiry'           ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[7]', type: 'draw-check', checkPage: 0, checkCX: 366.8, checkCY: 72.0, transform: (v) => v === 'CashOutRestoration' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[7]', type: 'draw-check', checkPage: 0, checkCX: 366.8, checkCY: 60.0, transform: (v) => v === 'IRRRLRestoration'    ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[7]', type: 'draw-check', checkPage: 0, checkCX: 366.8, checkCY: 48.0, transform: (v) => v === 'OneTimeRestoration'  ? 'true' : '' },
  ],

  // ── Prior VA Loans — Loan 2 (page 2) ─────────────────────────────────────
  hadPriorLoan2:    [],   // wizard gate — no direct PDF field
  priorLoan2Address: { pdfFieldName: 'form1[0].#subform[1].COMPLETE_ADDRESS15[0]', type: 'text' },
  priorLoan2Number:  { pdfFieldName: 'form1[0].#subform[1].LOAN_NUMBER15[0]',      type: 'text' },
  priorLoan2Date:    { pdfFieldName: 'form1[0].#subform[1].DATE_OF_LOAN15[0]',     type: 'text' },
  // RadioButtonList[10] — Type of restoration for Loan 2 (cx=366.8, cy=726/714/702/690 on p=1)
  restorationType2: [
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[10]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 726.0, transform: (v) => v === 'Inquiry'           ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[10]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 714.0, transform: (v) => v === 'CashOutRestoration' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[10]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 702.0, transform: (v) => v === 'IRRRLRestoration'    ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[10]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 690.0, transform: (v) => v === 'OneTimeRestoration'  ? 'true' : '' },
  ],

  // ── Prior VA Loans — Loan 3 (page 2) ─────────────────────────────────────
  hadPriorLoan3:    [],   // wizard gate — no direct PDF field
  priorLoan3Address: { pdfFieldName: 'form1[0].#subform[1].COMPLETE_ADDRESS16[0]', type: 'text' },
  priorLoan3Number:  { pdfFieldName: 'form1[0].#subform[1].LOAN_NUMBER16[0]',      type: 'text' },
  priorLoan3Date:    { pdfFieldName: 'form1[0].#subform[1].DATE_OF_LOAN16[0]',     type: 'text' },
  // RadioButtonList[11] — Type of restoration for Loan 3 (cx=366.8, cy=660/648/636/624 on p=1)
  restorationType3: [
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[11]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 660.0, transform: (v) => v === 'Inquiry'           ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[11]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 648.0, transform: (v) => v === 'CashOutRestoration' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[11]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 636.0, transform: (v) => v === 'IRRRLRestoration'    ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[1].RadioButtonList[11]', type: 'draw-check', checkPage: 1, checkCX: 366.8, checkCY: 624.0, transform: (v) => v === 'OneTimeRestoration'  ? 'true' : '' },
  ],

  // ── Certification & Signature ─────────────────────────────────────────────
  // privacyAct is a wizard checkbox — no corresponding PDF field
  privacyAct: [],

  // Signature image drawn over the TextField at p=1 cx=222 cy=204 w=384 h=12
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
