import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va221990eMapping: FieldMapping = {
  // Applicant Info - Page 3
  // fullName / cityStateZip / smFullName / smCityStateZip computed by computeAnswers
  fullName: { pdfFieldName: 'F[0].Page_3[0].Name_First_Middle_Initial_Last[0]', type: 'text' },
  ssn: { pdfFieldName: 'F[0].Page_3[0].SSN[0]', type: 'text' },
  street: { pdfFieldName: 'F[0].Page_3[0].NumberandStreet[0]', type: 'text' },
  apt: { pdfFieldName: 'F[0].Page_3[0].AptUnitNumber[0]', type: 'text' },
  cityStateZip: { pdfFieldName: 'F[0].Page_3[0].CityStateZIPCode[0]', type: 'text' },
  homePhone: { pdfFieldName: 'F[0].Page_3[0].Home_Phone[0]', type: 'text' },
  mobilePhone: { pdfFieldName: 'F[0].Page_3[0].Mobile_Phone[0]', type: 'text' },
  homePhoneNone:   { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 510, checkSize: 6 },
  mobilePhoneNone: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 493, checkSize: 6 },
  email: { pdfFieldName: 'F[0].Page_3[0].Email[0]', type: 'text' },

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

  // Direct Deposit
  routingNumber: { pdfFieldName: 'F[0].Page_3[0].Routing_Or_Transit_Number[0]', type: 'text' },
  accountNumber: { pdfFieldName: 'F[0].Page_3[0].Account_Number[0]', type: 'text' },

  // Education history - Page 4
  edu1Name: { pdfFieldName: 'F[0].Page_4[0].nameloc1[0]', type: 'text' },
  edu2Name: { pdfFieldName: 'F[0].Page_4[0].nameloc2[0]', type: 'text' },
  edu1Hours: { pdfFieldName: 'F[0].Page_4[0].numberandtype1[0]', type: 'text' },
  edu2Hours: { pdfFieldName: 'F[0].Page_4[0].numberandtype1[1]', type: 'text' },
  edu1Degree: { pdfFieldName: 'F[0].Page_4[0].degree1[0]', type: 'text' },
  edu2Degree: { pdfFieldName: 'F[0].Page_4[0].degree2[0]', type: 'text' },
  edu1Major: { pdfFieldName: 'F[0].Page_4[0].majorfield1[0]', type: 'text' },
  edu2Major: { pdfFieldName: 'F[0].Page_4[0].majorfield2[0]', type: 'text' },
  edu1From: { pdfFieldName: 'F[0].Page_4[0].datetraing1[0]', type: 'text', transform: formatDateString },
  edu1To: { pdfFieldName: 'F[0].Page_4[0].datetraing4[0]', type: 'text', transform: formatDateString },
  edu2From: { pdfFieldName: 'F[0].Page_4[0].datetraing3[0]', type: 'text', transform: formatDateString },
  edu2To: { pdfFieldName: 'F[0].Page_4[0].datetraing2[0]', type: 'text', transform: formatDateString },

  // Service Member Info — smFullName / smCityStateZip computed by computeAnswers
  smBranch: { pdfFieldName: 'F[0].Page_4[0].Service_Members_Branch_Of_Service[0]', type: 'text' },
  smSSN: { pdfFieldName: 'F[0].Page_4[0].SSN2[0]', type: 'text' },
  smFullName: { pdfFieldName: 'F[0].Page_4[0].Service_Members_Name2[0]', type: 'text' },
  smStreet: { pdfFieldName: 'F[0].Page_4[0].NumberandStreet2[0]', type: 'text' },
  smApt: { pdfFieldName: 'F[0].Page_4[0].AptUnitNumber2[0]', type: 'text' },
  smCityStateZip: { pdfFieldName: 'F[0].Page_4[0].CityStateZIPCode2[0]', type: 'text' },

  // Signature is on page 3 (last page, 0-indexed). AcroForm date Date_Signed[0]: page=3 x=410 y=49
  // Sig box is XFA-only; image placed at same page/y.
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 3, imageX: 36, imageY: 45, imageWidth: 230, imageHeight: 20 },
  ],
  signatureDate: [
    { pdfFieldName: 'F[0].Page_4[0].Date_Signed[0]', type: 'text', transform: formatDateString },
    { pdfFieldName: 'DRAW_TEXT_DATE', type: 'draw-text', transform: formatDateString, textPage: 3, textX: 410, textY: 51, textSize: 10 },
  ],
};
