import type { FieldMapping } from '../fillPdf';

export const va225281Mapping: FieldMapping = {
  // Applicant – firstName maps to combined name field
  firstName: { pdfFieldName: 'F[0].Page_1[0].NAMEOFAPPLICANT[0]', type: 'text' },
  address: { pdfFieldName: 'F[0].Page_1[0].MailingAddress[0]', type: 'text' },
  ssn: { pdfFieldName: 'F[0].Page_1[0].SSN[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'F[0].Page_1[0].VAFILENO\\.Ifapplicable[0]', type: 'text' },
  branch: { pdfFieldName: 'F[0].Page_1[0].BRANCHOFSERVICE[0]', type: 'text' },
  phone: { pdfFieldName: 'F[0].Page_1[0].PHONENUBMER[0]', type: 'text' },
  email: { pdfFieldName: 'F[0].Page_1[0].c\\.EMAILADDRESS[0]', type: 'text' },

  // Refund reason checkboxes (driven by refundReason radio)
  refundReason: [
    { pdfFieldName: 'F[0].Page_1[0].A\\.PersonalHardship[0]', type: 'checkbox', transform: v => v === 'hardship' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].B\\.EducationCompleted[0]', type: 'checkbox', transform: v => v === 'completed' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].C\\.VocationObtained[0]', type: 'checkbox', transform: v => v === 'vocation' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].D\\.OTHER[0]', type: 'checkbox', transform: v => v === 'other' ? 'true' : 'false' },
  ],
  otherReason: { pdfFieldName: 'F[0].Page_1[0].D\\.OTHERSpecify[0]', type: 'text' },
};
