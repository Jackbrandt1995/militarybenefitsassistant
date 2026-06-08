/**
 * VA 21-22A (JUL 2023) — Appointment of Individual as Claimant's Representative
 *
 * XFA-based PDF. Text fields use the full qualified AcroForm-compatible path
 * (form1[0].#subform[X].FieldName[Y]) — all verified to exist via getFields().
 * Radio buttons / checkboxes use 'draw-check' at the widget's real coordinates.
 *
 *   page 0 = subform[0]  Section I veteran, II claimant, III rep name + 16B
 *   page 1 = subform[1]  rep address, Section IV authorizations, signatures
 *   page 2 = subform[2]  limitations (Item 24), repeated SSN/date
 *
 * maxLength is enforced on nearly every box ("one letter per box"). Writing more
 * characters than the limit throws ExceededMaxLengthError, which fillPdf swallows
 * — leaving the field BLANK. Every plain-text value is therefore sliced to fit:
 *   first name 12 · last name 18 · city 18 · street 30 · apt 5 · state 2 · country 2
 *   VA file number 9 · service number 10
 *
 * Section IV authorization checkboxes (coordinates verified against widget rects):
 *   Item 19a  Checkbox…Items_20_And_21[0]            p1 cx=49.7 cy=420.0  (affiliated attorneys/staff)
 *   Item 19b  Checkbox…Items_20_And_21[1]            p1 cx=49.7 cy=346.7  (administrative employees)
 *   Item 20   AuthorizationForRepAccessToRecords[0]  p1 cx=39.8 cy=247.5  (SENSITIVE: drug/alcohol/HIV/sickle-cell)
 *   Item 22   AuthorizationForRepActClaimantsBehalf[0] p1 cx=39.6 cy=101.0 (change address)
 */

import type { FieldMapping } from '../fillPdf';
import { formatSSNParts, formatPhoneParts, formatDateForPdf } from '../fillPdf';

const sl = (n: number) => (v: string) => String(v ?? '').slice(0, n);
const zip5 = (v: string) => String(v ?? '').replace(/\D/g, '').slice(0, 5);
const zip4 = (v: string) => {
  const d = String(v ?? '').replace(/\D/g, '');
  return d.length > 5 ? d.slice(5, 9) : '';
};
const mi = (v: string) => (v ? v.charAt(0).toUpperCase() : '');
const truthy = (v: string | boolean) => (v === true || v === 'true' ? 'true' : '');

export const va2122aMapping: FieldMapping = {

  // ── SECTION I: VETERAN (page 0) ──────────────────────────────────────────
  vetFirstName:     { pdfFieldName: 'form1[0].#subform[0].Veterans_First_Name[0]',     type: 'text', transform: sl(12) },
  vetMiddleInitial: { pdfFieldName: 'form1[0].#subform[0].Veterans_Middle_Initial[0]', type: 'text', transform: mi },
  vetLastName:      { pdfFieldName: 'form1[0].#subform[0].Veterans_Last_Name[0]',      type: 'text', transform: sl(18) },

  vetSSN: [
    { pdfFieldName: 'form1[0].#subform[0].SocialSecurityNumber_FirstThreeNumbers[0]', type: 'text', transform: v => formatSSNParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[0].SocialSecurityNumber_SecondTwoNumbers[0]',  type: 'text', transform: v => formatSSNParts(v).middle2 },
    { pdfFieldName: 'form1[0].#subform[0].SocialSecurityNumber_LastFourNumbers[0]',   type: 'text', transform: v => formatSSNParts(v).last4 },
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

  vetVAFileNumber:  { pdfFieldName: 'form1[0].#subform[0].Veterans_Service_Number_If_Applicable[0]', type: 'text', transform: sl(9) },
  vetServiceNumber: { pdfFieldName: 'form1[0].#subform[0].Veterans_Service_Number_If_Applicable[1]', type: 'text', transform: sl(10) },

  // Item 6 — Branch of Service. RadioButtonList[1] (8 widgets, exact rects):
  //   row1 cy=495.7: Army 209.9 · Navy 260.9 · Air Force 305.4 · Marine Corps 363.8 · Coast Guard 437.5
  //   row2 cy=478.x: Space Force 209.9 · NOAA 288.8 · USPHS 336.1
  branchOfService: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'draw-check', transform: v => v === 'Army'         ? 'true' : '', checkPage: 0, checkCX: 209.9, checkCY: 495.7, checkSize: 6 },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'draw-check', transform: v => v === 'Navy'         ? 'true' : '', checkPage: 0, checkCX: 260.9, checkCY: 495.7, checkSize: 6 },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'draw-check', transform: v => v === 'Air Force'    ? 'true' : '', checkPage: 0, checkCX: 305.4, checkCY: 495.7, checkSize: 6 },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'draw-check', transform: v => v === 'Marine Corps' ? 'true' : '', checkPage: 0, checkCX: 363.8, checkCY: 495.6, checkSize: 6 },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'draw-check', transform: v => v === 'Coast Guard'  ? 'true' : '', checkPage: 0, checkCX: 437.5, checkCY: 495.6, checkSize: 6 },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'draw-check', transform: v => v === 'Space Force'  ? 'true' : '', checkPage: 0, checkCX: 209.9, checkCY: 478.7, checkSize: 6 },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'draw-check', transform: v => v === 'NOAA'         ? 'true' : '', checkPage: 0, checkCX: 288.8, checkCY: 478.4, checkSize: 6 },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[1]', type: 'draw-check', transform: v => v === 'USPHS'        ? 'true' : '', checkPage: 0, checkCX: 336.1, checkCY: 478.8, checkSize: 6 },
  ],

  vetStreet:  { pdfFieldName: 'form1[0].#subform[0].MailingAddress_NumberAndStreet[0]',       type: 'text', transform: sl(30) },
  vetApt:     { pdfFieldName: 'form1[0].#subform[0].MailingAddress_ApartmentOrUnitNumber[0]', type: 'text', transform: sl(5) },
  vetCity:    { pdfFieldName: 'form1[0].#subform[0].MailingAddress_City[0]',                  type: 'text', transform: sl(18) },
  vetState:   { pdfFieldName: 'form1[0].#subform[0].MailingAddress_StateOrProvince[0]',       type: 'text', transform: sl(2) },
  vetZip: [
    { pdfFieldName: 'form1[0].#subform[0].MailingAddress_ZIPOrPostalCode_FirstFiveNumbers[0]', type: 'text', transform: zip5 },
    { pdfFieldName: 'form1[0].#subform[0].MailingAddress_ZIPOrPostalCode_LastFourNumbers[0]',  type: 'text', transform: zip4 },
  ],
  vetCountry: { pdfFieldName: 'form1[0].#subform[0].MailingAddress_Country[0]', type: 'text', transform: sl(2) },

  vetPhone: [
    { pdfFieldName: 'form1[0].#subform[0].Telephone_Number_Area_Code[0]',    type: 'text', transform: v => formatPhoneParts(v).areaCode },
    // PDF field-name typo: "Telphone" (missing 'e')
    { pdfFieldName: 'form1[0].#subform[0].Telphone_Middle_Three_Numbers[0]', type: 'text', transform: v => formatPhoneParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[0].Telephone_Last_Four_Numbers[0]',   type: 'text', transform: v => formatPhoneParts(v).last4 },
  ],

  vetEmail: { pdfFieldName: 'form1[0].#subform[0].E_Mail_Address_Optional[0]', type: 'text' },

  // ── SECTION II: CLAIMANT (page 0) ────────────────────────────────────────
  claimantIsVeteran: [],   // wizard-only gate — no PDF field

  // Item 12 — relationship to veteran is a free-TEXT field (RelationshipToVeteran[0]),
  // NOT a radio. claimantRelationship is built by computeAnswers (label, or the
  // "Other" detail) and written here. The raw type/other inputs fold into it.
  claimantRelationship:      { pdfFieldName: 'form1[0].#subform[0].RelationshipToVeteran[0]', type: 'text' },
  claimantRelationshipType:  [],
  claimantRelationshipOther: [],

  claimantFirstName:     { pdfFieldName: 'form1[0].#subform[0].Claimants_First_Name[0]',    type: 'text', transform: sl(12) },
  claimantMiddleInitial: { pdfFieldName: 'form1[0].#subform[0].Claimants_Middle_Initial[0]', type: 'text', transform: mi },
  claimantLastName:      { pdfFieldName: 'form1[0].#subform[0].Claimants_Last_Name[0]',     type: 'text', transform: sl(18) },

  claimantDOB: [
    { pdfFieldName: 'form1[0].#subform[0].Claimants_Date_Of_Birth_Month[0]', type: 'text', transform: v => formatDateForPdf(v).month },
    { pdfFieldName: 'form1[0].#subform[0].Date_Of_Birth_Day[1]',             type: 'text', transform: v => formatDateForPdf(v).day },
    { pdfFieldName: 'form1[0].#subform[0].Date_Of_Birth_Year[1]',            type: 'text', transform: v => formatDateForPdf(v).year },
  ],

  claimantStreet:  { pdfFieldName: 'form1[0].#subform[0].MailingAddress_NumberAndStreet[1]',       type: 'text', transform: sl(30) },
  claimantApt:     { pdfFieldName: 'form1[0].#subform[0].MailingAddress_ApartmentOrUnitNumber[1]', type: 'text', transform: sl(5) },
  claimantCity:    { pdfFieldName: 'form1[0].#subform[0].MailingAddress_City[1]',                  type: 'text', transform: sl(18) },
  claimantState:   { pdfFieldName: 'form1[0].#subform[0].MailingAddress_StateOrProvince[1]',       type: 'text', transform: sl(2) },
  claimantZip: [
    { pdfFieldName: 'form1[0].#subform[0].MailingAddress_ZIPOrPostalCode_FirstFiveNumbers[1]', type: 'text', transform: zip5 },
    { pdfFieldName: 'form1[0].#subform[0].MailingAddress_ZIPOrPostalCode_LastFourNumbers[1]',  type: 'text', transform: zip4 },
  ],
  claimantCountry: { pdfFieldName: 'form1[0].#subform[0].MailingAddress_Country[1]', type: 'text', transform: sl(2) },

  claimantPhone: [
    { pdfFieldName: 'form1[0].#subform[0].Telephone_Number_Area_Code[1]',     type: 'text', transform: v => formatPhoneParts(v).areaCode },
    { pdfFieldName: 'form1[0].#subform[0].Telephone_Middle_Three_Numbers[0]', type: 'text', transform: v => formatPhoneParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[0].Telephone_Last_Four_Numbers[1]',    type: 'text', transform: v => formatPhoneParts(v).last4 },
  ],

  claimantEmail: { pdfFieldName: 'form1[0].#subform[0].E_Mail_Address_Optional[1]', type: 'text' },

  // ── SECTION III: REPRESENTATIVE (page 0 name + 16B, page 1 address) ──────
  repFirstName:     { pdfFieldName: 'form1[0].#subform[0].Name_Of_Individual_Appointed_As_Representative_First_Name[0]', type: 'text', transform: sl(12) },
  repMiddleInitial: { pdfFieldName: 'form1[0].#subform[0].Middle_Initial[0]', type: 'text', transform: mi },
  repLastName:      { pdfFieldName: 'form1[0].#subform[0].Last_Name[0]',      type: 'text', transform: sl(18) },

  // Item 16B — "Individual is" (Attorney / Agent / §14.630 individual / Service Org Rep).
  // RadioButtonList[0] widget positions on page 0:
  //   Attorney        cx=40.6  cy=75.7   (row 1, left)
  //   Agent           cx=102.6 cy=76.0   (row 1)
  //   §14.630         cx=151.2 cy=76.0   (row 1)
  //   Service Org Rep cx=40.6  cy=54.2   (row 2)
  appointmentType: [
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[0]', type: 'draw-check', transform: v => v === 'Attorney'        ? 'true' : '', checkPage: 0, checkCX: 40.6,  checkCY: 75.7, checkSize: 6 },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[0]', type: 'draw-check', transform: v => v === 'Agent'           ? 'true' : '', checkPage: 0, checkCX: 102.6, checkCY: 76.0, checkSize: 6 },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[0]', type: 'draw-check', transform: v => v === 'Individual14630' ? 'true' : '', checkPage: 0, checkCX: 151.2, checkCY: 76.0, checkSize: 6 },
    { pdfFieldName: 'form1[0].#subform[0].RadioButtonList[0]', type: 'draw-check', transform: v => v === 'ServiceOrg'      ? 'true' : '', checkPage: 0, checkCX: 40.6,  checkCY: 54.2, checkSize: 6 },
  ],
  // Item 16B — service organization name (only when "Service Org Rep" is chosen)
  repOrganization: { pdfFieldName: 'form1[0].#subform[0].Specify_Organization[0]', type: 'text' },

  repStreet:  { pdfFieldName: 'form1[0].#subform[1].MailingAddress_NumberAndStreet[2]',       type: 'text', transform: sl(30) },
  repApt:     { pdfFieldName: 'form1[0].#subform[1].MailingAddress_ApartmentOrUnitNumber[2]', type: 'text', transform: sl(5) },
  repCity:    { pdfFieldName: 'form1[0].#subform[1].MailingAddress_City[2]',                  type: 'text', transform: sl(18) },
  repState:   { pdfFieldName: 'form1[0].#subform[1].MailingAddress_StateOrProvince[2]',       type: 'text', transform: sl(2) },
  repZip: [
    { pdfFieldName: 'form1[0].#subform[1].MailingAddress_ZIPOrPostalCode_FirstFiveNumbers[2]', type: 'text', transform: zip5 },
    { pdfFieldName: 'form1[0].#subform[1].MailingAddress_ZIPOrPostalCode_LastFourNumbers[2]',  type: 'text', transform: zip4 },
  ],
  repCountry: { pdfFieldName: 'form1[0].#subform[1].MailingAddress_Country[2]', type: 'text', transform: sl(2) },

  repPhone: [
    { pdfFieldName: 'form1[0].#subform[1].Telephone_Number_Area_Code[2]',     type: 'text', transform: v => formatPhoneParts(v).areaCode },
    { pdfFieldName: 'form1[0].#subform[1].Telephone_Middle_Three_Numbers[1]', type: 'text', transform: v => formatPhoneParts(v).first3 },
    { pdfFieldName: 'form1[0].#subform[1].Telephone_Last_Four_Numbers[2]',    type: 'text', transform: v => formatPhoneParts(v).last4 },
  ],

  repEmail: { pdfFieldName: 'form1[0].#subform[1].E_Mail_Address_Of_Individual_Appointed_As_Claimants_Representative_Optional[0]', type: 'text' },

  // ── SECTION IV: AUTHORIZATIONS (page 1) — all optional opt-ins ───────────
  // Item 19a — disclose records to affiliated attorneys/agents/support staff
  auth19aAffiliated: {
    pdfFieldName: 'form1[0].#subform[1].Checkbox_I_Authorize_VA_To_Disclose_All_My_Records_Other_Than_As_Provided_In_Items_20_And_21[0]',
    type: 'draw-check', transform: truthy, checkPage: 1, checkCX: 49.7, checkCY: 420.0, checkSize: 6,
  },
  auth19aFirmName: { pdfFieldName: 'form1[0].#subform[1].Provide_The_Name_Of_The_Firm_Or_Organization_Here[0]', type: 'text' },
  // Item 19b — disclose records to named administrative employees
  auth19bAdministrative: {
    pdfFieldName: 'form1[0].#subform[1].Checkbox_I_Authorize_VA_To_Disclose_All_My_Records_Other_Than_As_Provided_In_Items_20_And_21[1]',
    type: 'draw-check', transform: truthy, checkPage: 1, checkCX: 49.7, checkCY: 346.7, checkSize: 6,
  },
  // Item 20 — SENSITIVE: disclose drug-abuse / alcoholism / HIV / sickle-cell records
  auth20SensitiveRecords: {
    pdfFieldName: 'form1[0].#subform[1].AuthorizationForRepAccessToRecords[0]',
    type: 'draw-check', transform: truthy, checkPage: 1, checkCX: 39.8, checkCY: 247.5, checkSize: 6,
  },
  // Item 22 — authorize representative to change claimant's address in VA records
  auth22ChangeAddress: {
    pdfFieldName: 'form1[0].#subform[1].AuthorizationForRepActClaimantsBehalf[0]',
    type: 'draw-check', transform: truthy, checkPage: 1, checkCX: 39.6, checkCY: 101.0, checkSize: 6,
  },

  // Item 21 — limitation of consent for the sensitive records in Item 20
  limitationOfConsent: { pdfFieldName: 'form1[0].#subform[1].RelationshipToVeteran[1]', type: 'text' },

  // ── Item 24: LIMITATIONS ON REPRESENTATION (page 2) ──────────────────────
  limitations: { pdfFieldName: 'form1[0].#subform[2].LIMITATIONS[0]', type: 'text' },

  // ── SIGNATURE & DATE (page 1 — Item 23A/23B) ─────────────────────────────
  privacyAct: [],   // wizard-only certification — no PDF field
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
    { pdfFieldName: 'form1[0].#subform[2].Date_Signed_Month[2]', type: 'text', transform: v => formatDateForPdf(v).month },
    { pdfFieldName: 'form1[0].#subform[2].Date_Signed_Day[2]',   type: 'text', transform: v => formatDateForPdf(v).day },
    { pdfFieldName: 'form1[0].#subform[2].Date_Signed_Year[2]',  type: 'text', transform: v => formatDateForPdf(v).year },
  ],
};
