import type { FieldMapping } from '../fillPdf';

export const va225490Mapping: FieldMapping = {
  // Applicant - Page 1
  name: { pdfFieldName: 'form1[0].Page_1[0].NAME[0]', type: 'text' },
  ssn: { pdfFieldName: 'form1[0].Page_1[0].SSN[0]', type: 'text' },
  dob: { pdfFieldName: 'form1[0].Page_1[0].DOB[0]', type: 'text' },
  address: { pdfFieldName: 'form1[0].Page_1[0].address[0]', type: 'text' },
  homePhone: { pdfFieldName: 'form1[0].Page_1[0].PrimaryTelephone[0]', type: 'text' },
  mobilePhone: { pdfFieldName: 'form1[0].Page_1[0].SecondaryTelephone[0]', type: 'text' },
  email: { pdfFieldName: 'form1[0].Page_1[0].EMAIL[0]', type: 'text' },

  // Qualifying Individual
  qiName: { pdfFieldName: 'form1[0].Page_1[0].Name[1]', type: 'text' },
  qiSSN: { pdfFieldName: 'form1[0].Page_1[0].SocialSecurityNumber[1]', type: 'text' },
  qiBranch: { pdfFieldName: 'form1[0].Page_1[0].BranchService[0]', type: 'text' },
  qiDOB: { pdfFieldName: 'form1[0].Page_1[0].DOB2[0]', type: 'text' },
  qiDateMIA: { pdfFieldName: 'form1[0].Page_1[0].DateListed[0]', type: 'text' },
  qiDateOfDeath: { pdfFieldName: 'form1[0].Page_1[0].DateofDeath[0]', type: 'text' },

  // Benefit type - Page 2
  benefit_DEA: { pdfFieldName: 'form1[0].Page_2[0].CheckBox_Chapter35DEA[0]', type: 'checkbox' },
  benefit_Fry: { pdfFieldName: 'form1[0].Page_2[0].CheckBox_Chapter33_FRYScholarship[0]', type: 'checkbox' },

  // Service Periods - Page 3
  sp1Entered: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].DateEntered[0]', type: 'text' },
  sp1Separated: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].DateEntered[1]', type: 'text' },
  sp1Branch: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].BranchReserveGuard1[0]', type: 'text' },
  sp1Discharge: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].characterdischarge1[0]', type: 'text' },
};
