import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va220810Mapping: FieldMapping = {
  // fullName / cityStateZip are computed by computeAnswers in the form definition
  fullName: { pdfFieldName: 'F[0].Page_1[0].ApplicantsName[0]', type: 'text' },
  address: { pdfFieldName: 'F[0].Page_1[0].Address[0]', type: 'text' },
  // Address[1] is the city/state/zip line directly below the street address
  cityStateZip: { pdfFieldName: 'F[0].Page_1[0].Address[1]', type: 'text' },
  ssn: { pdfFieldName: 'F[0].Page_1[0].SSN[0]', type: 'text' },
  daytimePhone: { pdfFieldName: 'F[0].Page_1[0].DaytimePhone[0]', type: 'text' },
  eveningPhone: { pdfFieldName: 'F[0].Page_1[0].EveningPhone[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'F[0].Page_1[0].VAFileNumber[0]', type: 'text' },

  // 6A – have you previously applied for VA education benefits? (draw-check: unnamed checkboxes)
  previouslyApplied: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 0, checkCX: 40, checkCY: 487, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 0, checkCX: 40, checkCY: 475, checkSize: 6 },
  ],

  // Benefit chapter – unnamed checkboxes in the PDF; use draw-check at confirmed coords
  benefitProgram: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'chapter33'   ? 'true' : '', checkPage: 0, checkCX: 40, checkCY: 408, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'chapter30'   ? 'true' : '', checkPage: 0, checkCX: 40, checkCY: 396, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'chapter32'   ? 'true' : '', checkPage: 0, checkCX: 40, checkCY: 384, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'chapter35'   ? 'true' : '', checkPage: 0, checkCX: 40, checkCY: 372, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'chapter1606' ? 'true' : '', checkPage: 0, checkCX: 40, checkCY: 360, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'ncs'         ? 'true' : '', checkPage: 0, checkCX: 40, checkCY: 348, checkSize: 6 },
  ],

  // Exam
  examName: { pdfFieldName: 'F[0].Page_1[0].NameOfExam[0]', type: 'text' },
  examDate: { pdfFieldName: 'F[0].Page_1[0].DateExamTaken[0]', type: 'text', transform: formatDateString },
  organization: { pdfFieldName: 'F[0].Page_1[0].Organization[0]', type: 'text' },
  examCost: { pdfFieldName: 'F[0].Page_1[0].ItemizeExamCost[0]', type: 'text' },
  remarks: { pdfFieldName: 'F[0].Page_1[0].Remarks[0]', type: 'text' },

  // AcroForm fields confirmed: Signature1[0] page=0 x=36 y=102 w=396 h=12
  //                            DateSigned[0] page=0 x=444 y=102
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 0, imageX: 36, imageY: 98, imageWidth: 230, imageHeight: 20 },
  ],
  signatureDate: [
    { pdfFieldName: 'F[0].Page_1[0].DateSigned[0]', type: 'text', transform: formatDateString },
  ],
};
