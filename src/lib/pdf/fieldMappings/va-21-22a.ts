/**
 * VA 21-22A Field Mapping
 *
 * XFA-based PDF. Text fields use the full qualified AcroForm-compatible path
 * (form1[0].#subform[X].FieldName[Y]). Checkboxes and radio buttons use
 * 'draw-check' at confirmed page coordinates (0-indexed pages).
 *
 * Field paths verified via pdf-lib getFields() + getTextField() probe:
 *   page 0 = subform[0]  (veteran, claimant, representative name)
 *   page 1 = subform[1]  (representative address, authorization, signatures)
 *   page 2 = subform[2]  (limitations, repeated SSN/signatures)
 *
 * Signature overlay placed at page 1 SignatureField1[0] rect:
 *   x=35.7, y=510.2, w=353.6, h=19.1
 */

import type { FieldMapping } from '../fillPdf';
import { formatSSNParts, formatPhoneParts, formatDateForPdf, formatDateString } from '../fillPdf';

export const va2122aMapping: FieldMapping = {

  // ── VETERAN INFORMATION (page 0) ─────────────────────────────────────────
  vetFirstName:     { pdfFieldName: 'form1[0].#subform[0].Veterans_First_Name[0]',    type: 'text' },
  vetMiddleInitial: { pdfFieldName: 'form1[0].#subform[0].Veterans_Middle_Initial[0]', type: 'text', transform: v => v ? v.charAt(0).toUpperCase() : '' },
  vetLastName:      { pdfFieldName: 'form1[0].#subform[0].Veterans_Last_Name[0]',     type: 'text' },

  vetSSN: [
    { pdfFieldName: 'form1[0].#subform[0].SocialSecurityNumber_FirstThreeNumbers[0]', type: 'text', transform: v => formatSSNParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[0].SocialSecurityNumber_SecondTwoNumbers[0]',  type: 'text', transform: v => formatSSNParts(v).middle2 },
    { pdfFieldName: 'form1[0].#subform[0].SocialSecurityNumber_LastFourNumbers[0]',   type: 'text', transform: v => formatSSNParts(v).last4 },
    // Repeated on page 2 (subform[1]) and page 3 (subform[2])
    { pdfFieldName: 'form1[0].#subform[1].SocialSecurityNumber_FirstThreeNumbers[1]', type: 'text', transform: v => formatSSNParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[1].SocialSecurityNumber_SecondTwoNumbers[1]',  type: 'text', transform: v => formatSSNParts(v).middle2 },
    { pdfFieldName: 'form1[0].#subform[1].SocialSecurityNumber_LastFourNumbers[1]',   type: 'text', transform: v => formatSSNParts(v).last4 },
    { pdfFieldName: 'form1[0].#subform[2].SocialSecurityNumber_FirstThreeNumbers[2]', type: 'text', transform: v => formatSSNParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[2].SocialSecurityNumber_SecondTwoNumbers[2]',  type: 'text', transform: v => formatSSNParts(v).middle2 },
    { pdfFieldName: 'form1[0].#subform[2].SocialSecurityNumber_LastFourNumbers[2]',   type: 'text', transform: v => formatSSNParts(v).last4 },
  ],

  vetDOB: [
    { pdfFieldName: 'form1[0].#subform[0].Date_Of_Birth_Month[0]', type: 'text', transform: v => formatDateForPdf(v).month },
    { pdfFieldName: 'form1[0].#subform[0].Date_Of_Birth_Day[0]',   type: 'text', transform: v => formatDateForPdf(v).day },
    { pdfFieldName: 'form1[0].#subform[0].Date_Of_Birth_Year[0]',  type: 'text', transform: v => formatDateForPdf(v).year },
  ],

  vetVAFileNumber:  { pdfFieldName: 'form1[0].#subform[0].Veterans_Service_Number_If_Applicable[0]', type: 'text' },
  vetServiceNumber: { pdfFieldName: 'form1[0].#subform[0].Veterans_Service_Number_If_Applicable[1]', type: 'text' },

  vetStreet:  { pdfFieldName: 'form1[0].#subform[0].MailingAddress_NumberAndStreet[0]',           type: 'text' },
  vetApt:     { pdfFieldName: 'form1[0].#subform[0].MailingAddress_ApartmentOrUnitNumber[0]',     type: 'text' },
  vetCity:    { pdfFieldName: 'form1[0].#subform[0].MailingAddress_City[0]',                      type: 'text' },
  vetState:   { pdfFieldName: 'form1[0].#subform[0].MailingAddress_StateOrProvince[0]',           type: 'text' },
  vetZip:     { pdfFieldName: 'form1[0].#subform[0].MailingAddress_ZIPOrPostalCode_FirstFiveNumbers[0]', type: 'text', transform: v => v?.slice(0,5) ?? '' },
  vetCountry: { pdfFieldName: 'form1[0].#subform[0].MailingAddress_Country[0]',                   type: 'text' },

  vetPhone: [
    { pdfFieldName: 'form1[0].#subform[0].Telephone_Number_Area_Code[0]',     type: 'text', transform: v => formatPhoneParts(v).areaCode },
    // Note: typo in original PDF field name — "Telphone" (missing 'e')
    { pdfFieldName: 'form1[0].#subform[0].Telphone_Middle_Three_Numbers[0]',  type: 'text', transform: v => formatPhoneParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[0].Telephone_Last_Four_Numbers[0]',    type: 'text', transform: v => formatPhoneParts(v).last4 },
  ],

  vetEmail: { pdfFieldName: 'form1[0].#subform[0].E_Mail_Address_Optional[0]', type: 'text' },

  // ── CLAIMANT INFORMATION (page 0) ────────────────────────────────────────
  // claimantIsVeteran is a wizard-only question — no PDF field
  claimantIsVeteran: [],

  // RadioButtonList[1] — claimant's relationship to veteran (8 options, values 4–11)
  // Positions confirmed from widget rect extraction (page 0):
  //   row 1 (cy=495.7): '4'=Veteran(209.9), '5'=Spouse(260.9), '6'=Child<18(305.4), '7'=Child18-23(363.8), '8'=HelplessChild(437.5)
  //   row 2 (cy=478.6): '9'=Parent(209.9), '10'=Guardian(288.8), '11'=Other(336.1)
  claimantRelationshipType: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === '4'  ? 'true' : '', checkPage: 0, checkCX: 209.9, checkCY: 495.7, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === '5'  ? 'true' : '', checkPage: 0, checkCX: 260.9, checkCY: 495.7, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === '6'  ? 'true' : '', checkPage: 0, checkCX: 305.4, checkCY: 495.7, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === '7'  ? 'true' : '', checkPage: 0, checkCX: 363.8, checkCY: 495.7, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === '8'  ? 'true' : '', checkPage: 0, checkCX: 437.5, checkCY: 495.6, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === '9'  ? 'true' : '', checkPage: 0, checkCX: 209.9, checkCY: 478.6, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === '10' ? 'true' : '', checkPage: 0, checkCX: 288.8, checkCY: 478.4, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === '11' ? 'true' : '', checkPage: 0, checkCX: 336.1, checkCY: 478.8, checkSize: 6 },
  ],

  // RelationshipToVeteran[0] is the text field for explaining "Other" or additional info
  claimantRelationshipOther: { pdfFieldName: 'form1[0].#subform[0].RelationshipToVeteran[0]', type: 'text' },

  claimantFirstName:    { pdfFieldName: 'form1[0].#subform[0].Claimants_First_Name[0]',   type: 'text' },
  claimantMiddleInitial:{ pdfFieldName: 'form1[0].#subform[0].Claimants_Middle_Initial[0]', type: 'text', transform: v => v ? v.charAt(0).toUpperCase() : '' },
  claimantLastName:     { pdfFieldName: 'form1[0].#subform[0].Claimants_Last_Name[0]',    type: 'text' },

  claimantDOB: [
    { pdfFieldName: 'form1[0].#subform[0].Claimants_Date_Of_Birth_Month[0]', type: 'text', transform: v => formatDateForPdf(v).month },
    { pdfFieldName: 'form1[0].#subform[0].Date_Of_Birth_Day[1]',             type: 'text', transform: v => formatDateForPdf(v).day },
    { pdfFieldName: 'form1[0].#subform[0].Date_Of_Birth_Year[1]',            type: 'text', transform: v => formatDateForPdf(v).year },
  ],

  claimantStreet:  { pdfFieldName: 'form1[0].#subform[0].MailingAddress_NumberAndStreet[1]',           type: 'text' },
  claimantApt:     { pdfFieldName: 'form1[0].#subform[0].MailingAddress_ApartmentOrUnitNumber[1]',     type: 'text' },
  claimantCity:    { pdfFieldName: 'form1[0].#subform[0].MailingAddress_City[1]',                      type: 'text' },
  claimantState:   { pdfFieldName: 'form1[0].#subform[0].MailingAddress_StateOrProvince[1]',           type: 'text' },
  claimantZip:     { pdfFieldName: 'form1[0].#subform[0].MailingAddress_ZIPOrPostalCode_FirstFiveNumbers[1]', type: 'text', transform: v => v?.slice(0,5) ?? '' },
  claimantCountry: { pdfFieldName: 'form1[0].#subform[0].MailingAddress_Country[1]',                   type: 'text' },

  claimantPhone: [
    { pdfFieldName: 'form1[0].#subform[0].Telephone_Number_Area_Code[1]',    type: 'text', transform: v => formatPhoneParts(v).areaCode },
    { pdfFieldName: 'form1[0].#subform[0].Telephone_Middle_Three_Numbers[0]', type: 'text', transform: v => formatPhoneParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[0].Telephone_Last_Four_Numbers[1]',   type: 'text', transform: v => formatPhoneParts(v).last4 },
  ],

  claimantEmail: { pdfFieldName: 'form1[0].#subform[0].E_Mail_Address_Optional[1]', type: 'text' },

  // ── REPRESENTATIVE INFORMATION (page 0 name fields + page 1 address/contact) ──
  repFirstName:    { pdfFieldName: 'form1[0].#subform[0].Name_Of_Individual_Appointed_As_Representative_First_Name[0]', type: 'text' },
  repMiddleInitial:{ pdfFieldName: 'form1[0].#subform[0].Middle_Initial[0]', type: 'text', transform: v => v ? v.charAt(0).toUpperCase() : '' },
  repLastName:     { pdfFieldName: 'form1[0].#subform[0].Last_Name[0]',      type: 'text' },
  repOrganization: [
    { pdfFieldName: 'form1[0].#subform[0].Specify_Organization[0]',                          type: 'text' },
    { pdfFieldName: 'form1[0].#subform[1].Provide_The_Name_Of_The_Firm_Or_Organization_Here[0]', type: 'text' },
  ],

  repStreet:  { pdfFieldName: 'form1[0].#subform[1].MailingAddress_NumberAndStreet[2]',           type: 'text' },
  repApt:     { pdfFieldName: 'form1[0].#subform[1].MailingAddress_ApartmentOrUnitNumber[2]',     type: 'text' },
  repCity:    { pdfFieldName: 'form1[0].#subform[1].MailingAddress_City[2]',                      type: 'text' },
  repState:   { pdfFieldName: 'form1[0].#subform[1].MailingAddress_StateOrProvince[2]',           type: 'text' },
  repZip:     { pdfFieldName: 'form1[0].#subform[1].MailingAddress_ZIPOrPostalCode_FirstFiveNumbers[2]', type: 'text', transform: v => v?.slice(0,5) ?? '' },
  repCountry: { pdfFieldName: 'form1[0].#subform[1].MailingAddress_Country[2]',                   type: 'text' },

  repPhone: [
    { pdfFieldName: 'form1[0].#subform[1].Telephone_Number_Area_Code[2]',    type: 'text', transform: v => formatPhoneParts(v).areaCode },
    { pdfFieldName: 'form1[0].#subform[1].Telephone_Middle_Three_Numbers[1]', type: 'text', transform: v => formatPhoneParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[1].Telephone_Last_Four_Numbers[2]',   type: 'text', transform: v => formatPhoneParts(v).last4 },
  ],

  repEmail: { pdfFieldName: 'form1[0].#subform[1].E_Mail_Address_Of_Individual_Appointed_As_Claimants_Representative_Optional[0]', type: 'text' },

  // ── TYPE OF APPOINTMENT (page 0, bottom) ─────────────────────────────────
  // RadioButtonList[0] — options ['4','1','3','2'] at these positions:
  //   value '4' (no compensation) cx=40.6, cy=75.7
  //   value '1' (attorney)        cx=102.6, cy=76.0
  //   value '3' (claims agent)    cx=151.2, cy=76.0
  //   value '2' (other)           cx=40.6, cy=54.2
  appointmentType: [
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === '4' ? 'true' : '', checkPage: 0, checkCX: 40.6,  checkCY: 75.7, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === '1' ? 'true' : '', checkPage: 0, checkCX: 102.6, checkCY: 76.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === '3' ? 'true' : '', checkPage: 0, checkCX: 151.2, checkCY: 76.0, checkSize: 6 },
    { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === '2' ? 'true' : '', checkPage: 0, checkCX: 40.6,  checkCY: 54.2, checkSize: 6 },
  ],

  // ── AUTHORIZATION CHECKBOXES (page 1) ────────────────────────────────────
  // Positions confirmed from widget rect extraction:
  authRecords: {
    pdfFieldName: 'DRAW_CHECK', type: 'draw-check',
    transform: v => (v === 'true' || v === true as unknown as string) ? 'true' : '',
    checkPage: 1, checkCX: 39.8, checkCY: 247.5, checkSize: 6,
  },
  authActOnBehalf: {
    pdfFieldName: 'DRAW_CHECK', type: 'draw-check',
    transform: v => (v === 'true' || v === true as unknown as string) ? 'true' : '',
    checkPage: 1, checkCX: 39.6, checkCY: 101.0, checkSize: 6,
  },
  authDiscloseRecordsToRep: {
    pdfFieldName: 'DRAW_CHECK', type: 'draw-check',
    transform: v => (v === 'true' || v === true as unknown as string) ? 'true' : '',
    checkPage: 1, checkCX: 49.7, checkCY: 420.0, checkSize: 6,
  },
  authDiscloseRecordsToClaimant: {
    pdfFieldName: 'DRAW_CHECK', type: 'draw-check',
    transform: v => (v === 'true' || v === true as unknown as string) ? 'true' : '',
    checkPage: 1, checkCX: 49.7, checkCY: 346.7, checkSize: 6,
  },

  // ── LIMITATIONS (page 2) ─────────────────────────────────────────────────
  limitations: { pdfFieldName: 'form1[0].#subform[2].LIMITATIONS[0]', type: 'text' },

  // ── SIGNATURE & DATE (page 1) ─────────────────────────────────────────────
  // Claimant/veteran signature placed over SignatureField1[0] rect:
  //   page=1, x=35.7, y=510.2, w=353.6, h=19.1
  privacyAct: [], // wizard-only certification checkbox — no corresponding PDF field

  signaturePad: {
    pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY',
    type: 'image',
    imagePage: 1,
    imageX: 35.7,
    imageY: 510.2,
    imageWidth: 200,
    imageHeight: 17,
  },

  signatureDate: [
    { pdfFieldName: 'form1[0].#subform[1].Date_Signed_Month[0]', type: 'text', transform: v => formatDateForPdf(v).month },
    { pdfFieldName: 'form1[0].#subform[1].Date_Signed_Day[0]',   type: 'text', transform: v => formatDateForPdf(v).day },
    { pdfFieldName: 'form1[0].#subform[1].Date_Signed_Year[0]',  type: 'text', transform: v => formatDateForPdf(v).year },
    // Repeated date fields on pages 2 and 3
    { pdfFieldName: 'form1[0].#subform[2].Date_Signed_Month[2]', type: 'text', transform: v => formatDateForPdf(v).month },
    { pdfFieldName: 'form1[0].#subform[2].Date_Signed_Day[2]',   type: 'text', transform: v => formatDateForPdf(v).day },
    { pdfFieldName: 'form1[0].#subform[2].Date_Signed_Year[2]',  type: 'text', transform: v => formatDateForPdf(v).year },
  ],
};
