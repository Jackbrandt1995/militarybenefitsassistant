import type { FieldMapping } from '../fillPdf';
import { formatSSNParts, formatPhoneParts, formatDateForPdf, formatDateString } from '../fillPdf';

export const va221990Mapping: FieldMapping = {
  // ── BENEFIT SELECTION (Step 1) ──
  // Wizard gives a single radio value like "chapter33"; we check the matching PDF checkbox
  benefitChapter: [
    { pdfFieldName: 'form1[0].#subform[3].part2_1[0]', type: 'checkbox', transform: v => v === 'chapter30' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[3].part2_2[0]', type: 'checkbox', transform: v => v === 'chapter33' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[3].part2_3[0]', type: 'checkbox', transform: v => v === 'chapter1606' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[3].part2_5[0]', type: 'checkbox', transform: v => v === 'chapter32' ? 'true' : '' },
  ],

  // ── PERSONAL INFORMATION (Step 2) ──
  // SSN → 3 separate PDF fields
  ssn: [
    { pdfFieldName: 'form1[0].#subform[3].#area[1].ssna1[0]', type: 'text', transform: v => formatSSNParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[3].#area[1].ssna2[0]', type: 'text', transform: v => formatSSNParts(v).middle2 },
    { pdfFieldName: 'form1[0].#subform[3].#area[1].ssna3[0]', type: 'text', transform: v => formatSSNParts(v).last4 },
    // SSN repeated on page 4, 5, 6
    { pdfFieldName: 'form1[0].#subform[4].ssna1[1]', type: 'text', transform: v => formatSSNParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[4].ssna2[1]', type: 'text', transform: v => formatSSNParts(v).middle2 },
    { pdfFieldName: 'form1[0].#subform[4].ssna3[1]', type: 'text', transform: v => formatSSNParts(v).last4 },
    { pdfFieldName: 'form1[0].#subform[5].ssna1[2]', type: 'text', transform: v => formatSSNParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[5].ssna2[2]', type: 'text', transform: v => formatSSNParts(v).middle2 },
    { pdfFieldName: 'form1[0].#subform[5].ssna3[2]', type: 'text', transform: v => formatSSNParts(v).last4 },
    { pdfFieldName: 'form1[0].#subform[6].ssna1[3]', type: 'text', transform: v => formatSSNParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[6].ssna2[3]', type: 'text', transform: v => formatSSNParts(v).middle2 },
    { pdfFieldName: 'form1[0].#subform[6].ssna3[3]', type: 'text', transform: v => formatSSNParts(v).last4 },
  ],

  // Sex → two checkboxes
  sex: [
    { pdfFieldName: 'form1[0].#subform[3].male[0]', type: 'checkbox', transform: v => v === 'Male' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[3].female[0]', type: 'checkbox', transform: v => v === 'Female' ? 'true' : '' },
  ],

  // DOB → 3 fields (MM, DD, YYYY)
  dob: [
    { pdfFieldName: 'form1[0].#subform[3].#area[0].dateofbirth1[0]', type: 'text', transform: v => formatDateForPdf(v).month },
    { pdfFieldName: 'form1[0].#subform[3].#area[0].dateofbirth2[0]', type: 'text', transform: v => formatDateForPdf(v).day },
    { pdfFieldName: 'form1[0].#subform[3].#area[0].dateofbirth3[0]', type: 'text', transform: v => formatDateForPdf(v).year },
  ],

  firstName: { pdfFieldName: 'form1[0].#subform[3].namefirst[0]', type: 'text' },
  middleName: { pdfFieldName: 'form1[0].#subform[3].namemiddle[0]', type: 'text' },
  lastName: { pdfFieldName: 'form1[0].#subform[3].namelast[0]', type: 'text' },

  // ── CONTACT INFORMATION (Step 3) ──
  street: { pdfFieldName: 'form1[0].#subform[3].noandstreet1[0]', type: 'text' },
  street2: { pdfFieldName: 'form1[0].#subform[3].noandstreet100[0]', type: 'text' },
  apt: { pdfFieldName: 'form1[0].#subform[3].aptno1[0]', type: 'text' },
  city: { pdfFieldName: 'form1[0].#subform[3].city1[0]', type: 'text' },
  state: { pdfFieldName: 'form1[0].#subform[3].state1[0]', type: 'text' },
  zip: { pdfFieldName: 'form1[0].#subform[3].zip1[0]', type: 'text' },
  email: { pdfFieldName: 'form1[0].#subform[3].email1[0]', type: 'text' },

  // Primary phone → 3 PDF fields (p = primary)
  phonePrimary: [
    { pdfFieldName: 'form1[0].#subform[3].areacodep1[0]', type: 'text', transform: v => formatPhoneParts(v).areaCode },
    { pdfFieldName: 'form1[0].#subform[3].primaryphone1[0]', type: 'text', transform: v => formatPhoneParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[3].primaryphone4[0]', type: 'text', transform: v => formatPhoneParts(v).last4 },
  ],

  // Secondary phone → 3 PDF fields (s = secondary)
  phoneSecondary: [
    { pdfFieldName: 'form1[0].#subform[3].areacodes1[0]', type: 'text', transform: v => formatPhoneParts(v).areaCode },
    { pdfFieldName: 'form1[0].#subform[3].secondaryphone1[0]', type: 'text', transform: v => formatPhoneParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[3].secondaryphone4[0]', type: 'text', transform: v => formatPhoneParts(v).last4 },
  ],

  // ── DIRECT DEPOSIT (Step 4) ──
  accountType: [
    { pdfFieldName: 'form1[0].#subform[3].checking[0]', type: 'checkbox', transform: v => v === 'Checking' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[3].savings[0]', type: 'checkbox', transform: v => v === 'Savings' ? 'true' : '' },
  ],
  routingNumber: { pdfFieldName: 'form1[0].#subform[3].routingno1[0]', type: 'text' },
  accountNumber: { pdfFieldName: 'form1[0].#subform[3].accountno1[0]', type: 'text' },

  // ── EMERGENCY CONTACT (Step 5) ──
  emergencyName: { pdfFieldName: 'form1[0].#subform[3].Aname[0]', type: 'text' },
  emergencyAddress: { pdfFieldName: 'form1[0].#subform[3].Baddress[0]', type: 'text' },
  emergencyPhone: { pdfFieldName: 'form1[0].#subform[3].Cnumber[0]', type: 'text' },

  // ── EDUCATION TYPE & SCHOOL (Step 6) ──
  educationType: [
    { pdfFieldName: 'form1[0].#subform[4].type9A_1[0]', type: 'checkbox', transform: v => v === 'college' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[4].type9A_2[0]', type: 'checkbox', transform: v => v === 'correspondence' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[4].type9A_3[0]', type: 'checkbox', transform: v => v === 'apprenticeship' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[4].type9A_4[0]', type: 'checkbox', transform: v => v === 'flight' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[4].type9A_5[0]', type: 'checkbox', transform: v => v === 'nationalTest' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[4].type9A_6[0]', type: 'checkbox', transform: v => v === 'licensingTest' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[4].type9A_7[0]', type: 'checkbox', transform: v => v === 'taTopUp' ? 'true' : '' },
  ],
  schoolNameAddress: { pdfFieldName: 'form1[0].#subform[4].providethefullname[0]', type: 'text' },
  educationObjective: { pdfFieldName: 'form1[0].#subform[4].pleasespecify[0]', type: 'text' },

  // ── MILITARY SERVICE (Step 7) ──
  onActiveDuty: [
    { pdfFieldName: 'form1[0].#subform[4].yes11[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[4].no11[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],
  onTerminalLeave: [
    { pdfFieldName: 'form1[0].#subform[4].yes12[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[4].no12[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],

  // Service Period 1
  service1Entered: { pdfFieldName: 'form1[0].#subform[4].Dateentered1[0]', type: 'text', transform: formatDateString },
  service1Separated: { pdfFieldName: 'form1[0].#subform[4].Dateseperated1[0]', type: 'text', transform: formatDateString },
  service1Branch: { pdfFieldName: 'form1[0].#subform[4].servicecomp1[0]', type: 'text' },
  service1Status: { pdfFieldName: 'form1[0].#subform[4].servicestatus1[0]', type: 'text' },
  service1Involuntary: { pdfFieldName: 'form1[0].#subform[4].InvoluntarilyCalled1[0]', type: 'text' },

  // Service Period 2
  service2Entered: { pdfFieldName: 'form1[0].#subform[4].Dateentered2[0]', type: 'text', transform: formatDateString },
  service2Separated: { pdfFieldName: 'form1[0].#subform[4].Dateseperated2[0]', type: 'text', transform: formatDateString },
  service2Branch: { pdfFieldName: 'form1[0].#subform[4].servicecomp2[0]', type: 'text' },
  service2Status: { pdfFieldName: 'form1[0].#subform[4].servicestatus2[0]', type: 'text' },

  // Service Period 3
  service3Entered: { pdfFieldName: 'form1[0].#subform[4].Dateentered3[0]', type: 'text', transform: formatDateString },
  service3Separated: { pdfFieldName: 'form1[0].#subform[4].Dateseperated3[0]', type: 'text', transform: formatDateString },
  service3Branch: { pdfFieldName: 'form1[0].#subform[4].servicecomp3[0]', type: 'text' },

  // ROTC (Q14a: Were you commissioned through Senior ROTC?)
  seniorROTC: [
    { pdfFieldName: 'form1[0].#subform[4].yes14a[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[4].no14a[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],

  // ── EDUCATION HISTORY (Step 8) ──
  hsGrad: [
    { pdfFieldName: 'form1[0].#subform[5].yes7[0]', type: 'checkbox', transform: v => v === 'true' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[5].no7[0]', type: 'checkbox', transform: v => v === 'false' ? 'true' : '' },
  ],
  hsGradDate: { pdfFieldName: 'form1[0].#subform[5].gradyear[0]', type: 'text', transform: v => v.split('-')[0] },
  faaFlightCerts: [
    { pdfFieldName: 'form1[0].#subform[5].yes8[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[5].no8[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],

  edu1Name: { pdfFieldName: 'form1[0].#subform[5].nameandlocation1[0]', type: 'text' },
  edu1From: { pdfFieldName: 'form1[0].#subform[5].Datetrainfrom1[0]', type: 'text', transform: formatDateString },
  edu1To: { pdfFieldName: 'form1[0].#subform[5].DateTo1[0]', type: 'text', transform: formatDateString },
  edu1Hours: { pdfFieldName: 'form1[0].#subform[5].noandtype1[0]', type: 'text' },
  edu1Degree: { pdfFieldName: 'form1[0].#subform[5].degree1[0]', type: 'text' },
  edu1Major: { pdfFieldName: 'form1[0].#subform[5].majorfield1[0]', type: 'text' },

  edu2Name: { pdfFieldName: 'form1[0].#subform[5].nameandlocation2[0]', type: 'text' },
  edu2From: { pdfFieldName: 'form1[0].#subform[5].Datetrainfrom2[0]', type: 'text', transform: formatDateString },
  edu2To: { pdfFieldName: 'form1[0].#subform[5].DateTo2[0]', type: 'text', transform: formatDateString },
  edu2Hours: { pdfFieldName: 'form1[0].#subform[5].noandtype2[0]', type: 'text' },
  edu2Degree: { pdfFieldName: 'form1[0].#subform[5].degree2[0]', type: 'text' },
  edu2Major: { pdfFieldName: 'form1[0].#subform[5].majorfield2[0]', type: 'text' },

  // ── EMPLOYMENT (Step 9) ──
  emp1Occupation: { pdfFieldName: 'form1[0].#subform[5].principaloccupation1[0]', type: 'text' },
  emp1Months: { pdfFieldName: 'form1[0].#subform[5].noofmonths1[0]', type: 'text' },
  emp1License: { pdfFieldName: 'form1[0].#subform[5].licorrating1[0]', type: 'text' },
  emp2Occupation: { pdfFieldName: 'form1[0].#subform[5].principaloccupation2[0]', type: 'text' },
  emp2Months: { pdfFieldName: 'form1[0].#subform[5].noofmonths2[0]', type: 'text' },
  emp2License: { pdfFieldName: 'form1[0].#subform[5].licorrating2[0]', type: 'text' },

  // ── ADDITIONAL INFORMATION (Step 10) ──
  mgibContributions: [
    { pdfFieldName: 'form1[0].#subform[5].yes9[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[5].no9[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],
  activeDutyKicker: [
    { pdfFieldName: 'form1[0].#subform[5].yes10[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[5].no10[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],
  reserveKicker: [
    { pdfFieldName: 'form1[0].#subform[5].yes11[1]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[5].no11[1]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],
  receivingMilitaryTuition: [
    { pdfFieldName: 'form1[0].#subform[5].yes12[1]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[5].no12[1]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],
  married: [
    { pdfFieldName: 'form1[0].#subform[6].yes22[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[6].no22[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],
  dependentChildren: [
    { pdfFieldName: 'form1[0].#subform[6].yes23[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[6].no23[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],
  dependentParent: [
    { pdfFieldName: 'form1[0].#subform[6].yes24[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[6].no24[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],
  remarks: { pdfFieldName: 'form1[0].#subform[6].remarks[0]', type: 'text' },

  // ── PART VIII & IX ADDITIONAL QUESTIONS ──
  previousFederalBenefits: [
    { pdfFieldName: 'form1[0].#subform[5].yes13[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[5].no13[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],
  previousVABenefits: [
    { pdfFieldName: 'form1[0].#subform[5].yes14[0]', type: 'checkbox', transform: v => v === 'Yes' ? 'true' : '' },
    { pdfFieldName: 'form1[0].#subform[5].no14[0]', type: 'checkbox', transform: v => v === 'No' ? 'true' : '' },
  ],
  previouslyApplied: { pdfFieldName: 'form1[0].#subform[6].Checkhere[0]', type: 'checkbox', transform: v => v === 'true' ? 'true' : '' },

  // ── SIGNATURE (Step 12) ──
  signatureDate: { pdfFieldName: 'form1[0].#subform[6].Datesigned[0]', type: 'text', transform: formatDateString },
};
