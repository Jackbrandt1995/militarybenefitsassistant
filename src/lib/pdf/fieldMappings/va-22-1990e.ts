import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va221990eMapping: FieldMapping = {
  // Applicant Info - Page 3
  // fullName / cityStateZip / smFullName / smCityStateZip computed by computeAnswers
  fullName: { pdfFieldName: 'F[0].Page_3[0].Name_First_Middle_Initial_Last[0]', type: 'text' },
  ssn: { pdfFieldName: 'F[0].Page_3[0].SSN[0]', type: 'text', transform: v => v.replace(/\D/g, '') },
  street: { pdfFieldName: 'F[0].Page_3[0].NumberandStreet[0]', type: 'text' },
  apt: { pdfFieldName: 'F[0].Page_3[0].AptUnitNumber[0]', type: 'text' },
  cityStateZip: { pdfFieldName: 'F[0].Page_3[0].CityStateZIPCode[0]', type: 'text' },
  homePhone: { pdfFieldName: 'F[0].Page_3[0].Home_Phone[0]', type: 'text' },
  mobilePhone: { pdfFieldName: 'F[0].Page_3[0].Mobile_Phone[0]', type: 'text' },
  homePhoneNone:   { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 510, checkSize: 6 },
  mobilePhoneNone: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 493, checkSize: 6 },
  email: { pdfFieldName: 'F[0].Page_3[0].Email[0]', type: 'text' },

  // Date of Birth — split into three separate comb fields
  dobMonth: { pdfFieldName: 'F[0].Page_3[0].Date_Month[1]', type: 'text' },
  dobDay:   { pdfFieldName: 'F[0].Page_3[0].Date_Day[1]',   type: 'text' },
  dobYear:  { pdfFieldName: 'F[0].Page_3[0].Date_Year[1]',  type: 'text' },

  // HS diploma graduation date — split comb fields (Date_Month[0]/Day[0]/Year[0] at cy≈369 on page 2)
  hsGradMonth: { pdfFieldName: 'F[0].Page_3[0].Date_Month[0]', type: 'text' },
  hsGradDay:   { pdfFieldName: 'F[0].Page_3[0].Date_Day[0]',   type: 'text' },
  hsGradYear:  { pdfFieldName: 'F[0].Page_3[0].Date_Year[0]',  type: 'text' },

  // Sex — draw-check at RadioButtonList[0] kid positions (page 2 / Page_3[0], cy≈652)
  // form prints "FEMALE MALE" left→right: cx=260.0 → Female, cx=310.6 → Male
  sex: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Female' ? 'true' : '', checkPage: 2, checkCX: 260.0, checkCY: 652.6, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Male'   ? 'true' : '', checkPage: 2, checkCX: 310.6, checkCY: 652.6, checkSize: 6 },
  ],

  // Relationship to Service Member — RadioButtonList[1] on page 2 (cy=380, SPOUSE=left cx=39, CHILD=right cx=90)
  relationship: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Spouse' ? 'true' : '', checkPage: 2, checkCX: 43.5, checkCY: 384.5, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Child'  ? 'true' : '', checkPage: 2, checkCX: 94.5, checkCY: 384.5, checkSize: 6 },
  ],

  // HS diploma / GED — draw-check at YES[0] and NO[0] positions (page 2 / Page_3[0], cy≈378)
  hsGrad: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 2, checkCX: 241.5, checkCY: 378.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 2, checkCX: 506.5, checkCY: 378.3, checkSize: 6 },
  ],

  // FAA Flight Certificates (Q10A) — RadioButtonList[0] on page 3 (cy=719, YES=left cx=40, NO=right cx=82)
  faaFlightCerts: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 3, checkCX: 44.5, checkCY: 723.5, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 3, checkCX: 86.5, checkCY: 723.5, checkSize: 6 },
  ],

  // Benefit Chapter — RadioButtonList[3] on page 2 (three kids: cy=322=Ch33, cy=299=Ch30, cy=271=Ch1606)
  benefitChapter: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'chapter33'   ? 'true' : '', checkPage: 2, checkCX: 45.5, checkCY: 326.5, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'chapter30'   ? 'true' : '', checkPage: 2, checkCX: 44.5, checkCY: 303.5, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'chapter1606' ? 'true' : '', checkPage: 2, checkCX: 44.5, checkCY: 275.5, checkSize: 6 },
  ],

  // Education Type checkboxes (driven by educationType radio)
  educationType: [
    { pdfFieldName: 'F[0].Page_3[0].COLLEGE_OR_OTHER_SCHOOL[0]', type: 'checkbox', transform: v => v === 'college' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_3[0].VOCATIONAL_FLIGHT_TRAINING[0]', type: 'checkbox', transform: v => v === 'flight' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_3[0].NATIONAL_TEST_REIMBURSEMENT_SAT_CLEP_ETC[0]', type: 'checkbox', transform: v => v === 'test' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_3[0].LICENSING_OR_CERTIFICATION_TEST_REIMBURSEMENT[0]', type: 'checkbox', transform: v => v === 'licensing' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_3[0].APPRENTICESHIP_OR_ON_THE_JOB[0]', type: 'checkbox', transform: v => v === 'apprenticeship' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_3[0].CORRESPONDENCE[0]', type: 'checkbox', transform: v => v === 'correspondence' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_3[0].TUITION_ASSISTANCE_TOP_UP[0]', type: 'checkbox', transform: v => v === 'topUp' ? 'true' : 'false' },
  ],

  schoolName: { pdfFieldName: 'F[0].Page_3[0].FULL_NAME_AND_ADDRESS_OF_SCHOOL_IF_KNOWN[0]', type: 'text' },
  educationObjective: { pdfFieldName: 'F[0].Page_3[0].Specify_Your_Educational_Or_Career_Objective_If_Known[0]', type: 'text' },

  // Active-duty money (Q11A) — RadioButtonList[1] on page 3 (cy=361, YES=left cx=424, NO=right cx=466)
  activeDutyMoney: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 3, checkCX: 428.5, checkCY: 365.5, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 3, checkCX: 470.5, checkCY: 365.5, checkSize: 6 },
  ],

  // Civilian-employee money (Q11B) — RadioButtonList[2] on page 3 (cy=312, YES=left cx=423, NO=right cx=463)
  civilianMoney: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Yes' ? 'true' : '', checkPage: 3, checkCX: 427.5, checkCY: 316.5, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'No'  ? 'true' : '', checkPage: 3, checkCX: 467.5, checkCY: 316.5, checkSize: 6 },
  ],

  // Direct Deposit
  accountType: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Checking' ? 'true' : '', checkPage: 2, checkCX: 210.2, checkCY: 416.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Savings'  ? 'true' : '', checkPage: 2, checkCX: 273.0, checkCY: 416.0, checkSize: 6 },
  ],
  routingNumber: { pdfFieldName: 'F[0].Page_3[0].Routing_Or_Transit_Number[0]', type: 'text' },
  accountNumber: { pdfFieldName: 'F[0].Page_3[0].Account_Number[0]', type: 'text' },

  // Education history - Page 4
  edu1Name: { pdfFieldName: 'F[0].Page_4[0].nameloc2[0]', type: 'text' },
  edu2Name: { pdfFieldName: 'F[0].Page_4[0].nameloc1[0]', type: 'text' },
  edu1Hours: { pdfFieldName: 'F[0].Page_4[0].numberandtype1[0]', type: 'text' },
  edu2Hours: { pdfFieldName: 'F[0].Page_4[0].numberandtype1[1]', type: 'text' },
  edu1Degree: { pdfFieldName: 'F[0].Page_4[0].degree1[0]', type: 'text' },
  edu2Degree: { pdfFieldName: 'F[0].Page_4[0].degree2[0]', type: 'text' },
  edu1Major: { pdfFieldName: 'F[0].Page_4[0].majorfield1[0]', type: 'text' },
  edu2Major: { pdfFieldName: 'F[0].Page_4[0].majorfield2[0]', type: 'text' },
  edu1From: { pdfFieldName: 'F[0].Page_4[0].datetraing1[0]', type: 'text', transform: formatDateString },
  edu1To: { pdfFieldName: 'F[0].Page_4[0].datetraing2[0]', type: 'text', transform: formatDateString },
  edu2From: { pdfFieldName: 'F[0].Page_4[0].datetraing3[0]', type: 'text', transform: formatDateString },
  edu2To: { pdfFieldName: 'F[0].Page_4[0].datetraing4[0]', type: 'text', transform: formatDateString },

  // Service Member Info — smFullName / smCityStateZip computed by computeAnswers
  smBranch: { pdfFieldName: 'F[0].Page_4[0].Service_Members_Branch_Of_Service[0]', type: 'text' },
  smSSN: { pdfFieldName: 'F[0].Page_4[0].SSN2[0]', type: 'text', transform: v => v.replace(/\D/g, '') },
  smFullName: { pdfFieldName: 'F[0].Page_4[0].Service_Members_Name2[0]', type: 'text' },
  smStreet: { pdfFieldName: 'F[0].Page_4[0].NumberandStreet2[0]', type: 'text' },
  smApt: { pdfFieldName: 'F[0].Page_4[0].AptUnitNumber2[0]', type: 'text' },
  smCityStateZip: { pdfFieldName: 'F[0].Page_4[0].CityStateZIPCode2[0]', type: 'text' },

  // Signer type (Q16A) — RadioButtonList[3] on page 3 (cy=59, APPLICANT=left cx=40, PARENT/GUARDIAN=right cx=119)
  signerType: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Applicant' ? 'true' : '', checkPage: 3, checkCX: 44.5, checkCY: 63.9, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'Guardian'  ? 'true' : '', checkPage: 3, checkCX: 123.7, checkCY: 63.9, checkSize: 6 },
  ],

  // Signature — 13pt gap between 16A label (y=72) and penalty text (y=85.5), left of date at cx=410
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 3, imageX: 37, imageY: 72, imageWidth: 355, imageHeight: 13 },
  ],
  signatureDate: [
    { pdfFieldName: 'F[0].Page_4[0].Date_Signed[0]', type: 'text', transform: formatDateString },
  ],
};
