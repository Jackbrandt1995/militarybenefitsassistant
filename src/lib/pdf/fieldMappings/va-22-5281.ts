import type { FieldMapping } from '../fillPdf';

export const va225281Mapping: FieldMapping = {
  name: { pdfFieldName: 'F[0].Page_1[0].NAMEOFAPPLICANT[0]', type: 'text' },
  address: { pdfFieldName: 'F[0].Page_1[0].MailingAddress[0]', type: 'text' },
  ssn: { pdfFieldName: 'F[0].Page_1[0].SSN[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'F[0].Page_1[0].VAFILENO\\.Ifapplicable[0]', type: 'text' },
  branch: { pdfFieldName: 'F[0].Page_1[0].BRANCHOFSERVICE[0]', type: 'text' },
  phone: { pdfFieldName: 'F[0].Page_1[0].PHONENUBMER[0]', type: 'text' },
  email: { pdfFieldName: 'F[0].Page_1[0].c\\.EMAILADDRESS[0]', type: 'text' },
  otherReason: { pdfFieldName: 'F[0].Page_1[0].D\\.OTHERSpecify[0]', type: 'text' },
  dateFrom: { pdfFieldName: 'F[0].Page_1[0].DateFrom[0]', type: 'text' },
};
