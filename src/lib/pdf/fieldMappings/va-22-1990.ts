import type { FieldMapping } from '../fillPdf';
import { formatSSNParts, formatPhoneParts, formatDateForPdf } from '../fillPdf';

export const va221990Mapping: FieldMapping = {
  // Personal - Page 3
  firstName: { pdfFieldName: 'form1[0].#subform[3].namefirst[0]', type: 'text' },
  middleName: { pdfFieldName: 'form1[0].#subform[3].namemiddle[0]', type: 'text' },
  lastName: { pdfFieldName: 'form1[0].#subform[3].namelast[0]', type: 'text' },
  ssn_1: { pdfFieldName: 'form1[0].#subform[3].#area[1].ssna1[0]', type: 'text' },
  ssn_2: { pdfFieldName: 'form1[0].#subform[3].#area[1].ssna2[0]', type: 'text' },
  ssn_3: { pdfFieldName: 'form1[0].#subform[3].#area[1].ssna3[0]', type: 'text' },
  dob_month: { pdfFieldName: 'form1[0].#subform[3].#area[0].dateofbirth1[0]', type: 'text' },
  dob_day: { pdfFieldName: 'form1[0].#subform[3].#area[0].dateofbirth2[0]', type: 'text' },
  dob_year: { pdfFieldName: 'form1[0].#subform[3].#area[0].dateofbirth3[0]', type: 'text' },
  sex_male: { pdfFieldName: 'form1[0].#subform[3].male[0]', type: 'checkbox' },
  sex_female: { pdfFieldName: 'form1[0].#subform[3].female[0]', type: 'checkbox' },

  // Contact
  street: { pdfFieldName: 'form1[0].#subform[3].noandstreet1[0]', type: 'text' },
  apt: { pdfFieldName: 'form1[0].#subform[3].aptno1[0]', type: 'text' },
  city: { pdfFieldName: 'form1[0].#subform[3].city1[0]', type: 'text' },
  state: { pdfFieldName: 'form1[0].#subform[3].state1[0]', type: 'text' },
  zip: { pdfFieldName: 'form1[0].#subform[3].zip1[0]', type: 'text' },
  primaryPhone_area: { pdfFieldName: 'form1[0].#subform[3].areacodes1[0]', type: 'text' },
  primaryPhone_first3: { pdfFieldName: 'form1[0].#subform[3].primaryphone1[0]', type: 'text' },
  primaryPhone_last4: { pdfFieldName: 'form1[0].#subform[3].primaryphone4[0]', type: 'text' },
  secondaryPhone_area: { pdfFieldName: 'form1[0].#subform[3].areacodep1[0]', type: 'text' },
  secondaryPhone_first3: { pdfFieldName: 'form1[0].#subform[3].secondaryphone1[0]', type: 'text' },
  secondaryPhone_last4: { pdfFieldName: 'form1[0].#subform[3].secondaryphone4[0]', type: 'text' },
  email: { pdfFieldName: 'form1[0].#subform[3].email1[0]', type: 'text' },

  // Direct Deposit
  accountType_savings: { pdfFieldName: 'form1[0].#subform[3].savings[0]', type: 'checkbox' },
  accountType_checking: { pdfFieldName: 'form1[0].#subform[3].checking[0]', type: 'checkbox' },
  routingNumber: { pdfFieldName: 'form1[0].#subform[3].routingno1[0]', type: 'text' },
  accountNumber: { pdfFieldName: 'form1[0].#subform[3].accountno1[0]', type: 'text' },

  // Emergency Contact
  emergencyName: { pdfFieldName: 'form1[0].#subform[3].Aname[0]', type: 'text' },
  emergencyAddress: { pdfFieldName: 'form1[0].#subform[3].Baddress[0]', type: 'text' },
  emergencyPhone: { pdfFieldName: 'form1[0].#subform[3].Cnumber[0]', type: 'text' },

  // Benefit Selection - Part 2
  benefit_ch30: { pdfFieldName: 'form1[0].#subform[3].part2_1[0]', type: 'checkbox' },
  benefit_ch33: { pdfFieldName: 'form1[0].#subform[3].part2_2[0]', type: 'checkbox' },
  benefit_ch1606: { pdfFieldName: 'form1[0].#subform[3].part2_3[0]', type: 'checkbox' },
  benefit_ch1607: { pdfFieldName: 'form1[0].#subform[3].part2_5[0]', type: 'checkbox' },

  // School/Training - Page 4
  schoolAddress: { pdfFieldName: 'form1[0].#subform[3].noandstreet100[0]', type: 'text' },
  transferorName: { pdfFieldName: 'form1[0].#subform[4].providethefullname[0]', type: 'text' },
  benefitSpecify: { pdfFieldName: 'form1[0].#subform[4].pleasespecify[0]', type: 'text' },
  receivedBenefitsYes: { pdfFieldName: 'form1[0].#subform[4].yes11[0]', type: 'checkbox' },
  receivedBenefitsNo: { pdfFieldName: 'form1[0].#subform[4].no11[0]', type: 'checkbox' },
  hasDependentsYes: { pdfFieldName: 'form1[0].#subform[4].yes12[0]', type: 'checkbox' },
  hasDependentsNo: { pdfFieldName: 'form1[0].#subform[4].no12[0]', type: 'checkbox' },

  // Education Type - Page 4
  edType_college: { pdfFieldName: 'form1[0].#subform[4].type9A_1[0]', type: 'checkbox' },
  edType_correspondence: { pdfFieldName: 'form1[0].#subform[4].type9A_2[0]', type: 'checkbox' },
  edType_apprenticeship: { pdfFieldName: 'form1[0].#subform[4].type9A_3[0]', type: 'checkbox' },
  edType_flight: { pdfFieldName: 'form1[0].#subform[4].type9A_4[0]', type: 'checkbox' },
  edType_testReimbursement: { pdfFieldName: 'form1[0].#subform[4].type9A_5[0]', type: 'checkbox' },
  edType_licensing: { pdfFieldName: 'form1[0].#subform[4].type9A_6[0]', type: 'checkbox' },
  edType_topUp: { pdfFieldName: 'form1[0].#subform[4].type9A_7[0]', type: 'checkbox' },

  // Service Periods - Page 4
  sp1Entered: { pdfFieldName: 'form1[0].#subform[4].Dateentered1[0]', type: 'text' },
  sp1Separated: { pdfFieldName: 'form1[0].#subform[4].Dateseperated1[0]', type: 'text' },
  sp1Branch: { pdfFieldName: 'form1[0].#subform[4].servicecomp1[0]', type: 'text' },
  sp1Status: { pdfFieldName: 'form1[0].#subform[4].servicestatus1[0]', type: 'text' },
  sp1Involuntary: { pdfFieldName: 'form1[0].#subform[4].InvoluntarilyCalled1[0]', type: 'text' },
  sp2Entered: { pdfFieldName: 'form1[0].#subform[4].Dateentered2[0]', type: 'text' },
  sp2Separated: { pdfFieldName: 'form1[0].#subform[4].Dateseperated2[0]', type: 'text' },
  sp2Branch: { pdfFieldName: 'form1[0].#subform[4].servicecomp2[0]', type: 'text' },
  sp2Status: { pdfFieldName: 'form1[0].#subform[4].servicestatus2[0]', type: 'text' },
  sp2Involuntary: { pdfFieldName: 'form1[0].#subform[4].InvoluntarilyCalled2[0]', type: 'text' },
  sp3Entered: { pdfFieldName: 'form1[0].#subform[4].Dateentered3[0]', type: 'text' },
  sp3Separated: { pdfFieldName: 'form1[0].#subform[4].Dateseperated3[0]', type: 'text' },
  sp3Branch: { pdfFieldName: 'form1[0].#subform[4].servicecomp3[0]', type: 'text' },
  sp3Status: { pdfFieldName: 'form1[0].#subform[4].servicestatus3[0]', type: 'text' },
  sp3Involuntary: { pdfFieldName: 'form1[0].#subform[4].InvoluntarilyCalled3[0]', type: 'text' },

  receivedROTCYes: { pdfFieldName: 'form1[0].#subform[4].yes14a[0]', type: 'checkbox' },
  receivedROTCNo: { pdfFieldName: 'form1[0].#subform[4].no14a[0]', type: 'checkbox' },
  rotcDate: { pdfFieldName: 'form1[0].#subform[4].Date14a[0]', type: 'text' },
  seniorROTCYes: { pdfFieldName: 'form1[0].#subform[4].yes14b[0]', type: 'checkbox' },
  seniorROTCNo: { pdfFieldName: 'form1[0].#subform[4].no14b[0]', type: 'checkbox' },

  // Education History - Page 5
  edInst1Name: { pdfFieldName: 'form1[0].#subform[5].nameandlocation1[0]', type: 'text' },
  edInst1From: { pdfFieldName: 'form1[0].#subform[5].Datetrainfrom1[0]', type: 'text' },
  edInst1To: { pdfFieldName: 'form1[0].#subform[5].DateTo1[0]', type: 'text' },
  edInst1Hours: { pdfFieldName: 'form1[0].#subform[5].noandtype1[0]', type: 'text' },
  edInst1Degree: { pdfFieldName: 'form1[0].#subform[5].degree1[0]', type: 'text' },
  edInst1Major: { pdfFieldName: 'form1[0].#subform[5].majorfield1[0]', type: 'text' },
  edInst2Name: { pdfFieldName: 'form1[0].#subform[5].nameandlocation2[0]', type: 'text' },
  edInst2From: { pdfFieldName: 'form1[0].#subform[5].Datetrainfrom2[0]', type: 'text' },
  edInst2To: { pdfFieldName: 'form1[0].#subform[5].DateTo2[0]', type: 'text' },
  edInst2Hours: { pdfFieldName: 'form1[0].#subform[5].noandtype2[0]', type: 'text' },
  edInst2Degree: { pdfFieldName: 'form1[0].#subform[5].degree2[0]', type: 'text' },
  edInst2Major: { pdfFieldName: 'form1[0].#subform[5].majorfield2[0]', type: 'text' },

  // Employment - Page 5
  emp1Occupation: { pdfFieldName: 'form1[0].#subform[5].principaloccupation1[0]', type: 'text' },
  emp1Months: { pdfFieldName: 'form1[0].#subform[5].noofmonths1[0]', type: 'text' },
  emp1License: { pdfFieldName: 'form1[0].#subform[5].licorrating1[0]', type: 'text' },
  emp2Occupation: { pdfFieldName: 'form1[0].#subform[5].principaloccupation2[0]', type: 'text' },
  emp2Months: { pdfFieldName: 'form1[0].#subform[5].noofmonths2[0]', type: 'text' },
  emp2License: { pdfFieldName: 'form1[0].#subform[5].licorrating2[0]', type: 'text' },

  // HS Grad Year
  hsGradYear: { pdfFieldName: 'form1[0].#subform[5].gradyear[0]', type: 'text' },

  // Additional Info - Page 6
  remarks: { pdfFieldName: 'form1[0].#subform[6].remarks[0]', type: 'text' },
};
