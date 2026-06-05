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
 */

import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va261880Mapping: FieldMapping = {

  // ── Personal — combined fields (raw parts not written directly) ───────────
  fullName:     { pdfFieldName: 'form1[0].#subform[0].NameOfVeteran[0]',           type: 'text' },
  ssnFormatted: { pdfFieldName: 'form1[0].#subform[0].SSN[0]',                     type: 'text' },
  dob:          { pdfFieldName: 'form1[0].#subform[0].DateOfBirth[0]',             type: 'text', transform: formatDateString },
  vaFileNumber: { pdfFieldName: 'form1[0].#subform[0].VAClaimNumber_IfKnown[0]',   type: 'text' },

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
  expectedSeparation:[],

  // ── Military Service — Period 1 (Item 11A, row 1) ─────────────────────────
  service1Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11A1[0]',   type: 'text' },
  service1Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11A1[0]',        type: 'text', transform: formatDateString },
  service1Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11A1[0]',      type: 'text', transform: formatDateString },
  service1Discharge: { pdfFieldName: 'form1[0].#subform[0].TypeOfDischarge11A1[0]',    type: 'text' },

  // ── Military Service — Period 2 (Item 11A, row 2) ─────────────────────────
  service2Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11A2[0]',   type: 'text' },
  service2Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11A2[0]',        type: 'text', transform: formatDateString },
  service2Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11A2[0]',      type: 'text', transform: formatDateString },
  service2Discharge: { pdfFieldName: 'form1[0].#subform[0].TypeOfDischarge11A2[0]',    type: 'text' },

  // ── Military Service — Period 3 (Item 11A, row 3) ─────────────────────────
  service3Branch:    { pdfFieldName: 'form1[0].#subform[0].BranchOfService11A3[0]',   type: 'text' },
  service3Entered:   { pdfFieldName: 'form1[0].#subform[0].DateEntered11A3[0]',        type: 'text', transform: formatDateString },
  service3Separated: { pdfFieldName: 'form1[0].#subform[0].DateSeparated11A3[0]',      type: 'text', transform: formatDateString },
  service3Discharge: { pdfFieldName: 'form1[0].#subform[0].TypeOfDischarge11A3[0]',    type: 'text' },

  // ── Prior VA Loans (Item 14) ──────────────────────────────────────────────
  // Three Yes/No radios side-by-side at p=0 cy=420/408:
  //   RadioButtonList[2] cx=36.8  — "Have you ever had a VA home loan?"
  //   RadioButtonList[3] cx=204.8 — "Was the loan paid in full?"
  //   RadioButtonList[4] cx=372.8 — "Was the property sold?"
  hadPriorLoan: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[2]', type: 'draw-check', checkPage: 0, checkCX: 36.8,  checkCY: 420.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[2]', type: 'draw-check', checkPage: 0, checkCX: 36.8,  checkCY: 408.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  priorLoanAddress: { pdfFieldName: 'form1[0].#subform[0].COMPLETE_ADDRESS14[0]',  type: 'text' },
  priorLoanAmount:  [],   // No dedicated amount field found in PDF
  priorLoanDate:    { pdfFieldName: 'form1[0].#subform[0].DATE_OF_LOAN14[0]',      type: 'text' },
  priorLoanPaidOff: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[3]', type: 'draw-check', checkPage: 0, checkCX: 204.8, checkCY: 420.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[3]', type: 'draw-check', checkPage: 0, checkCX: 204.8, checkCY: 408.0, transform: (v) => v === 'No'  ? 'true' : '' },
  ],
  priorPropertySold: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[4]', type: 'draw-check', checkPage: 0, checkCX: 372.8, checkCY: 420.0, transform: (v) => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[4]', type: 'draw-check', checkPage: 0, checkCX: 372.8, checkCY: 408.0, transform: (v) => v === 'No'  ? 'true' : '' },
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
