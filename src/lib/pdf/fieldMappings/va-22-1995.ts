import type { FieldMapping } from '../fillPdf';

export const va221995Mapping: FieldMapping = {
  // Applicant - Page 1
  name: { pdfFieldName: 'form1[0].#subform[0].EnterNameOfApplicantFirstMiddleLast[0]', type: 'text' },
  address: { pdfFieldName: 'form1[0].#subform[0].EnterMailingAddress[0]', type: 'text' },
  homePhone: { pdfFieldName: 'form1[0].#subform[0].Enter_Home_Telephone_Number[0]', type: 'text' },
  mobilePhone: { pdfFieldName: 'form1[0].#subform[0].Enter_Mobile_Telephone_Number[0]', type: 'text' },
  email: { pdfFieldName: 'form1[0].#subform[0].EnterApplicantsE-mailAddress[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'form1[0].#subform[0].Enter_V_A_File_Number[0]', type: 'text' },
  ssn: { pdfFieldName: 'form1[0].#subform[0].Enter_Applicants_Social_Security_Number[0]', type: 'text' },

  // Benefit checkboxes
  benefit_ch30: { pdfFieldName: 'form1[0].#subform[0].CheckBoxA[0]', type: 'checkbox' },
  benefit_ch33: { pdfFieldName: 'form1[0].#subform[0].CheckBoxB[0]', type: 'checkbox' },
  benefit_ch1606: { pdfFieldName: 'form1[0].#subform[0].CheckBoxC[0]', type: 'checkbox' },
  benefit_ch1607: { pdfFieldName: 'form1[0].#subform[0].CheckBoxD[0]', type: 'checkbox' },
  benefit_transferOfEntitlement: { pdfFieldName: 'form1[0].#subform[0].CheckBoxE[0]', type: 'checkbox' },

  // Education Type
  edType_college: { pdfFieldName: 'form1[0].#subform[0].CheckBox3A[0]', type: 'checkbox' },
  edType_correspondence: { pdfFieldName: 'form1[0].#subform[0].CheckBox3B[0]', type: 'checkbox' },
  edType_apprenticeship: { pdfFieldName: 'form1[0].#subform[0].CheckBox3C[0]', type: 'checkbox' },
  edType_flight: { pdfFieldName: 'form1[0].#subform[0].CheckBox3D[0]', type: 'checkbox' },
  edType_nationalTest: { pdfFieldName: 'form1[0].#subform[0].CheckBox3E[0]', type: 'checkbox' },
  edType_licensing: { pdfFieldName: 'form1[0].#subform[0].CheckBox3F[0]', type: 'checkbox' },
  edType_prep: { pdfFieldName: 'form1[0].#subform[0].CheckBox3G[0]', type: 'checkbox' },
  edType_topUp: { pdfFieldName: 'form1[0].#subform[0].CheckBox3H[0]', type: 'checkbox' },

  // Program Change
  educationGoal: { pdfFieldName: 'form1[0].#subform[0].EnterGoal[0]', type: 'text' },
  programName: { pdfFieldName: 'form1[0].#subform[0].EnterNameOfProgram[0]', type: 'text' },
  newSchool: { pdfFieldName: 'form1[0].#subform[0].EnterNewSchoolAddress[0]', type: 'text' },
  oldSchool: { pdfFieldName: 'form1[0].#subform[0].EnterOldOrCurrentSchoolAddress[0]', type: 'text' },
  whyStopped: { pdfFieldName: 'form1[0].#subform[0].EnterWhyTrainingStopped[0]', type: 'text' },

  // Direct Deposit - Page 2
  accountType_checking: { pdfFieldName: 'form1[0].#subform[1].CheckBoxChecking[0]', type: 'checkbox' },
  accountType_savings: { pdfFieldName: 'form1[0].#subform[1].CheckBoxSAVINGS[0]', type: 'checkbox' },
  routingNumber: { pdfFieldName: 'form1[0].#subform[1].TextField1[0]', type: 'text' },
  accountNumber: { pdfFieldName: 'form1[0].#subform[1].EnterACCOUNTNUMBER[0]', type: 'text' },

  // Service Periods - Page 2
  sp1Branch: { pdfFieldName: 'form1[0].#subform[1].EnterBranchOfService1[0]', type: 'text' },
  sp1Dates: { pdfFieldName: 'form1[0].#subform[1].EnterActiveDates1[0]', type: 'text' },
  sp1Duty: { pdfFieldName: 'form1[0].#subform[1].EnterTypeOfDutyE1[0]', type: 'text' },
  sp1Discharge: { pdfFieldName: 'form1[0].#subform[1].EnterCharacterD1[0]', type: 'text' },
  sp1InvoluntaryYes: { pdfFieldName: 'form1[0].#subform[1].CheckBoxYesCalled1[0]', type: 'checkbox' },
  sp1InvoluntaryNo: { pdfFieldName: 'form1[0].#subform[1].CheckBoxNoCalled1[0]', type: 'checkbox' },

  sp2Branch: { pdfFieldName: 'form1[0].#subform[1].EnterBranceOfService2[0]', type: 'text' },
  sp2Dates: { pdfFieldName: 'form1[0].#subform[1].EnterActiveDutyDates2[0]', type: 'text' },
  sp2Duty: { pdfFieldName: 'form1[0].#subform[1].EnterTypeOfDutyE2[0]', type: 'text' },
  sp2Discharge: { pdfFieldName: 'form1[0].#subform[1].EnterCharacterD2[0]', type: 'text' },
  sp2InvoluntaryYes: { pdfFieldName: 'form1[0].#subform[1].CheckBoxYesCalled2[0]', type: 'checkbox' },
  sp2InvoluntaryNo: { pdfFieldName: 'form1[0].#subform[1].CheckBoxNoCalled2[0]', type: 'checkbox' },

  // Remarks
  remarks: { pdfFieldName: 'form1[0].#subform[1].EnterRemarks[0]', type: 'text' },
};
