import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va220803Mapping: FieldMapping = {
  // fullName / fullAddress are computed by computeAnswers in the form definition
  fullName:    { pdfFieldName: 'F[0].Page_1[0].nameapp[0]', type: 'text' },
  // mailing[0] holds the full address line (street, city, state, zip)
  fullAddress: { pdfFieldName: 'F[0].Page_1[0].mailing[0]', type: 'text' },
  // Item 5 TELEPHONE NUMBER widgets (verified by widget rects vs printed MOBILE/HOME labels):
  //   telephone[2] @ y=473 = MOBILE line (upper); telephone[0] @ y=457 = HOME line (lower);
  //   telephone[1] @ y=517 (right of mailing block) = Item 3 EMAIL ADDRESS.
  mobilePhone: { pdfFieldName: 'F[0].Page_1[0].telephone[2]', type: 'text' },
  email:       { pdfFieldName: 'F[0].Page_1[0].telephone[1]', type: 'text' },
  homePhone:   { pdfFieldName: 'F[0].Page_1[0].telephone[0]', type: 'text' },
  // ssn: VA-22-0803 has NO Social Security Number cell — only Item 4 VA FILE NUMBER.
  //   SSN is intentionally left UNMAPPED (no benign PDF field exists for it).
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

  // Tests (up to 3 in the wizard). Item 9 (Date + Results) field names were SCRAMBLED by the
  // XFA flatten: the Date column reads top->bottom DateTest1, DateTest4, DateTest3, DateTest2
  // and the Results column reads TestResults4, TestResults3, TestResults2, TestResults1.
  // To keep each test's Date and Result on the SAME visual row, test1=row1, test2=row2, test3=row3:
  //   row1: DateTest1[0] + TestResults4[0]
  //   row2: DateTest4[0] + TestResults3[0]
  //   row3: DateTest3[0] + TestResults2[0]
  // (Name item7, Org item8, Cost item10 are already slot-consistent: NameTestN/CompleteNameN/CostTestN.)
  test1Name: { pdfFieldName: 'F[0].Page_1[0].NameTest1[0]', type: 'text' },
  test1Date: { pdfFieldName: 'F[0].Page_1[0].DateTest1[0]', type: 'text', transform: formatDateString },
  test1Result: { pdfFieldName: 'F[0].Page_1[0].TestResults4[0]', type: 'text' },
  test1Cost: { pdfFieldName: 'F[0].Page_1[0].CostTest1[0]', type: 'text' },
  test1Org: { pdfFieldName: 'F[0].Page_1[0].CompleteName1[0]', type: 'text' },

  test2Name: { pdfFieldName: 'F[0].Page_1[0].NameTest2[0]', type: 'text' },
  test2Date: { pdfFieldName: 'F[0].Page_1[0].DateTest4[0]', type: 'text', transform: formatDateString },
  test2Result: { pdfFieldName: 'F[0].Page_1[0].TestResults3[0]', type: 'text' },
  test2Cost: { pdfFieldName: 'F[0].Page_1[0].CostTest2[0]', type: 'text' },
  test2Org: { pdfFieldName: 'F[0].Page_1[0].CompleteName2[0]', type: 'text' },

  test3Name: { pdfFieldName: 'F[0].Page_1[0].NameTest3[0]', type: 'text' },
  test3Date: { pdfFieldName: 'F[0].Page_1[0].DateTest3[0]', type: 'text', transform: formatDateString },
  test3Result: { pdfFieldName: 'F[0].Page_1[0].TestResults2[0]', type: 'text' },
  test3Cost: { pdfFieldName: 'F[0].Page_1[0].CostTest3[0]', type: 'text' },
  test3Org: { pdfFieldName: 'F[0].Page_1[0].CompleteName3[0]', type: 'text' },

  remarks: { pdfFieldName: 'F[0].Page_1[0].Remarks[0]', type: 'text' },

  // Signature image overlay; date uses the AcroForm field DatelastAttendance[0]
  // imageWidth=410 spans the full signature line; imageHeight=12 matches a single line
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 0, imageX: 36, imageY: 72, imageWidth: 410, imageHeight: 12 },
  ],
  signatureDate: [
    { pdfFieldName: 'F[0].Page_1[0].DatelastAttendance[0]', type: 'text', transform: formatDateString },
  ],
};
