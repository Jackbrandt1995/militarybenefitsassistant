import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va220803Mapping: FieldMapping = {
  // fullName / cityStateZip are computed by computeAnswers in the form definition
  fullName: { pdfFieldName: 'F[0].Page_1[0].nameapp[0]', type: 'text' },
  address: { pdfFieldName: 'F[0].Page_1[0].mailing[0]', type: 'text' },
  // telephone[1] is mislabeled in the PDF but is actually the city/state/zip line
  cityStateZip: { pdfFieldName: 'F[0].Page_1[0].telephone[1]', type: 'text' },
  homePhone:   { pdfFieldName: 'F[0].Page_1[0].telephone[0]', type: 'text' },
  mobilePhone: { pdfFieldName: 'F[0].Page_1[0].telephone[2]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'F[0].Page_1[0].VAFile[0]', type: 'text' },

  // 6A – have you previously applied for VA education benefits?
  previouslyApplied: [
    { pdfFieldName: 'F[0].Page_1[0].yes6a[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].no6a[0]',  type: 'checkbox', transform: v => v === 'No'  ? 'true' : 'false' },
  ],

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

  // Signature image overlay; date uses the AcroForm field DatelastAttendance[0]
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 0, imageX: 36, imageY: 69, imageWidth: 230, imageHeight: 20 },
  ],
  signatureDate: [
    { pdfFieldName: 'F[0].Page_1[0].DatelastAttendance[0]', type: 'text', transform: formatDateString },
  ],
};
