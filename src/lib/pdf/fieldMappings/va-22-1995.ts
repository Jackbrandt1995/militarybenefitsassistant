import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va221995Mapping: FieldMapping = {
  // Applicant – firstName maps to combined name field
  firstName: { pdfFieldName: 'form1[0].#subform[0].EnterNameOfApplicantFirstMiddleLast[0]', type: 'text' },
  address: { pdfFieldName: 'form1[0].#subform[0].EnterMailingAddress[0]', type: 'text' },
  homePhone: { pdfFieldName: 'form1[0].#subform[0].Enter_Home_Telephone_Number[0]', type: 'text' },
  mobilePhone: { pdfFieldName: 'form1[0].#subform[0].Enter_Mobile_Telephone_Number[0]', type: 'text' },
  homePhoneNone:   { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 510, checkSize: 6 },
  mobilePhoneNone: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 493, checkSize: 6 },
  email: { pdfFieldName: 'form1[0].#subform[0].EnterApplicantsE-mailAddress[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'form1[0].#subform[0].Enter_V_A_File_Number[0]', type: 'text' },
  ssn: { pdfFieldName: 'form1[0].#subform[0].Enter_Applicants_Social_Security_Number[0]', type: 'text' },

  // Benefit chapter checkboxes (driven by benefitChapter radio)
  benefitChapter: [
    { pdfFieldName: 'form1[0].#subform[0].CheckBoxA[0]', type: 'checkbox', transform: v => v === 'chapter30' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].CheckBoxB[0]', type: 'checkbox', transform: v => v === 'chapter33' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].CheckBoxC[0]', type: 'checkbox', transform: v => v === 'chapter1606' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].CheckBoxD[0]', type: 'checkbox', transform: v => v === 'chapter1607' ? 'true' : 'false' },
  ],

  // Training type checkboxes (driven by trainingType radio)
  trainingType: [
    { pdfFieldName: 'form1[0].#subform[0].CheckBox3A[0]', type: 'checkbox', transform: v => v === 'school' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].CheckBox3B[0]', type: 'checkbox', transform: v => v === 'correspondence' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].CheckBox3C[0]', type: 'checkbox', transform: v => v === 'apprenticeship' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].CheckBox3D[0]', type: 'checkbox', transform: v => v === 'flight' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].CheckBox3E[0]', type: 'checkbox', transform: v => v === 'nationalExam' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].CheckBox3F[0]', type: 'checkbox', transform: v => v === 'licensing' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].CheckBox3H[0]', type: 'checkbox', transform: v => v === 'topUp' ? 'true' : 'false' },
  ],

  // Program Change
  educationGoal: { pdfFieldName: 'form1[0].#subform[0].EnterGoal[0]', type: 'text' },
  programName: { pdfFieldName: 'form1[0].#subform[0].EnterNameOfProgram[0]', type: 'text' },
  newSchool: { pdfFieldName: 'form1[0].#subform[0].EnterNewSchoolAddress[0]', type: 'text' },
  oldSchool: { pdfFieldName: 'form1[0].#subform[0].EnterOldOrCurrentSchoolAddress[0]', type: 'text' },
  whyStopped: { pdfFieldName: 'form1[0].#subform[0].EnterWhyTrainingStopped[0]', type: 'text' },

  // Direct Deposit – Page 2
  accountType: [
    { pdfFieldName: 'form1[0].#subform[1].CheckBoxChecking[0]', type: 'checkbox', transform: v => v === 'Checking' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[1].CheckBoxSAVINGS[0]', type: 'checkbox', transform: v => v === 'Savings' ? 'true' : 'false' },
  ],
  routingNumber: { pdfFieldName: 'form1[0].#subform[1].TextField1[0]', type: 'text' },
  accountNumber: { pdfFieldName: 'form1[0].#subform[1].EnterACCOUNTNUMBER[0]', type: 'text' },

  // Service Periods – Page 2 (updated field IDs to match new definition)
  service1Branch: { pdfFieldName: 'form1[0].#subform[1].EnterBranchOfService1[0]', type: 'text' },
  service1From: { pdfFieldName: 'form1[0].#subform[1].EnterActiveDates1[0]', type: 'text' },
  service1Discharge: { pdfFieldName: 'form1[0].#subform[1].EnterCharacterD1[0]', type: 'text' },
  service1Involuntary: [
    { pdfFieldName: 'form1[0].#subform[1].CheckBoxYesCalled1[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[1].CheckBoxNoCalled1[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : 'false' },
  ],
  service2Branch: { pdfFieldName: 'form1[0].#subform[1].EnterBranceOfService2[0]', type: 'text' },
  service2From: { pdfFieldName: 'form1[0].#subform[1].EnterActiveDutyDates2[0]', type: 'text' },
  service2Discharge: { pdfFieldName: 'form1[0].#subform[1].EnterCharacterD2[0]', type: 'text' },

  // Additional – driven by Yes/No radios
  receivingGETA: [
    { pdfFieldName: 'form1[0].#subform[1].CheckBoxGETAYes[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[1].CheckBoxGETANo[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : 'false' },
  ],
  receivingMilitaryFunds: [
    { pdfFieldName: 'form1[0].#subform[1].CheckBoxMilitaryYes[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[1].CheckBoxMilitaryNo[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : 'false' },
  ],
  remarks: { pdfFieldName: 'form1[0].#subform[1].EnterRemarks[0]', type: 'text' },

  // Signature is on page 1 (second page, 0-indexed). AcroForm date EnterDateSigned[0]: page=1 x=456 y=42
  // Sig box is XFA-only; image placed at same page/y.
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 1, imageX: 36, imageY: 38, imageWidth: 200, imageHeight: 20 },
  ],
  signatureDate: [
    { pdfFieldName: 'form1[0].#subform[1].EnterDateSigned[0]', type: 'text', transform: formatDateString },
    { pdfFieldName: 'DRAW_TEXT_DATE', type: 'draw-text', transform: formatDateString, textPage: 1, textX: 456, textY: 44, textSize: 10 },
  ],
};
