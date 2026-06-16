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

  // Qualifying Individual (Part II)
  // Item 11 NAME (TU="11. NAME OF INDIVIDUAL ... (First, Middle, Last)") is one combined
  // text field. qiFullName is computed in the definition from qiFirstName + qiMiddleName +
  // qiLastName so the middle and last name parts aren't dropped (previously only qiFirstName
  // was mapped, leaving the middle/last blank).
  qiFullName: { pdfFieldName: 'form1[0].Page_1[0].NameofVeteran[0]', type: 'text' },
  qiSSN: { pdfFieldName: 'form1[0].Page_1[0].SSN2[0]', type: 'text' , transform: (v: string) => v.replace(/\D/g, '')},
  qiBranch: { pdfFieldName: 'form1[0].Page_1[0].BRANCHOFSERVICE[0]', type: 'text' },
  // Item 14 DATE OF BIRTH of qualifying individual (DateSigned[1], x=432 y=300, same row as SSN2/branch)
  qiDOB: { pdfFieldName: 'form1[0].Page_1[0].DateSigned[1]', type: 'text', transform: formatDateString },
  // Item 15 DATE OF DEATH / MIA / POW (DateSigned[2], x=36 y=270, row below)
  qiDateOfDeath: { pdfFieldName: 'form1[0].Page_1[0].DateSigned[2]', type: 'text', transform: formatDateString },
  // Item 16 IS QUALIFYING INDIVIDUAL CURRENTLY ON ACTIVE DUTY — right YES/NO group
  // (RadioButtonList[3], widgets x=300/336 y=278, OPTS=[YES,NO]).
  qiOnActiveDuty: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[3]', type: 'radio', transform: v => v === 'Yes' ? 'YES' : 'NO' },

  // Item 17 YOUR RELATIONSHIP TO QUALIFYING INDIVIDUAL — single radio group
  // (RadioButtonList[6], y=248). Printed labels L->R: SPOUSE | SURVIVING SPOUSE | CHILD |
  // STEPCHILD | ADOPTED CHILD. pdf-lib getOptions() returns 1-indexed export labels
  // ["1".."5"] where select("N") ticks widget index N-1. Widget x-order maps to:
  //   "1"=x36 SPOUSE, "2"=x186 CHILD, "3"=x90 SURVIVING SPOUSE, "4"=x234 STEPCHILD,
  //   "5"=x300 ADOPTED CHILD (verified by selecting each value and reading /V).
  relationship: {
    pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[6]',
    type: 'radio',
    transform: v =>
      v === 'Spouse' ? '1'
      : v === 'Child' ? '2'
      : v === 'SurvivingSpouse' ? '3'
      : v === 'Stepchild' ? '4'
      : v === 'AdoptedChild' ? '5'
      : '',
  },

  // Part III - Applicant's Military Service Information
  // Item 18 OUTSTANDING FELONY AND/OR WARRANT — left YES/NO group (RadioButtonList[4],
  // widgets x=36/72 y=218, OPTS=[YES,NO]).
  felonyOrWarrant: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[4]', type: 'radio', transform: v => v === 'Yes' ? 'YES' : 'NO' },
  // Item 19 HAVE YOU EVER SERVED ON ACTIVE DUTY — left YES/NO group (RadioButtonList[5],
  // widgets x=36/72 y=158, OPTS=[YES,NO]).
  applicantServedActiveDuty: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[5]', type: 'radio', transform: v => v === 'Yes' ? 'YES' : 'NO' },
  // Item 20 PERIODS OF ACTIVE DUTY — first (Line 1 of 3) row, tooltips confirm columns:
  //   A. DATE ENTERED = DateSigned[3] (x=54 y=90)
  //   B. DATE SEPARATED = DateSigned[6] (x=186 y=90)
  //   C. BRANCH OF SERVICE OR RESERVE/GUARD COMPONENT = Branch1[0] (x=300 y=91)
  //   D. CHARACTER OF DISCHARGE = CharacterOfDischarge1[0] (x=456 y=91)
  sp1Entered: { pdfFieldName: 'form1[0].Page_1[0].DateSigned[3]', type: 'text', transform: formatDateString },
  sp1Separated: { pdfFieldName: 'form1[0].Page_1[0].DateSigned[6]', type: 'text', transform: formatDateString },
  sp1Branch: { pdfFieldName: 'form1[0].Page_1[0].Branch1[0]', type: 'text' },
  sp1Discharge: { pdfFieldName: 'form1[0].Page_1[0].CharacterOfDischarge1[0]', type: 'text' },

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
