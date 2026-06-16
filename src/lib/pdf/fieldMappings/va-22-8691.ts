import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

// Several AcroForm text fields carry a maxLength. pdf-lib's setText() THROWS when
// the value exceeds it, and fillPdf.ts swallows that in try/catch -> the whole
// field renders BLANK (not truncated). Clamp every overflow-prone value to the
// real maxLength so long inputs degrade gracefully instead of vanishing.
// (length === maxLength is allowed by setText.) Maxlengths confirmed via pdf-lib.
const sl = (n: number) => (v: string) => String(v ?? '').slice(0, n);

export const va228691Mapping: FieldMapping = {
  // fullName / fullAddress are computed by computeAnswers in the form definition
  fullName: { pdfFieldName: 'form1[0].#subform[0].NameofApplicant[0]', type: 'text', transform: sl(101) }, // MAXLEN=101
  fullAddress: { pdfFieldName: 'form1[0].#subform[0].AddressofApplicant[0]', type: 'text', transform: sl(306) }, // MAXLEN=306
  vaFileNumber: { pdfFieldName: 'form1[0].#subform[0].VAFileNumber[0]', type: 'text', transform: sl(49) }, // MAXLEN=49
  ssn: { pdfFieldName: 'form1[0].#subform[0].SSN[0]', type: 'text' , transform: (v: string) => v.replace(/\D/g, '')},
  dob: { pdfFieldName: 'form1[0].#subform[0].DOB[0]', type: 'text', transform: formatDateString },
  phone: { pdfFieldName: 'form1[0].#subform[0].Telephone[0]', type: 'text', transform: sl(51) }, // MAXLEN=51
  email: { pdfFieldName: 'form1[0].#subform[0].Email[0]', type: 'text', transform: sl(51) }, // MAXLEN=51
  sex: [
    { pdfFieldName: 'form1[0].#subform[0].MALE[0]', type: 'checkbox', transform: v => v === 'Male' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].#subform[0].FEMALE[0]', type: 'checkbox', transform: v => v === 'Female' ? 'true' : 'false' },
  ],

  // School & Enrollment
  schoolName: { pdfFieldName: 'form1[0].#subform[0].AddressofSchool[0]', type: 'text', transform: sl(104) }, // MAXLEN=104 (textarea: name+street+city+state+zip)
  trainingProgram: { pdfFieldName: 'form1[0].#subform[0].TrainingProgram[0]', type: 'text', transform: sl(96) }, // MAXLEN=96
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
  priorWorkStudyWhere: { pdfFieldName: 'form1[0].#subform[0].IfYes[0]', type: 'text', transform: sl(52) }, // MAXLEN=52
  // Free-text fields: clamp to each box's actual maxLength (overflow throws -> blanks the whole field).
  workSitePreference: { pdfFieldName: 'form1[0].#subform[0].WorkSiteReference[0]', type: 'text', transform: sl(118) }, // MAXLEN=118 (was slice 200 -> overflowed -> blank)
  workExperience: { pdfFieldName: 'form1[0].#subform[0].WorkExperience[0]', type: 'text', transform: sl(205) }, // MAXLEN=205
  qualifications: { pdfFieldName: 'form1[0].#subform[0].Qualification[0]', type: 'text', transform: sl(303) }, // MAXLEN=303

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
