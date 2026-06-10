import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va225490Mapping: FieldMapping = {
  // Applicant – Page 1
  // fullName / fullAddress computed by computeAnswers in the form definition
  fullName: { pdfFieldName: 'form1[0].Page_1[0].NAME[0]', type: 'text' },
  ssn: { pdfFieldName: 'form1[0].Page_1[0].SSN[0]', type: 'text' , transform: (v: string) => v.replace(/\D/g, '')},
  dob: { pdfFieldName: 'form1[0].Page_1[0].DOB[0]', type: 'text', transform: formatDateString },
  // GENDER (Q2) is a single radio group with export options MALE | FEMALE.
  sex: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[0]', type: 'radio', transform: v => v === 'Male' ? 'MALE' : 'FEMALE' },
  fullAddress: { pdfFieldName: 'form1[0].Page_1[0].address[0]', type: 'text' },
  homePhone: { pdfFieldName: 'form1[0].Page_1[0].PrimaryTelephone[0]', type: 'text' },
  mobilePhone: { pdfFieldName: 'form1[0].Page_1[0].SecondaryTelephone[0]', type: 'text' },
  homePhoneNone:   { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 510, checkSize: 6 },
  mobilePhoneNone: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 493, checkSize: 6 },
  email: { pdfFieldName: 'form1[0].Page_1[0].EMAIL[0]', type: 'text' },

  // Direct Deposit (Q8). ACCOUNT TYPE is a single radio group: CHECKING | SAVINGS.
  accountType: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[1]', type: 'radio', transform: v => v === 'Savings' ? 'SAVINGS' : 'CHECKING' },
  // Routing/account number text fields are (mis)named SocialSecurityNumber[2]/[3] in the real PDF.
  // Confirmed via tooltip: [2]="ROUTING OR TRANSIT NUMBER", [3]="ACCOUNT NUMBER".
  routingNumber: { pdfFieldName: 'form1[0].Page_1[0].SocialSecurityNumber[2]', type: 'text', transform: (v: string) => v.replace(/\D/g, '') },
  accountNumber: { pdfFieldName: 'form1[0].Page_1[0].SocialSecurityNumber[3]', type: 'text' },

  // Qualifying Individual (updated field IDs to match new definition)
  qiFirstName: { pdfFieldName: 'form1[0].Page_1[0].Name[1]', type: 'text' },
  qiSSN: { pdfFieldName: 'form1[0].Page_1[0].SocialSecurityNumber[1]', type: 'text' , transform: (v: string) => v.replace(/\D/g, '')},
  qiBranch: { pdfFieldName: 'form1[0].Page_1[0].BranchService[0]', type: 'text' },
  qiDOB: { pdfFieldName: 'form1[0].Page_1[0].DOB2[0]', type: 'text', transform: formatDateString },
  qiDateMIA: { pdfFieldName: 'form1[0].Page_1[0].DateListed[0]', type: 'text', transform: formatDateString },
  qiDateOfDeath: { pdfFieldName: 'form1[0].Page_1[0].DateofDeath[0]', type: 'text', transform: formatDateString },
  // Q14 "IS QUALIFYING INDIVIDUAL CURRENTLY ON ACTIVE DUTY?" — left column YES/NO group
  // on page 1 (RadioButtonList[3], rect y=229 x=36). Options: YES | NO.
  qiOnActiveDuty: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[3]', type: 'radio', transform: v => v === 'Yes' ? 'YES' : 'NO' },

  // Benefit type – Page 2
  benefitType: [
    { pdfFieldName: 'form1[0].Page_2[0].CheckBox_Chapter35DEA[0]', type: 'checkbox', transform: v => v === 'DEA' ? 'true' : 'false' },
    { pdfFieldName: 'form1[0].Page_2[0].CheckBox_Chapter33_FRYScholarship[0]', type: 'checkbox', transform: v => v === 'Fry' ? 'true' : 'false' },
  ],

  // Education info – Page 2. Q23 "HAS THE APPLICANT GRADUATED HIGH SCHOOL OR RECEIVED A GED?"
  // is a single radio group (Page_2 RadioButtonList[3]) whose export options are long strings.
  hsGraduated: {
    pdfFieldName: 'form1[0].Page_2[0].RadioButtonList[3]',
    type: 'radio',
    transform: v => v === 'Yes'
      ? 'YES (If "YES," please provide the date of graduation or the date you received GED) (MM/DD/YYYY)'
      : 'NO (If "NO," please provide the expected date of graduation or GED) (MM/DD/YYYY)',
  },
  // hsGradDate removed: orphan key — no matching wizard question (the definition only
  // collects hsGraduated Yes/No) and computeAnswers never produces it, so it was always blank.

  // Service Periods – Page 3
  sp1Entered: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].DateEntered[0]', type: 'text', transform: formatDateString },
  sp1Separated: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].DateEntered[1]', type: 'text', transform: formatDateString },
  sp1Branch: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].BranchReserveGuard1[0]', type: 'text' },
  sp1Discharge: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].characterdischarge1[0]', type: 'text' },

  // Signature image overlay + draw-text date fallback
  // AcroForm fields confirmed: SignatureField11[0] page=2 x=36 y=288 w=378 h=24 (applicant)
  //                            DateSigned[2] page=2 x=426 y=288
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 2, imageX: 36, imageY: 284, imageWidth: 230, imageHeight: 24 },
  ],
  signatureDate: [
    { pdfFieldName: 'form1[0].Page_3[0].DateSigned[2]', type: 'text', transform: formatDateString },
    { pdfFieldName: 'DRAW_TEXT_DATE', type: 'draw-text', transform: formatDateString, textPage: 2, textX: 426, textY: 290, textSize: 10 },
  ],
};
