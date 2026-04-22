import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va220803Mapping: FieldMapping = {
  // Applicant – name maps to combined PDF name field
  firstName: { pdfFieldName: 'F[0].Page_1[0].nameapp[0]', type: 'text' },
  address: { pdfFieldName: 'F[0].Page_1[0].mailing[0]', type: 'text' },
  homePhone: { pdfFieldName: 'F[0].Page_1[0].telephone[0]', type: 'text' },
  homePhoneNone:   { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 510, checkSize: 6 },
  mobilePhoneNone: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 493, checkSize: 6 },
  vaFileNumber: { pdfFieldName: 'F[0].Page_1[0].VAFile[0]', type: 'text' },

  // Benefit chapter checkboxes (driven by benefitProgram radio)
  benefitProgram: [
    { pdfFieldName: 'F[0].Page_1[0].box1[0]', type: 'checkbox', transform: v => v === 'chapter30' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].box2[0]', type: 'checkbox', transform: v => v === 'chapter32' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].box3[0]', type: 'checkbox', transform: v => v === 'chapter33' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].box4[0]', type: 'checkbox', transform: v => v === 'chapter35' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].box5[0]', type: 'checkbox', transform: v => v === 'chapter1606' ? 'true' : 'false' },
  ],

  // Tests (up to 3 in the updated wizard; mapping supports 4)
  test1Name: { pdfFieldName: 'F[0].Page_1[0].NameTest1[0]', type: 'text' },
  test1Date: { pdfFieldName: 'F[0].Page_1[0].DateTest1[0]', type: 'text' },
  test1Result: { pdfFieldName: 'F[0].Page_1[0].TestResults1[0]', type: 'text' },
  test1Cost: { pdfFieldName: 'F[0].Page_1[0].CostTest1[0]', type: 'text' },
  test1Org: { pdfFieldName: 'F[0].Page_1[0].CompleteName1[0]', type: 'text' },

  test2Name: { pdfFieldName: 'F[0].Page_1[0].NameTest2[0]', type: 'text' },
  test2Date: { pdfFieldName: 'F[0].Page_1[0].DateTest2[0]', type: 'text' },
  test2Result: { pdfFieldName: 'F[0].Page_1[0].TestResults2[0]', type: 'text' },
  test2Cost: { pdfFieldName: 'F[0].Page_1[0].CostTest2[0]', type: 'text' },
  test2Org: { pdfFieldName: 'F[0].Page_1[0].CompleteName2[0]', type: 'text' },

  test3Name: { pdfFieldName: 'F[0].Page_1[0].NameTest3[0]', type: 'text' },
  test3Date: { pdfFieldName: 'F[0].Page_1[0].DateTest3[0]', type: 'text' },
  test3Result: { pdfFieldName: 'F[0].Page_1[0].TestResults3[0]', type: 'text' },
  test3Cost: { pdfFieldName: 'F[0].Page_1[0].CostTest3[0]', type: 'text' },
  test3Org: { pdfFieldName: 'F[0].Page_1[0].CompleteName3[0]', type: 'text' },

  remarks: { pdfFieldName: 'F[0].Page_1[0].Remarks[0]', type: 'text' },

  // Signature image overlay + draw-text date fallback
  // Sig area is XFA-only; field DatelastAttendance lands near y=73 on page 0.
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 0, imageX: 36, imageY: 69, imageWidth: 230, imageHeight: 20 },
  ],
  signatureDate: [
    { pdfFieldName: 'DRAW_TEXT_DATE', type: 'draw-text', transform: formatDateString, textPage: 0, textX: 454, textY: 75, textSize: 10 },
  ],
};
