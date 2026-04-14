import type { FieldMapping } from '../fillPdf';

export const va228691Mapping: FieldMapping = {
  // Applicant
  name: { pdfFieldName: 'form1[0].#subform[0].NameofApplicant[0]', type: 'text' },
  address: { pdfFieldName: 'form1[0].#subform[0].AddressofApplicant[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'form1[0].#subform[0].VAFileNumber[0]', type: 'text' },
  ssn: { pdfFieldName: 'form1[0].#subform[0].SSN[0]', type: 'text' },
  dob: { pdfFieldName: 'form1[0].#subform[0].DOB[0]', type: 'text' },
  phone: { pdfFieldName: 'form1[0].#subform[0].Telephone[0]', type: 'text' },
  email: { pdfFieldName: 'form1[0].#subform[0].Email[0]', type: 'text' },
  sex_male: { pdfFieldName: 'form1[0].#subform[0].MALE[0]', type: 'checkbox' },
  sex_female: { pdfFieldName: 'form1[0].#subform[0].FEMALE[0]', type: 'checkbox' },

  // School & Enrollment
  schoolName: { pdfFieldName: 'form1[0].#subform[0].AddressofSchool[0]', type: 'text' },
  trainingProgram: { pdfFieldName: 'form1[0].#subform[0].TrainingProgram[0]', type: 'text' },
  enrollBegin: { pdfFieldName: 'form1[0].#subform[0].ADate[0]', type: 'text' },
  enrollEnd: { pdfFieldName: 'form1[0].#subform[0].BDate[0]', type: 'text' },
  nextEnrollBegin: { pdfFieldName: 'form1[0].#subform[0].A8Date[0]', type: 'text' },
  nextEnrollEnd: { pdfFieldName: 'form1[0].#subform[0].B8Date[0]', type: 'text' },

  // Benefit Chapter
  benefit_ch30: { pdfFieldName: 'form1[0].#subform[0].Chap30[0]', type: 'checkbox' },
  benefit_ch31: { pdfFieldName: 'form1[0].#subform[0].Chap31[0]', type: 'checkbox' },
  benefit_ch32: { pdfFieldName: 'form1[0].#subform[0].Chap32[0]', type: 'checkbox' },
  benefit_ch33: { pdfFieldName: 'form1[0].#subform[0].Chap33[0]', type: 'checkbox' },
  benefit_ch35: { pdfFieldName: 'form1[0].#subform[0].Chap35[0]', type: 'checkbox' },
  benefit_ch1606: { pdfFieldName: 'form1[0].#subform[0].Chap1606[0]', type: 'checkbox' },

  // Work-Study Details
  advancePaymentYes: { pdfFieldName: 'form1[0].#subform[0].YES[0]', type: 'checkbox' },
  advancePaymentNo: { pdfFieldName: 'form1[0].#subform[0].NO[0]', type: 'checkbox' },
  priorWorkStudyYes: { pdfFieldName: 'form1[0].#subform[0].YES1[0]', type: 'checkbox' },
  priorWorkStudyNo: { pdfFieldName: 'form1[0].#subform[0].NO1[0]', type: 'checkbox' },
  priorWorkStudyWhere: { pdfFieldName: 'form1[0].#subform[0].IfYes[0]', type: 'text' },
  workSitePreference: { pdfFieldName: 'form1[0].#subform[0].WorkSiteReference[0]', type: 'text' },
  workExperience: { pdfFieldName: 'form1[0].#subform[0].WorkExperience[0]', type: 'text' },
  qualifications: { pdfFieldName: 'form1[0].#subform[0].Qualification[0]', type: 'text' },

  // Availability
  availMonday: { pdfFieldName: 'form1[0].#subform[0].MONDAY[0]', type: 'checkbox' },
  availMondayFrom: { pdfFieldName: 'form1[0].#subform[0].DateFromMon[0]', type: 'text' },
  availMondayTo: { pdfFieldName: 'form1[0].#subform[0].DateToMon[0]', type: 'text' },
  availTuesday: { pdfFieldName: 'form1[0].#subform[0].TUESDAY[0]', type: 'checkbox' },
  availTuesdayFrom: { pdfFieldName: 'form1[0].#subform[0].DateFromTues[0]', type: 'text' },
  availTuesdayTo: { pdfFieldName: 'form1[0].#subform[0].DateToTues[0]', type: 'text' },
  availWednesday: { pdfFieldName: 'form1[0].#subform[0].WEDNESDAY[0]', type: 'checkbox' },
  availWednesdayFrom: { pdfFieldName: 'form1[0].#subform[0].DateFromWed[0]', type: 'text' },
  availWednesdayTo: { pdfFieldName: 'form1[0].#subform[0].DateToWed[0]', type: 'text' },
  availThursday: { pdfFieldName: 'form1[0].#subform[0].THURSDAY[0]', type: 'checkbox' },
  availThursdayFrom: { pdfFieldName: 'form1[0].#subform[0].DateFromThurs[0]', type: 'text' },
  availThursdayTo: { pdfFieldName: 'form1[0].#subform[0].DateToThurs[0]', type: 'text' },
  availFriday: { pdfFieldName: 'form1[0].#subform[0].FRIDAY[0]', type: 'checkbox' },
  availFridayFrom: { pdfFieldName: 'form1[0].#subform[0].DateFromFri[0]', type: 'text' },
  availFridayTo: { pdfFieldName: 'form1[0].#subform[0].DateToFri[0]', type: 'text' },
};
