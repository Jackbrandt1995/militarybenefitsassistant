import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va225281Mapping: FieldMapping = {
  // Item 1 NAME OF APPLICANT — "LAST, FIRST MIDDLE" derived in computeAnswers.
  applicantName: { pdfFieldName: 'F[0].Page_1[0].NAMEOFAPPLICANT[0]', type: 'text' },
  // Item 5A MAILING ADDRESS — multi-line "street\ncity, state zip" derived in computeAnswers.
  fullAddress: { pdfFieldName: 'F[0].Page_1[0].MailingAddress[0]', type: 'text' },
  ssn: { pdfFieldName: 'F[0].Page_1[0].SSN[0]', type: 'text' , transform: (v: string) => v.replace(/\D/g, '')},
  vaFileNumber: { pdfFieldName: 'F[0].Page_1[0].VAFILENO\\.Ifapplicable[0]', type: 'text' },
  branch: { pdfFieldName: 'F[0].Page_1[0].BRANCHOFSERVICE[0]', type: 'text' },
  phone: { pdfFieldName: 'F[0].Page_1[0].PHONENUBMER[0]', type: 'text' },
  email: { pdfFieldName: 'F[0].Page_1[0].c\\.EMAILADDRESS[0]', type: 'text' },

  // Refund reason — single radio group "Reason[0]" in the real PDF.
  // Wizard values (hardship/completed/vocation/other) map to the exact export options.
  refundReason: {
    pdfFieldName: 'F[0].Page_1[0].Reason[0]',
    type: 'radio',
    transform: (v: string) => {
      switch (v) {
        case 'hardship': return 'A. PERSONAL HARDSHIP';
        case 'completed': return 'B. EDUCATION COMPLETED';
        case 'vocation': return 'C. VOCATION OBTAINED';
        case 'other': return 'D. OTHER (Specify):';
        default: return '';
      }
    },
  },
  otherReason: { pdfFieldName: 'F[0].Page_1[0].D\\.OTHERSpecify[0]', type: 'text' },

  // Applicant signature/date — item 14/15 "applicants NOT on active duty"
  // certification (separated veterans). The APPLICANT line is the WIDE signature
  // with NO adjacent Title box. Confirmed via field dump:
  //   item 14 SignatureField11[4] rect x=102..450 y=294..318 (wide, w=348)
  //   item 15 DateSigned[3]        rect x=462..534 y=294..306 (center cx=498 cy=300)
  // Do NOT use SignatureField11[3]/DateSigned[4] (item 16/17 = VA CERTIFYING OFFICIAL)
  // nor SignatureField11[5]/DateSigned[6] (item 19/20 = "FOR VA USE ONLY").
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 0, imageX: 104, imageY: 296, imageWidth: 240, imageHeight: 22 },
  ],
  signatureDate: [
    { pdfFieldName: 'F[0].Page_1[0].DateSigned[3]', type: 'text', transform: formatDateString },
    { pdfFieldName: 'DRAW_TEXT_DATE', type: 'draw-text', transform: formatDateString, textPage: 0, textX: 466, textY: 298, textSize: 10 },
  ],
};
