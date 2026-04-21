import type { FieldMapping } from '../fillPdf';

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
  address: { pdfFieldName: 'form1[0].#subform[0].mailingaddress[0]', type: 'text' },
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
  schoolType: [
    { pdfFieldName: 'form1[0].#subform[0].FOURYR[0]', type: 'checkbox', transform: v => v === 'fourYear' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].TWOYR[0]', type: 'checkbox', transform: v => v === 'twoYear' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].OTHER[0]', type: 'checkbox', transform: v => v === 'other' ? 'true' : 'false' },
  ],
};
