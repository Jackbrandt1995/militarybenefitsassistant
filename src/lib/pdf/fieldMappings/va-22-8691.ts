import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va228691Mapping: FieldMapping = {
  // fullName / fullAddress are computed by computeAnswers in the form definition
  fullName: { pdfFieldName: 'form1[0].#subform[0].NameofApplicant[0]', type: 'text' },
  fullAddress: { pdfFieldName: 'form1[0].#subform[0].AddressofApplicant[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'form1[0].#subform[0].VAFileNumber[0]', type: 'text' },
  ssn: { pdfFieldName: 'form1[0].#subform[0].SSN[0]', type: 'text' , transform: (v: string) => v.replace(/\D/g, '')},
  dob: { pdfFieldName: 'form1[0].#subform[0].DOB[0]', type: 'text', transform: formatDateString },
  phone: { pdfFieldName: 'form1[0].#subform[0].Telephone[0]', type: 'text' },
  email: { pdfFieldName: 'form1[0].#subform[0].Email[0]', type: 'text' },
  sex: [
    { pdfFieldName: 'form1[0].#subform[0].MALE[0]', type: 'checkbox', transform: v => v === 'Male' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].FEMALE[0]', type: 'checkbox', transform: v => v === 'Female' ? 'true' : 'false' },
  ],

  // School & Enrollment
  schoolName: { pdfFieldName: 'form1[0].#subform[0].AddressofSchool[0]', type: 'text' },
  trainingProgram: { pdfFieldName: 'form1[0].#subform[0].TrainingProgram[0]', type: 'text' },
  enrollBegin: { pdfFieldName: 'form1[0].#subform[0].ADate[0]', type: 'text', transform: formatDateString },
  enrollEnd: { pdfFieldName: 'form1[0].#subform[0].BDate[0]', type: 'text', transform: formatDateString },
  nextEnrollBegin: { pdfFieldName: 'form1[0].#subform[0].A8Date[0]', type: 'text', transform: formatDateString },
  nextEnrollEnd: { pdfFieldName: 'form1[0].#subform[0].B8Date[0]', type: 'text', transform: formatDateString },

  // Benefit Chapter checkboxes (driven by benefitChapter radio)
  benefitChapter: [
    { pdfFieldName: 'form1[0].#subform[0].Chap30[0]', type: 'checkbox', transform: v => v === 'chapter30' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].Chap31[0]', type: 'checkbox', transform: v => v === 'chapter31' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].Chap32[0]', type: 'checkbox', transform: v => v === 'chapter32' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].Chap33[0]', type: 'checkbox', transform: v => v === 'chapter33' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].Chap35[0]', type: 'checkbox', transform: v => v === 'chapter35' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].Chap1606[0]', type: 'checkbox', transform: v => v === 'chapter1606' ? 'true' : 'false' },
  ],

  // Work-Study Details
  advancePayment: [
    { pdfFieldName: 'form1[0].#subform[0].YES[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].NO[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : 'false' },
  ],
  priorWorkStudy: [
    { pdfFieldName: 'form1[0].#subform[0].YES1[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].NO1[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : 'false' },
  ],
  priorWorkStudyWhere: { pdfFieldName: 'form1[0].#subform[0].IfYes[0]', type: 'text' },
  // Limit long free-text fields to ~2 lines (~200 chars) so text fits in the PDF box
  workSitePreference: { pdfFieldName: 'form1[0].#subform[0].WorkSiteReference[0]', type: 'text', transform: v => v ? v.slice(0, 200) : '' },
  workExperience: { pdfFieldName: 'form1[0].#subform[0].WorkExperience[0]', type: 'text', transform: v => v ? v.slice(0, 200) : '' },
  qualifications: { pdfFieldName: 'form1[0].#subform[0].Qualification[0]', type: 'text', transform: v => v ? v.slice(0, 200) : '' },

  // Availability Schedule
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

  // Sig area is XFA-only. AcroForm date Date[0]: page=0 x=431 y=138 (near applicant sig line).
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 0, imageX: 36, imageY: 130, imageWidth: 230, imageHeight: 18 },
  ],
  signatureDate: [
    { pdfFieldName: 'form1[0].#subform[0].Date[0]', type: 'text', transform: formatDateString },
  ],
};
