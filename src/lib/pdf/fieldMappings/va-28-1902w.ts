import type { FieldMapping } from '../fillPdf';

/**
 * VA Form 28-1902w (NOV 2024) — Rehabilitation Needs Inventory.
 *
 * All entries write named AcroForm fields (XFA-hybrid names verified against
 * the real PDF with pdf-lib). Radio values are the EXACT getOptions() strings.
 *
 * PDF fields intentionally left unmapped (VRC-facing — the counselor, not the
 * claimant, completes them during the initial evaluation):
 *   - form1[0].#subform[0].VRCName[0]
 *       Printed label: "VRC NAME" — the Vocational Rehabilitation Counselor's
 *       own name on page 1.
 *   - form1[0].#subform[19].NAMEOFVOCATIONALREHABILITATIONCOUNSELOR[0]
 *       Printed label: "29. NAME OF VOCATIONAL REHABILITATION COUNSELOR".
 *   - form1[0].#subform[19].Date[0]
 *       Printed label: "30. DATE (MM/DD/YYYY)" — pairs with Item 29; the VRC
 *       dates the form at the evaluation session.
 *
 * Quirks verified against the AcroForm:
 *   - The second "PROVIDEADESCRIPTIONOFJOBDUTIESINDETAIL*[1]" box in each job
 *     block is actually the "DO THE JOB DUTIES AGGRAVATE THE CLAIMANT'S
 *     SERVICE-CONNECTED DISABILITIES?" answer box (XFA misnamed it).
 *   - Branch of service is split across two radio groups: RadioButtonList[8]
 *     (ARMY…NOAA, "OTHER (Specify)", and "YES" = the SELECTED SERVICE row)
 *     plus a one-option group RadioButtonList[9] ("USPHS"). Same for Item 13A
 *     via RadioButtonList[10]/[11]. The single wizard radio fans out to both.
 *   - Item 19's field name contains a literal "\." before "[0]".
 */
export const va281902wMapping: FieldMapping = {
  // ── Claimant information (page 1) ─────────────────────────────────────────
  firstName: { pdfFieldName: 'form1[0].#subform[0].FirstName[0]', type: 'text' },
  middleInitial: { pdfFieldName: 'form1[0].#subform[0].MiddleInitial[0]', type: 'text' },
  lastName: { pdfFieldName: 'form1[0].#subform[0].LastName[0]', type: 'text' },
  // The form only prints the LAST FOUR of the VA file number (maxLength 4)
  vaFileNumber: { pdfFieldName: 'form1[0].#subform[0].VAFILENUMBER[0]', type: 'text', transform: v => v.replace(/\D/g, '').slice(-4) },

  // ── Section I: contact verification checkboxes ────────────────────────────
  // Widget rects: [0]=x56,y306 ADDRESS · [3]=x283,y306 EMAIL · [2]=x56,y289 PHONE · [1]=x283,y289 MARITAL
  verifiedAddress: { pdfFieldName: 'form1[0].#subform[0].CheckBox1[0]', type: 'checkbox' },
  verifiedEmail: { pdfFieldName: 'form1[0].#subform[0].CheckBox1[3]', type: 'checkbox' },
  verifiedPhone: { pdfFieldName: 'form1[0].#subform[0].CheckBox1[2]', type: 'checkbox' },
  verifiedMaritalStatus: { pdfFieldName: 'form1[0].#subform[0].CheckBox1[1]', type: 'checkbox' },

  // ── Section II: employment status (Items 1-3) ─────────────────────────────
  providedResume: { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[0]', type: 'radio' },
  currentlyEmployed: { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'radio' },
  unemployedDuration: { pdfFieldName: 'form1[0].#subform[0].HOWLONGUNEMPLOYED[0]', type: 'text' },
  unemployedActivities: { pdfFieldName: 'form1[0].#subform[0].WHATDIDCLAIMANTDOWHENUNEMPLOYED[0]', type: 'text' },

  // ── Section II: Job 1 (Item 4, page 2) ────────────────────────────────────
  job1Title: { pdfFieldName: 'form1[0].#subform[13].JOBTITLE[0]', type: 'text' },
  job1Employer: { pdfFieldName: 'form1[0].#subform[13].NAMEOFEMPLOYER[0]', type: 'text' },
  job1Dates: { pdfFieldName: 'form1[0].#subform[13].DATESOFEMPLOYEMENT[0]', type: 'text' },
  job1Schedule: { pdfFieldName: 'form1[0].#subform[13].RadioButtonList[2]', type: 'radio' },
  job1Salary: { pdfFieldName: 'form1[0].#subform[13].AVERAGEGROSSMONTHLYSALARY[0]', type: 'text' },
  job1Duties: { pdfFieldName: 'form1[0].#subform[13].PROVIDEADESCRIPTIONOFJOBDUTIESINDETAIL[0]', type: 'text' },
  job1Aggravate: { pdfFieldName: 'form1[0].#subform[13].PROVIDEADESCRIPTIONOFJOBDUTIESINDETAIL[1]', type: 'text' }, // "DO THE JOB DUTIES AGGRAVATE…" box
  job1ReasonLeft: { pdfFieldName: 'form1[0].#subform[13].WHATISTHECLAIMANTSREASONFORLEAVINGEMPLOYMENT[0]', type: 'text' },

  // ── Job 2 (Item 5, page 2) ────────────────────────────────────────────────
  job2Title: { pdfFieldName: 'form1[0].#subform[13].JOBTITLE11[0]', type: 'text' },
  job2Employer: { pdfFieldName: 'form1[0].#subform[13].NAMEOFEMPLOYER11[0]', type: 'text' },
  job2Dates: { pdfFieldName: 'form1[0].#subform[13].DATESOFEMPLOYEMENT11[0]', type: 'text' },
  job2Schedule: { pdfFieldName: 'form1[0].#subform[13].RadioButtonList[3]', type: 'radio' },
  job2Salary: { pdfFieldName: 'form1[0].#subform[13].AVERAGEGROSSMONTHLYSALARY11[0]', type: 'text' },
  job2Duties: { pdfFieldName: 'form1[0].#subform[13].PROVIDEADESCRIPTIONOFJOBDUTIESINDETAIL11[0]', type: 'text' },
  job2Aggravate: { pdfFieldName: 'form1[0].#subform[13].PROVIDEADESCRIPTIONOFJOBDUTIESINDETAIL11[1]', type: 'text' },
  job2ReasonLeft: { pdfFieldName: 'form1[0].#subform[13].WHATISTHECLAIMANTSREASONFORLEAVINGEMPLOYMENT11[0]', type: 'text' },

  // ── Job 3 (Item 6, pages 2-3: duties box [0] is on page 2, the aggravate
  //    box [1] and reason box carry over to page 3 / #subform[14]) ───────────
  job3Title: { pdfFieldName: 'form1[0].#subform[13].JOBTITLE12[0]', type: 'text' },
  job3Employer: { pdfFieldName: 'form1[0].#subform[13].NAMEOFEMPLOYER12[0]', type: 'text' },
  job3Dates: { pdfFieldName: 'form1[0].#subform[13].DATESOFEMPLOYEMENT12[0]', type: 'text' },
  job3Schedule: { pdfFieldName: 'form1[0].#subform[13].RadioButtonList[4]', type: 'radio' },
  job3Salary: { pdfFieldName: 'form1[0].#subform[13].AVERAGEGROSSMONTHLYSALARY12[0]', type: 'text' },
  job3Duties: { pdfFieldName: 'form1[0].#subform[13].PROVIDEADESCRIPTIONOFJOBDUTIESINDETAIL12[0]', type: 'text' },
  job3Aggravate: { pdfFieldName: 'form1[0].#subform[14].PROVIDEADESCRIPTIONOFJOBDUTIESINDETAIL12[1]', type: 'text' },
  job3ReasonLeft: { pdfFieldName: 'form1[0].#subform[14].WHATISTHECLAIMANTSREASONFORLEAVINGEMPLOYMENT12[0]', type: 'text' },

  // ── Job 4 (Item 7, page 3) ────────────────────────────────────────────────
  job4Title: { pdfFieldName: 'form1[0].#subform[14].JOBTITLE13[0]', type: 'text' },
  job4Employer: { pdfFieldName: 'form1[0].#subform[14].NAMEOFEMPLOYER13[0]', type: 'text' },
  job4Dates: { pdfFieldName: 'form1[0].#subform[14].DATESOFEMPLOYEMENT13[0]', type: 'text' },
  job4Schedule: { pdfFieldName: 'form1[0].#subform[14].RadioButtonList[5]', type: 'radio' },
  job4Salary: { pdfFieldName: 'form1[0].#subform[14].AVERAGEGROSSMONTHLYSALARY13[0]', type: 'text' },
  job4Duties: { pdfFieldName: 'form1[0].#subform[14].PROVIDEADESCRIPTIONOFJOBDUTIESINDETAIL13[0]', type: 'text' },
  job4Aggravate: { pdfFieldName: 'form1[0].#subform[14].PROVIDEADESCRIPTIONOFJOBDUTIESINDETAIL13[1]', type: 'text' },
  job4ReasonLeft: { pdfFieldName: 'form1[0].#subform[14].WHATISTHECLAIMANTSREASONFORLEAVINGEMPLOYMENT13[0]', type: 'text' },

  // ── Job 5 (Item 8, page 3) ────────────────────────────────────────────────
  job5Title: { pdfFieldName: 'form1[0].#subform[14].JOBTITLE14[0]', type: 'text' },
  job5Employer: { pdfFieldName: 'form1[0].#subform[14].NAMEOFEMPLOYER14[0]', type: 'text' },
  job5Dates: { pdfFieldName: 'form1[0].#subform[14].DATESOFEMPLOYEMENT14[0]', type: 'text' },
  job5Schedule: { pdfFieldName: 'form1[0].#subform[14].RadioButtonList[6]', type: 'radio' },
  job5Salary: { pdfFieldName: 'form1[0].#subform[14].AVERAGEGROSSMONTHLYSALARY14[0]', type: 'text' },
  job5Duties: { pdfFieldName: 'form1[0].#subform[14].PROVIDEADESCRIPTIONOFJOBDUTIESINDETAIL14[0]', type: 'text' },
  job5Aggravate: { pdfFieldName: 'form1[0].#subform[14].PROVIDEADESCRIPTIONOFJOBDUTIESINDETAIL14[1]', type: 'text' },
  job5ReasonLeft: { pdfFieldName: 'form1[0].#subform[14].WHATISTHECLAIMANTSREASONFORLEAVINGEMPLOYMENT14[0]', type: 'text' },

  // ── Item 9: difficulties at work due to SCDs (page 4) ─────────────────────
  difficultyCoworkers: { pdfFieldName: 'form1[0].#subform[15].CLAIMANTEVERHADDIFFICULTY[0]', type: 'checkbox' },
  difficultyCoworkersDesc: { pdfFieldName: 'form1[0].#subform[15].CO-WORKERRELATIONS[0]', type: 'text' },
  difficultyPerformance: { pdfFieldName: 'form1[0].#subform[15].CLAIMANTEVERHADDIFFICULTY[1]', type: 'checkbox' },
  difficultyPerformanceDesc: { pdfFieldName: 'form1[0].#subform[15].JOBPERFORMANCE[0]', type: 'text' },
  difficultyOpportunities: { pdfFieldName: 'form1[0].#subform[15].CLAIMANTEVERHADDIFFICULTY[2]', type: 'checkbox' },
  difficultyOpportunitiesDesc: { pdfFieldName: 'form1[0].#subform[15].JOBOPPORTUNITIES[0]', type: 'text' },
  difficultySatisfaction: { pdfFieldName: 'form1[0].#subform[15].CLAIMANTEVERHADDIFFICULTY[3]', type: 'checkbox' },
  difficultySatisfactionDesc: { pdfFieldName: 'form1[0].#subform[15].JOBSATISFACTION[0]', type: 'text' },
  difficultyManagers: { pdfFieldName: 'form1[0].#subform[15].CLAIMANTEVERHADDIFFICULTY[4]', type: 'checkbox' },
  difficultyManagersDesc: { pdfFieldName: 'form1[0].#subform[15].MANAGERRELATIONS[0]', type: 'text' },
  difficultyMissedTime: { pdfFieldName: 'form1[0].#subform[15].CLAIMANTEVERHADDIFFICULTY[5]', type: 'checkbox' },
  difficultyMissedTimeDesc: { pdfFieldName: 'form1[0].#subform[15].MISSEDTIMEATWORK[0]', type: 'text' },
  difficultyOther: { pdfFieldName: 'form1[0].#subform[15].CLAIMANTEVERHADDIFFICULTY[6]', type: 'checkbox' },
  difficultyOtherDesc: { pdfFieldName: 'form1[0].#subform[15].OTHERS[0]', type: 'text' },

  // ── Section III: military employment history (Items 10-13, page 4) ────────
  providedDd214: { pdfFieldName: 'form1[0].#subform[15].RadioButtonList[7]', type: 'radio' },
  enlistmentHistory: { pdfFieldName: 'form1[0].#subform[15].LISTCLAIMANTSMILITARYENLISTMENTHISTORY[0]', type: 'text' },
  militaryOccupation: { pdfFieldName: 'form1[0].#subform[15].JOBTITLEORMILITARYOCCUPATIONALSPECIALTY[0]', type: 'text' },
  // Item 12A: one wizard radio fans out to the branch group ([8]) and the
  // one-option USPHS group ([9]). "YES" is the SELECTED SERVICE row's /Opt value.
  service1Branch: [
    { pdfFieldName: 'form1[0].#subform[15].RadioButtonList[8]', type: 'radio', transform: v => v === 'USPHS' ? '' : v },
    { pdfFieldName: 'form1[0].#subform[15].RadioButtonList[9]', type: 'radio', transform: v => v === 'USPHS' ? 'USPHS' : '' },
  ],
  service1BranchOther: { pdfFieldName: 'form1[0].#subform[15].OtherSpecify[0]', type: 'text' },
  // Derived by computeAnswers from service1Entered + service1Separated
  service1Dates: { pdfFieldName: 'form1[0].#subform[15].DATESOFSERVICE18B[0]', type: 'text' },
  service1Rank: { pdfFieldName: 'form1[0].#subform[15].RANK18C[0]', type: 'text' },
  // Item 13A (second period/branch)
  service2Branch: [
    { pdfFieldName: 'form1[0].#subform[15].RadioButtonList[10]', type: 'radio', transform: v => v === 'USPHS' ? '' : v },
    { pdfFieldName: 'form1[0].#subform[15].RadioButtonList[11]', type: 'radio', transform: v => v === 'USPHS' ? 'USPHS' : '' },
  ],
  service2BranchOther: { pdfFieldName: 'form1[0].#subform[15].OtherSpecify[1]', type: 'text' },
  // Derived by computeAnswers from service2Entered + service2Separated
  service2Dates: { pdfFieldName: 'form1[0].#subform[15].DATESOFSERVICE18B[1]', type: 'text' },
  service2Rank: { pdfFieldName: 'form1[0].#subform[15].RANK18C[1]', type: 'text' },

  // ── Section IV: legal history (Item 14, page 5) ───────────────────────────
  legalBankruptcy: { pdfFieldName: 'form1[0].#subform[16].HISTORYORDEALINGWITHLEGALISSUES[0]', type: 'checkbox' },
  legalBankruptcyDesc: { pdfFieldName: 'form1[0].#subform[16].BANKRUPTCY[0]', type: 'text' },
  legalMisdemeanor: { pdfFieldName: 'form1[0].#subform[16].HISTORYORDEALINGWITHLEGALISSUES[1]', type: 'checkbox' },
  legalMisdemeanorDesc: { pdfFieldName: 'form1[0].#subform[16].MISDEMEANOR[0]', type: 'text' },
  legalFelony: { pdfFieldName: 'form1[0].#subform[16].HISTORYORDEALINGWITHLEGALISSUES[2]', type: 'checkbox' },
  legalFelonyDesc: { pdfFieldName: 'form1[0].#subform[16].FELON[0]', type: 'text' },
  legalProbation: { pdfFieldName: 'form1[0].#subform[16].HISTORYORDEALINGWITHLEGALISSUES[3]', type: 'checkbox' },
  legalProbationDesc: { pdfFieldName: 'form1[0].#subform[16].PROBATION[0]', type: 'text' },
  legalParole: { pdfFieldName: 'form1[0].#subform[16].HISTORYORDEALINGWITHLEGALISSUES[4]', type: 'checkbox' },
  legalParoleDesc: { pdfFieldName: 'form1[0].#subform[16].PAROLE[0]', type: 'text' },
  legalOther: { pdfFieldName: 'form1[0].#subform[16].HISTORYORDEALINGWITHLEGALISSUES[5]', type: 'checkbox' },
  legalOtherDesc: { pdfFieldName: 'form1[0].#subform[16].OTHER[0]', type: 'text' },
  legalNotApplicable: { pdfFieldName: 'form1[0].#subform[16].HISTORYORDEALINGWITHLEGALISSUES[6]', type: 'checkbox' },

  // ── Section V: substance abuse history (Item 15, page 5) ──────────────────
  substanceAlcohol: { pdfFieldName: 'form1[0].#subform[16].SUBSTANCEABUSEISSUES[0]', type: 'checkbox' },
  substanceAlcoholDesc: { pdfFieldName: 'form1[0].#subform[16].ALCOHOL[0]', type: 'text' },
  substanceIllegalDrugs: { pdfFieldName: 'form1[0].#subform[16].SUBSTANCEABUSEISSUES[1]', type: 'checkbox' },
  substanceIllegalDrugsDesc: { pdfFieldName: 'form1[0].#subform[16].ILLEGALDRUGS[0]', type: 'text' },
  substancePrescriptionDrugs: { pdfFieldName: 'form1[0].#subform[16].SUBSTANCEABUSEISSUES[2]', type: 'checkbox' },
  substancePrescriptionDrugsDesc: { pdfFieldName: 'form1[0].#subform[16].PRESCRIPTIONDRUGS[0]', type: 'text' },
  substanceOther: { pdfFieldName: 'form1[0].#subform[16].SUBSTANCEABUSEISSUES[3]', type: 'checkbox' },
  substanceOtherDesc: { pdfFieldName: 'form1[0].#subform[16].OTHER[1]', type: 'text' },
  substanceNotApplicable: { pdfFieldName: 'form1[0].#subform[16].SUBSTANCEABUSEISSUES[4]', type: 'checkbox' },
  substanceTreatment: { pdfFieldName: 'form1[0].#subform[16].TREATMENTFORSUBSTANCEABUSE[0]', type: 'text' },

  // ── Section VI: education/training history (Items 16-18, page 6) ──────────
  providedTranscripts: { pdfFieldName: 'form1[0].#subform[17].RadioButtonList[12]', type: 'radio' },
  highestEducation: { pdfFieldName: 'form1[0].#subform[17].RadioButtonList[13]', type: 'radio' },
  fieldOfStudy: { pdfFieldName: 'form1[0].#subform[17].FIELDOFSTUDY[0]', type: 'text' },
  certificationsLicenses: { pdfFieldName: 'form1[0].#subform[17].CERTIFICATIONORLICENSES[0]', type: 'text' },

  // ── Section VII: disabilities (Items 19-23, pages 6-7) ────────────────────
  // NOTE: the Item 19 field name genuinely contains a literal "\." (XFA export quirk)
  scdList: { pdfFieldName: 'form1[0].#subform[17].LISTTHECLAIMANTSSERVICE-CONNECTEDDISABILITIESANDIMPAIRMENTS\\.[0]', type: 'text' },
  iuTdiu: { pdfFieldName: 'form1[0].#subform[18].FILEDACLAIM[0]', type: 'text' },
  driversLicense: { pdfFieldName: 'form1[0].#subform[18].VALIDDRIVERSLICENSE[0]', type: 'text' },
  treatmentFacilities: { pdfFieldName: 'form1[0].#subform[18].NAMEOFMEDICALTREATMENTFACILITIES[0]', type: 'text' },
  treatmentFrequency: { pdfFieldName: 'form1[0].#subform[18].HOWOFTENISTHECLAIMANTSEENFORTREATEMENT[0]', type: 'text' },

  // ── Section VIII: miscellaneous (Items 24-27, page 8) ─────────────────────
  vaMedicalCenter: { pdfFieldName: 'form1[0].#subform[19].RadioButtonList[14]', type: 'radio' },
  myHealtheVet: { pdfFieldName: 'form1[0].#subform[19].RadioButtonList[15]', type: 'radio' },
  homelessReferral: { pdfFieldName: 'form1[0].#subform[19].RadioButtonList[16]', type: 'radio' },
  benefitDisabilityPension: { pdfFieldName: 'form1[0].#subform[19].RECEIVINGORAPPLIEDORBENEFITS[0]', type: 'checkbox' },
  benefitDisabilityPensionType: { pdfFieldName: 'form1[0].#subform[19].RadioButtonList[17]', type: 'radio' }, // options: "CIVILIAN" | "MILITARY )" (sic)
  benefitRetirement: { pdfFieldName: 'form1[0].#subform[19].RECEIVINGORAPPLIEDORBENEFITS[1]', type: 'checkbox' },
  benefitRetirementType: { pdfFieldName: 'form1[0].#subform[19].RadioButtonList[18]', type: 'radio' }, // options: "CIVILIAN" | "MILITARY )" (sic)
  benefitMedicare: { pdfFieldName: 'form1[0].#subform[19].RECEIVINGORAPPLIEDORBENEFITS[2]', type: 'checkbox' },
  benefitSsdi: { pdfFieldName: 'form1[0].#subform[19].RECEIVINGORAPPLIEDORBENEFITS[3]', type: 'checkbox' },
  benefitWorkersComp: { pdfFieldName: 'form1[0].#subform[19].RECEIVINGORAPPLIEDORBENEFITS[4]', type: 'checkbox' },
  benefitVocRehab: { pdfFieldName: 'form1[0].#subform[19].RECEIVINGORAPPLIEDORBENEFITS[5]', type: 'checkbox' },
  benefitOther: { pdfFieldName: 'form1[0].#subform[19].RECEIVINGORAPPLIEDORBENEFITS[6]', type: 'checkbox' },
  benefitOtherDesc: { pdfFieldName: 'form1[0].#subform[19].OTHER34[0]', type: 'text' },

  // ── Section IX: comments (Item 28, page 8) ────────────────────────────────
  additionalComments: { pdfFieldName: 'form1[0].#subform[19].TextField1[0]', type: 'text' },
};
