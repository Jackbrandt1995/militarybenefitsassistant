import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va220810Mapping: FieldMapping = {
  // Applicant – firstName maps to combined PDF name field
  firstName: { pdfFieldName: 'F[0].Page_1[0].ApplicantsName[0]', type: 'text' },
  address: { pdfFieldName: 'F[0].Page_1[0].Address[0]', type: 'text' },
  ssn: { pdfFieldName: 'F[0].Page_1[0].SSN[0]', type: 'text' },
  daytimePhone: { pdfFieldName: 'F[0].Page_1[0].DaytimePhone[0]', type: 'text' },
  eveningPhone: { pdfFieldName: 'F[0].Page_1[0].EveningPhone[0]', type: 'text' },
  daytimePhoneNone: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 510, checkSize: 6 },
  eveningPhoneNone: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 493, checkSize: 6 },
  vaFileNumber: { pdfFieldName: 'F[0].Page_1[0].VAFileNumber[0]', type: 'text' },

  // Benefit chapter checkboxes (driven by benefitProgram radio)
  benefitProgram: [
    { pdfFieldName: 'F[0].Page_1[0].box_ch33[0]', type: 'checkbox', transform: v => v === 'chapter33' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].box_ch30[0]', type: 'checkbox', transform: v => v === 'chapter30' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].box_ch32[0]', type: 'checkbox', transform: v => v === 'chapter32' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].box_ch35[0]', type: 'checkbox', transform: v => v === 'chapter35' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].box_ch1606[0]', type: 'checkbox', transform: v => v === 'chapter1606' ? 'true' : 'false' },
  ],

  // Exam
  examName: { pdfFieldName: 'F[0].Page_1[0].NameOfExam[0]', type: 'text' },
  examDate: { pdfFieldName: 'F[0].Page_1[0].DateExamTaken[0]', type: 'text' },
  organization: { pdfFieldName: 'F[0].Page_1[0].Organization[0]', type: 'text' },
  examCost: { pdfFieldName: 'F[0].Page_1[0].ItemizeExamCost[0]', type: 'text' },
  remarks: { pdfFieldName: 'F[0].Page_1[0].Remarks[0]', type: 'text' },

  // Signature image overlay + draw-text date fallback
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 0, imageX: 36, imageY: 80, imageWidth: 230, imageHeight: 50 },
  ],
  signatureDate: [
    { pdfFieldName: 'DRAW_TEXT_DATE', type: 'draw-text', transform: formatDateString, textPage: 0, textX: 370, textY: 88, textSize: 10 },
  ],
};
