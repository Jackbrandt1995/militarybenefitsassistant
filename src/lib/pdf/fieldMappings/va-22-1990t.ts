import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va221990tMapping: FieldMapping = {
  // Applicant – split name fields
  applicantFirstName: { pdfFieldName: 'form1[0].#subform[0].firstname1[0]', type: 'text' },
  applicantMI: { pdfFieldName: 'form1[0].#subform[0].mi1[0]', type: 'text' },
  applicantLastName: { pdfFieldName: 'form1[0].#subform[0].lastname1[0]', type: 'text' },
  ssn: [
    { pdfFieldName: 'form1[0].#subform[0].#area[1].ssna1[0]', type: 'text', transform: v => v.replace(/\D/g, '').slice(0, 3) },
    { pdfFieldName: 'form1[0].#subform[0].#area[1].ssna2[0]', type: 'text', transform: v => v.replace(/\D/g, '').slice(3, 5) },
    { pdfFieldName: 'form1[0].#subform[0].#area[1].ssna3[0]', type: 'text', transform: v => v.replace(/\D/g, '').slice(5) },
  ],
  dob: [
    { pdfFieldName: 'form1[0].#subform[0].#area[0].dateofbirth1[0]', type: 'text', transform: v => v ? v.split('-')[1] || '' : '' },
    { pdfFieldName: 'form1[0].#subform[0].#area[0].dateofbirth2[0]', type: 'text', transform: v => v ? v.split('-')[2] || '' : '' },
    { pdfFieldName: 'form1[0].#subform[0].#area[0].dateofbirth3[0]', type: 'text', transform: v => v ? v.split('-')[0] || '' : '' },
  ],
  sex: [
    { pdfFieldName: 'form1[0].#subform[0].MALE[0]', type: 'checkbox', transform: v => v === 'Male' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].FEMALE[0]', type: 'checkbox', transform: v => v === 'Female' ? 'true' : 'false' },
  ],
  vaFileNumber: { pdfFieldName: 'form1[0].#subform[0].filenumber[0]', type: 'text' },

  // Item 2 – NAME OF VETERAN (if other than applicant): second name row (y=677).
  veteranFirstName: { pdfFieldName: 'form1[0].#subform[0].firstname2[0]', type: 'text' },
  veteranMI: { pdfFieldName: 'form1[0].#subform[0].mi2[0]', type: 'text' },
  veteranLastName: { pdfFieldName: 'form1[0].#subform[0].lastname2[0]', type: 'text' },

  // Item 3 – MAILING ADDRESS. NOTE: the PDF's internal field names are misleading;
  // mapped here by the printed label each cell actually sits under (top→bottom):
  //   mailingaddress[0] (y=636) = NUMBER AND STREET OR RURAL ROUTE -> street
  //   numberandstreet[0] (y=606) = APARTMENT OR BOX NUMBER         -> apt
  //   apartment[0]      (y=576) = CITY OR POST OFFICE              -> city
  //   state[0]/zip5[0]  (y=548) = STATE / ZIP CODE                 -> state/zip
  address: { pdfFieldName: 'form1[0].#subform[0].mailingaddress[0]', type: 'text' },
  apt: { pdfFieldName: 'form1[0].#subform[0].numberandstreet[0]', type: 'text' },
  city: { pdfFieldName: 'form1[0].#subform[0].apartment[0]', type: 'text' },
  stateField: { pdfFieldName: 'form1[0].#subform[0].state[0]', type: 'text' },
  zip: { pdfFieldName: 'form1[0].#subform[0].zip5[0]', type: 'text' },
  applicantEmail: { pdfFieldName: 'form1[0].#subform[0].EMAIL13c[0]', type: 'text' },

  // Course Info
  courseName: { pdfFieldName: 'form1[0].#subform[0].COURSENAME[0]', type: 'text' },
  creditHours: { pdfFieldName: 'form1[0].#subform[0].CREDIT8[0]', type: 'text' },
  educationalGoal: { pdfFieldName: 'form1[0].#subform[0].FINAL9[0]', type: 'text' },
  tutorInfo: { pdfFieldName: 'form1[0].#subform[0].NAME11[0]', type: 'text' },
  tutoringSubjects: { pdfFieldName: 'form1[0].#subform[0].UNIT10[0]', type: 'text' },

  // Sessions 1–3 (updated to match new field IDs)
  session1Month: { pdfFieldName: 'form1[0].#subform[0].MONTHANDYEAR1[0]', type: 'text' },
  session1Dates: { pdfFieldName: 'form1[0].#subform[0].EXACTDATES1[0]', type: 'text' },
  session1Hours: { pdfFieldName: 'form1[0].#subform[0].HOURSNO1[0]', type: 'text' },
  session1Rate: { pdfFieldName: 'form1[0].#subform[0].CHARGE1[0]', type: 'text' },
  session1Total: { pdfFieldName: 'form1[0].#subform[0].TOTALCHARGES1[0]', type: 'text' },
  session2Month: { pdfFieldName: 'form1[0].#subform[0].MONTHANDYEAR2[0]', type: 'text' },
  session2Dates: { pdfFieldName: 'form1[0].#subform[0].EXACTDATES2[0]', type: 'text' },
  session2Hours: { pdfFieldName: 'form1[0].#subform[0].HOURSNO2[0]', type: 'text' },
  session2Rate: { pdfFieldName: 'form1[0].#subform[0].CHARGE2[0]', type: 'text' },
  session2Total: { pdfFieldName: 'form1[0].#subform[0].TOTALCHARGES2[0]', type: 'text' },
  session3Month: { pdfFieldName: 'form1[0].#subform[0].MONTHANDYEAR3[0]', type: 'text' },
  session3Dates: { pdfFieldName: 'form1[0].#subform[0].EXACTDATES3[0]', type: 'text' },
  session3Hours: { pdfFieldName: 'form1[0].#subform[0].HOURSNO3[0]', type: 'text' },
  session3Rate: { pdfFieldName: 'form1[0].#subform[0].CHARGE3[0]', type: 'text' },
  session3Total: { pdfFieldName: 'form1[0].#subform[0].TOTALCHARGES3[0]', type: 'text' },
  totalPaymentDue: { pdfFieldName: 'form1[0].#subform[0].F\\.TOTALPAYMENTDUE[0]', type: 'text' },

  // School Certification
  schoolNameAddress: { pdfFieldName: 'form1[0].#subform[0].NAMEADDRESS15[0]', type: 'text' },
  // Item 16 "INDICATE TYPE OF SCHOOL": three individually-named checkboxes, left→right:
  //   SCHOOL1 = FOUR-YEAR COLLEGE, SCHOOL2 = TWO-YEAR COLLEGE, SCHOOL3 = OTHER THAN COLLEGE
  schoolType: [
    { pdfFieldName: 'form1[0].#subform[0].SCHOOL1[0]', type: 'checkbox', transform: v => v === 'fourYear' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].SCHOOL2[0]', type: 'checkbox', transform: v => v === 'twoYear' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].SCHOOL3[0]', type: 'checkbox', transform: v => v === 'other' ? 'true' : 'false' },
  ],

  // Section 13 is the student/veteran certification (applicant signature).
  // AcroForm fields: SIG13A[0] page=0 x=32 y=315 w=259 h=13
  //                  DATESIGNED13B[0] page=0 x=298 y=314
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 0, imageX: 32, imageY: 311, imageWidth: 230, imageHeight: 18 },
  ],
  signatureDate: [
    { pdfFieldName: 'form1[0].#subform[0].DATESIGNED13B[0]', type: 'text', transform: formatDateString },
  ],
};
