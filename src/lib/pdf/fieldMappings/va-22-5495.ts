import type { FieldMapping } from '../fillPdf';

export const va225495Mapping: FieldMapping = {
  // Applicant - Page 1
  name: { pdfFieldName: 'form1[0].Page_1[0].NameOfApplicant[0]', type: 'text' },
  ssn: { pdfFieldName: 'form1[0].Page_1[0].SSN[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'form1[0].Page_1[0].VAFILENUMBER[0]', type: 'text' },
  primaryPhone: { pdfFieldName: 'form1[0].Page_1[0].PrimaryPhone[0]', type: 'text' },
  secondaryPhone: { pdfFieldName: 'form1[0].Page_1[0].SecondaryPhone[0]', type: 'text' },
  email: { pdfFieldName: 'form1[0].Page_1[0].APPLICANTSE-MAILADDRESS[0]', type: 'text' },

  // Direct Deposit
  bankName: { pdfFieldName: 'form1[0].Page_1[0].NameOfFinancialInstitution[0]', type: 'text' },
  routingNumber: { pdfFieldName: 'form1[0].Page_1[0].RoutingOrTransitNumber[0]', type: 'text' },
  accountNumber: { pdfFieldName: 'form1[0].Page_1[0].acctnumber[0]', type: 'text' },

  // Emergency Contact
  emergencyName: { pdfFieldName: 'form1[0].Page_1[0].NameofSomeone[0]', type: 'text' },
  emergencyAddress: { pdfFieldName: 'form1[0].Page_1[0].AddressofSomeone[0]', type: 'text' },

  // Qualifying Individual
  qiName: { pdfFieldName: 'form1[0].Page_1[0].NameofVeteran[0]', type: 'text' },
  qiSSN: { pdfFieldName: 'form1[0].Page_1[0].SSN2[0]', type: 'text' },
  qiBranch: { pdfFieldName: 'form1[0].Page_1[0].BRANCHOFSERVICE[0]', type: 'text' },

  // Program Change - Page 2
  educationGoal: { pdfFieldName: 'form1[0].Page_2[0].specifyeducation[0]', type: 'text' },
  programName: { pdfFieldName: 'form1[0].Page_2[0].whatisname[0]', type: 'text' },
  newSchool: { pdfFieldName: 'form1[0].Page_2[0].ifchanging1[0]', type: 'text' },
  oldSchool: { pdfFieldName: 'form1[0].Page_2[0].ifchanging[0]', type: 'text' },
  whyStopped: { pdfFieldName: 'form1[0].Page_2[0].tessuswhen[0]', type: 'text' },
  remarks: { pdfFieldName: 'form1[0].Page_2[0].remarks27[0]', type: 'text' },
};
