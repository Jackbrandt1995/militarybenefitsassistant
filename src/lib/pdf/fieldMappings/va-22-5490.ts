import type { FieldMapping } from '../fillPdf';

export const va225490Mapping: FieldMapping = {
  // Applicant – Page 1 (firstName maps to combined name field)
  firstName: { pdfFieldName: 'form1[0].Page_1[0].NAME[0]', type: 'text' },
  ssn: { pdfFieldName: 'form1[0].Page_1[0].SSN[0]', type: 'text' },
  dob: { pdfFieldName: 'form1[0].Page_1[0].DOB[0]', type: 'text' },
  sex: [
    { pdfFieldName: 'form1[0].Page_1[0].MALE[0]', type: 'checkbox', transform: v => v === 'Male' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_1[0].FEMALE[0]', type: 'checkbox', transform: v => v === 'Female' ? 'true' : 'false' },
  ],
  address: { pdfFieldName: 'form1[0].Page_1[0].address[0]', type: 'text' },
  homePhone: { pdfFieldName: 'form1[0].Page_1[0].PrimaryTelephone[0]', type: 'text' },
  mobilePhone: { pdfFieldName: 'form1[0].Page_1[0].SecondaryTelephone[0]', type: 'text' },
  email: { pdfFieldName: 'form1[0].Page_1[0].EMAIL[0]', type: 'text' },

  // Direct Deposit
  accountType: [
    { pdfFieldName: 'form1[0].Page_1[0].CheckBoxChecking[0]', type: 'checkbox', transform: v => v === 'Checking' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_1[0].CheckBoxSavings[0]', type: 'checkbox', transform: v => v === 'Savings' ? 'true' : 'false' },
  ],
  routingNumber: { pdfFieldName: 'form1[0].Page_1[0].RoutingNumber[0]', type: 'text' },
  accountNumber: { pdfFieldName: 'form1[0].Page_1[0].AccountNumber[0]', type: 'text' },

  // Qualifying Individual (updated field IDs to match new definition)
  qiFirstName: { pdfFieldName: 'form1[0].Page_1[0].Name[1]', type: 'text' },
  qiSSN: { pdfFieldName: 'form1[0].Page_1[0].SocialSecurityNumber[1]', type: 'text' },
  qiBranch: { pdfFieldName: 'form1[0].Page_1[0].BranchService[0]', type: 'text' },
  qiDOB: { pdfFieldName: 'form1[0].Page_1[0].DOB2[0]', type: 'text' },
  qiDateMIA: { pdfFieldName: 'form1[0].Page_1[0].DateListed[0]', type: 'text' },
  qiDateOfDeath: { pdfFieldName: 'form1[0].Page_1[0].DateofDeath[0]', type: 'text' },
  qiOnActiveDuty: [
    { pdfFieldName: 'form1[0].Page_1[0].ActiveDutyYes[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_1[0].ActiveDutyNo[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : 'false' },
  ],

  // Benefit type – Page 2
  benefitType: [
    { pdfFieldName: 'form1[0].Page_2[0].CheckBox_Chapter35DEA[0]', type: 'checkbox', transform: v => v === 'DEA' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_2[0].CheckBox_Chapter33_FRYScholarship[0]', type: 'checkbox', transform: v => v === 'Fry' ? 'true' : 'false' },
  ],

  // Education info – Page 2
  hsGraduated: [
    { pdfFieldName: 'form1[0].Page_2[0].HSYes[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_2[0].HSNo[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : 'false' },
  ],
  hsGradDate: { pdfFieldName: 'form1[0].Page_2[0].HSDate[0]', type: 'text' },

  // Service Periods – Page 3
  sp1Entered: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].DateEntered[0]', type: 'text' },
  sp1Separated: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].DateEntered[1]', type: 'text' },
  sp1Branch: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].BranchReserveGuard1[0]', type: 'text' },
  sp1Discharge: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].characterdischarge1[0]', type: 'text' },
};
