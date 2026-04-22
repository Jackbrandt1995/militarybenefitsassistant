import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va225495Mapping: FieldMapping = {
  // Applicant – Page 1 (firstName maps to combined name field)
  firstName: { pdfFieldName: 'form1[0].Page_1[0].NameOfApplicant[0]', type: 'text' },
  ssn: { pdfFieldName: 'form1[0].Page_1[0].SSN[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'form1[0].Page_1[0].VAFILENUMBER[0]', type: 'text' },
  primaryPhone: { pdfFieldName: 'form1[0].Page_1[0].PrimaryPhone[0]', type: 'text' },
  secondaryPhone: { pdfFieldName: 'form1[0].Page_1[0].SecondaryPhone[0]', type: 'text' },
  primaryPhoneNone:   { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 510, checkSize: 6 },
  secondaryPhoneNone: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 493, checkSize: 6 },
  email: { pdfFieldName: 'form1[0].Page_1[0].APPLICANTSE-MAILADDRESS[0]', type: 'text' },
  dob: { pdfFieldName: 'form1[0].Page_1[0].DOB[0]', type: 'text' },
  sex: [
    { pdfFieldName: 'form1[0].Page_1[0].MALE[0]', type: 'checkbox', transform: v => v === 'Male' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_1[0].FEMALE[0]', type: 'checkbox', transform: v => v === 'Female' ? 'true' : 'false' },
  ],
  address: { pdfFieldName: 'form1[0].Page_1[0].Address[0]', type: 'text' },

  // Direct Deposit
  accountType: [
    { pdfFieldName: 'form1[0].Page_1[0].CheckBoxChecking[0]', type: 'checkbox', transform: v => v === 'Checking' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_1[0].CheckBoxSavings[0]', type: 'checkbox', transform: v => v === 'Savings' ? 'true' : 'false' },
  ],
  bankName: { pdfFieldName: 'form1[0].Page_1[0].NameOfFinancialInstitution[0]', type: 'text' },
  routingNumber: { pdfFieldName: 'form1[0].Page_1[0].RoutingOrTransitNumber[0]', type: 'text' },
  accountNumber: { pdfFieldName: 'form1[0].Page_1[0].acctnumber[0]', type: 'text' },

  // Emergency Contact
  emergencyName: { pdfFieldName: 'form1[0].Page_1[0].NameofSomeone[0]', type: 'text' },
  emergencyAddress: { pdfFieldName: 'form1[0].Page_1[0].AddressofSomeone[0]', type: 'text' },
  emergencyPhone: { pdfFieldName: 'form1[0].Page_1[0].PhoneofSomeone[0]', type: 'text' },

  // Qualifying Individual (updated field IDs)
  qiFirstName: { pdfFieldName: 'form1[0].Page_1[0].NameofVeteran[0]', type: 'text' },
  qiSSN: { pdfFieldName: 'form1[0].Page_1[0].SSN2[0]', type: 'text' },
  qiBranch: { pdfFieldName: 'form1[0].Page_1[0].BRANCHOFSERVICE[0]', type: 'text' },
  qiDOB: { pdfFieldName: 'form1[0].Page_1[0].DOBVet[0]', type: 'text' },
  qiDateOfDeath: { pdfFieldName: 'form1[0].Page_1[0].DateDeath[0]', type: 'text' },

  // Benefit type checkboxes
  benefitType: [
    { pdfFieldName: 'form1[0].Page_1[0].Fry33[0]', type: 'checkbox', transform: v => v === 'Fry' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_1[0].DEA35[0]', type: 'checkbox', transform: v => v === 'DEA' ? 'true' : 'false' },
  ],

  // Education type checkboxes
  educationType: [
    { pdfFieldName: 'form1[0].Page_2[0].College[0]', type: 'checkbox', transform: v => v === 'college' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_2[0].Licensing[0]', type: 'checkbox', transform: v => v === 'licensing' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_2[0].Apprenticeship[0]', type: 'checkbox', transform: v => v === 'apprenticeship' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_2[0].Correspondence[0]', type: 'checkbox', transform: v => v === 'correspondence' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_2[0].Flight[0]', type: 'checkbox', transform: v => v === 'flight' ? 'true' : 'false' },
  ],

  // Program Change – Page 2
  educationGoal: { pdfFieldName: 'form1[0].Page_2[0].specifyeducation[0]', type: 'text' },
  programName: { pdfFieldName: 'form1[0].Page_2[0].whatisname[0]', type: 'text' },
  newSchool: { pdfFieldName: 'form1[0].Page_2[0].ifchanging1[0]', type: 'text' },
  oldSchool: { pdfFieldName: 'form1[0].Page_2[0].ifchanging[0]', type: 'text' },
  whyStopped: { pdfFieldName: 'form1[0].Page_2[0].tessuswhen[0]', type: 'text' },
  remarks: { pdfFieldName: 'form1[0].Page_2[0].remarks27[0]', type: 'text' },

  // Signature image overlay + draw-text date fallback
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 0, imageX: 36, imageY: 80, imageWidth: 230, imageHeight: 50 },
  ],
  signatureDate: [
    { pdfFieldName: 'DRAW_TEXT_DATE', type: 'draw-text', transform: formatDateString, textPage: 0, textX: 370, textY: 88, textSize: 10 },
  ],
};
