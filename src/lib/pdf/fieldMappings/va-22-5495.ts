import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va225495Mapping: FieldMapping = {
  // Applicant – Page 1
  // fullName / fullAddress computed by computeAnswers in the form definition
  fullName: { pdfFieldName: 'form1[0].Page_1[0].NameOfApplicant[0]', type: 'text' },
  ssn: { pdfFieldName: 'form1[0].Page_1[0].SSN[0]', type: 'text' , transform: (v: string) => v.replace(/\D/g, '')},
  vaFileNumber: { pdfFieldName: 'form1[0].Page_1[0].VAFILENUMBER[0]', type: 'text' },
  primaryPhone: { pdfFieldName: 'form1[0].Page_1[0].PrimaryPhone[0]', type: 'text' },
  secondaryPhone: { pdfFieldName: 'form1[0].Page_1[0].SecondaryPhone[0]', type: 'text' },
  primaryPhoneNone:   { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 510, checkSize: 6 },
  secondaryPhoneNone: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 493, checkSize: 6 },
  email: { pdfFieldName: 'form1[0].Page_1[0].APPLICANTSE-MAILADDRESS[0]', type: 'text' },
  // Item 5 DATE OF BIRTH — left field on the DOB/address row (DateSigned[0], x=36 y=552)
  dob: { pdfFieldName: 'form1[0].Page_1[0].DateSigned[0]', type: 'text', transform: formatDateString },
  // Item 4 SEX OF APPLICANT — RadioButtonList[0] OPTS=[MALE | FEMALE]
  sex: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[0]', type: 'radio', transform: v => v === 'Male' ? 'MALE' : 'FEMALE' },
  // Item 6 CURRENT MAILING ADDRESS — large field right of DOB (TextField1[0], x=174 y=553)
  fullAddress: { pdfFieldName: 'form1[0].Page_1[0].TextField1[0]', type: 'text' },

  // Direct Deposit
  // Item 9A TYPE OF ACCOUNT — RadioButtonList[2] OPTS=[CHECKING | SAVING]
  accountType: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[2]', type: 'radio', transform: v => v === 'Savings' ? 'SAVING' : 'CHECKING' },
  bankName: { pdfFieldName: 'form1[0].Page_1[0].NameOfFinancialInstitution[0]', type: 'text' },
  routingNumber: { pdfFieldName: 'form1[0].Page_1[0].RoutingOrTransitNumber[0]', type: 'text' },
  accountNumber: { pdfFieldName: 'form1[0].Page_1[0].acctnumber[0]', type: 'text' },

  // Emergency Contact
  emergencyName: { pdfFieldName: 'form1[0].Page_1[0].NameofSomeone[0]', type: 'text' },
  emergencyAddress: { pdfFieldName: 'form1[0].Page_1[0].AddressofSomeone[0]', type: 'text' },
  // Item 10C TELEPHONE NUMBER of someone who knows where you can be reached (TextField1[1], x=432 y=360)
  emergencyPhone: { pdfFieldName: 'form1[0].Page_1[0].TextField1[1]', type: 'text' },

  // Qualifying Individual (updated field IDs)
  qiFirstName: { pdfFieldName: 'form1[0].Page_1[0].NameofVeteran[0]', type: 'text' },
  qiSSN: { pdfFieldName: 'form1[0].Page_1[0].SSN2[0]', type: 'text' , transform: (v: string) => v.replace(/\D/g, '')},
  qiBranch: { pdfFieldName: 'form1[0].Page_1[0].BRANCHOFSERVICE[0]', type: 'text' },
  // Item 14 DATE OF BIRTH of qualifying individual (DateSigned[1], x=432 y=300, same row as SSN2/branch)
  qiDOB: { pdfFieldName: 'form1[0].Page_1[0].DateSigned[1]', type: 'text', transform: formatDateString },
  // Item 15 DATE OF DEATH / MIA / POW (DateSigned[2], x=36 y=270, row below)
  qiDateOfDeath: { pdfFieldName: 'form1[0].Page_1[0].DateSigned[2]', type: 'text', transform: formatDateString },

  // Benefit type — Page 2 RadioButtonList[0]
  // OPTS=[CHAPTER 33 ... FRY SCHOLARSHIP | CHAPTER 35 ... DEA]
  benefitType: {
    pdfFieldName: 'form1[0].Page_2[0].RadioButtonList[0]',
    type: 'radio',
    transform: v => v === 'Fry'
      ? 'CHAPTER 33 - POST-9/11 GI BILL MARINE GUNNERY SERGEANT JOHN DAVID FRY SCHOLARSHIP (FRY SCHOLARSHIP) '
      : "CHAPTER 35 - SURVIVORS' AND DEPENDENTS' EDUCATIONAL ASSISTANCE PROGRAM (DEA)",
  },

  // Type of training — Page 2 RadioButtonList[1]
  // OPTS=[COLLEGE OR OTHER SCHOOL | FARM COOPERATIVE | LICENSING OR CERTIFICATION TEST |
  //       APPRENTICESHIP OR OTHER ON-THE-JOB TRAINING | NATIONAL ADMISSION EXAMS OR NATIONAL EXAMS FOR CREDIT |
  //       CORRESPONDENCE COURSE  (DEA Children not eligible) | FLIGHT TRAINING  (Fry Scholarship only)]
  educationType: {
    pdfFieldName: 'form1[0].Page_2[0].RadioButtonList[1]',
    type: 'radio',
    transform: v => {
      switch (v) {
        case 'college': return 'COLLEGE OR OTHER SCHOOL';
        case 'licensing': return 'LICENSING OR CERTIFICATION TEST';
        case 'apprenticeship': return 'APPRENTICESHIP OR OTHER ON-THE-JOB TRAINING';
        case 'correspondence': return 'CORRESPONDENCE COURSE  (DEA Children not eligible)';
        case 'flight': return 'FLIGHT TRAINING  (Fry Scholarship only)';
        default: return '';
      }
    },
  },

  // Program Change – Page 2
  educationGoal: { pdfFieldName: 'form1[0].Page_2[0].specifyeducation[0]', type: 'text' },
  programName: { pdfFieldName: 'form1[0].Page_2[0].whatisname[0]', type: 'text' },
  newSchool: { pdfFieldName: 'form1[0].Page_2[0].ifchanging1[0]', type: 'text' },
  oldSchool: { pdfFieldName: 'form1[0].Page_2[0].ifchanging[0]', type: 'text' },
  whyStopped: { pdfFieldName: 'form1[0].Page_2[0].tessuswhen[0]', type: 'text' },
  remarks: { pdfFieldName: 'form1[0].Page_2[0].remarks27[0]', type: 'text' },

  // AcroForm fields confirmed: Signature[0] page=1 x=84 y=36 w=330 h=12
  //                            DateSigned[2] page=1 x=426 y=36
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 1, imageX: 84, imageY: 32, imageWidth: 230, imageHeight: 18 },
  ],
  signatureDate: [
    { pdfFieldName: 'form1[0].Page_2[0].DateSigned[2]', type: 'text', transform: formatDateString },
    { pdfFieldName: 'DRAW_TEXT_DATE', type: 'draw-text', transform: formatDateString, textPage: 1, textX: 426, textY: 38, textSize: 10 },
  ],
};
