import type { FieldMapping } from '../fillPdf';

// ── Overflow-safe cells (beta bug: apartment and e-mail printed blank) ───────
// The AcroForm caps the Apt./Unit cell at 5 characters and the e-mail cell at
// 30 (/MaxLen, confirmed from the PDF field dump). pdf-lib's setText() THROWS
// past that limit and fillPdf swallows the throw, so the whole cell printed
// BLANK: "Apt 7B" is 6 characters, and any @militarybenefitsassistant.com
// address is over 30. Each of those two cells is now filled one of two ways:
// the AcroForm comb field when the value fits, otherwise the same text drawn
// directly inside the cell (page 0, coordinates from the widget rects below),
// so a long value prints across the boxes instead of vanishing.
//   CurrentMailingAddress_ApartmentOrUnitNumber[0]: x=96 y=423 w=85.4 h=15
//   Email_Address[0]:                               x=36 y=297 w=540  h=15
const APT_MAX = 5;
const EMAIL_MAX = 30;
const fits = (v: string, max: number) => (v.length <= max ? v : '');
const overflows = (v: string, max: number) => (v.length > max ? v : '');
const COUNTRY_CODES: Record<string, string> = {
  us: 'US', usa: 'US', 'united states': 'US', 'united states of america': 'US',
  ca: 'CA', canada: 'CA', mx: 'MX', mexico: 'MX', uk: 'GB', gb: 'GB', 'united kingdom': 'GB',
  de: 'DE', germany: 'DE', jp: 'JP', japan: 'JP', kr: 'KR', 'south korea': 'KR', korea: 'KR',
  ph: 'PH', philippines: 'PH', pr: 'PR', 'puerto rico': 'PR', gu: 'GU', guam: 'GU', it: 'IT', italy: 'IT',
};
const toCountryCode = (v: string) => {
  const key = v.trim().toLowerCase();
  if (!key) return '';
  if (COUNTRY_CODES[key]) return COUNTRY_CODES[key];
  return /^[a-z]{2}$/.test(key) ? key.toUpperCase() : '';
};

/**
 * The cell is labelled "Apt./Unit Number", so a typed prefix only spends
 * characters: "Apt 7B" -> "7B", "Unit #204" -> "204", "#12" -> "12".
 * Anything else ("Bldg 2 Apt 5") is kept as typed and overflows to draw-text.
 */
function normalizeApt(v: string): string {
  return v.trim().replace(/^(?:(?:apartment|apt|unit|suite|ste|no)\.?(?=[\s#\d]|$)\s*#?\s*|#\s*)/i, '').trim();
}

export const va281900Mapping: FieldMapping = {
  // Personal
  firstName: [
    { pdfFieldName: 'form1[0].#subform[0].FirstName[0]', type: 'text', transform: v => fits(v.trim(), 12) },
    { pdfFieldName: 'DRAW_TEXT_FIRSTNAME', type: 'draw-text', transform: v => overflows(v.trim(), 12), textPage: 0, textX: 38, textY: 523, textSize: 10 },
  ],
  middleInitial: { pdfFieldName: 'form1[0].#subform[0].MiddleInitial[0]', type: 'text' },
  lastName: [
    { pdfFieldName: 'form1[0].#subform[0].LastName[0]', type: 'text', transform: v => fits(v.trim(), 18) },
    { pdfFieldName: 'DRAW_TEXT_LASTNAME', type: 'draw-text', transform: v => overflows(v.trim(), 18), textPage: 0, textX: 272, textY: 523, textSize: 10 },
  ],
  ssn: [
    { pdfFieldName: 'form1[0].#subform[0].FirstThreeNumbers[0]', type: 'text', transform: v => v.replace(/\D/g, '').slice(0, 3) },
    { pdfFieldName: 'form1[0].#subform[0].SecondTwoNumbers[0]', type: 'text', transform: v => v.replace(/\D/g, '').slice(3, 5) },
    { pdfFieldName: 'form1[0].#subform[0].LastFourNumbers[0]', type: 'text', transform: v => v.replace(/\D/g, '').slice(5) },
  ],
  vaFileNumber: { pdfFieldName: 'form1[0].#subform[0].VA_File_Number[0]', type: 'text' },
  dob: [
    { pdfFieldName: 'form1[0].#subform[0].Month[0]', type: 'text', transform: v => v ? v.split('-')[1] || '' : '' },
    { pdfFieldName: 'form1[0].#subform[0].Day[0]', type: 'text', transform: v => v ? v.split('-')[2] || '' : '' },
    { pdfFieldName: 'form1[0].#subform[0].Year[0]', type: 'text', transform: v => v ? v.split('-')[0] || '' : '' },
  ],

  // Contact
  street: [
    { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_NumberAndStreet[0]', type: 'text', transform: v => fits(v.trim(), 30) },
    { pdfFieldName: 'DRAW_TEXT_STREET', type: 'draw-text', transform: v => overflows(v.trim(), 30), textPage: 0, textX: 68, textY: 445, textSize: 10 },
  ],
  apt: [
    { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_ApartmentOrUnitNumber[0]', type: 'text', transform: v => fits(normalizeApt(v), APT_MAX) },
    { pdfFieldName: 'DRAW_TEXT_APT', type: 'draw-text', transform: v => overflows(normalizeApt(v), APT_MAX), textPage: 0, textX: 98, textY: 427, textSize: 10 },
  ],
  city: [
    { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_City[0]', type: 'text', transform: v => fits(v.trim(), 18) },
    { pdfFieldName: 'DRAW_TEXT_CITY', type: 'draw-text', transform: v => overflows(v.trim(), 18), textPage: 0, textX: 218, textY: 427, textSize: 10 },
  ],
  state: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_StateOrProvince[0]', type: 'text' },
  zip: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_ZIPOrPostalCode_FirstFiveNumbers[0]', type: 'text' },
  // The Country cell is a 2-character comb (ISO code). Profile values like
  // "USA" or "United States" would make the cell print blank, so normalize.
  country: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_Country[0]', type: 'text', transform: v => toCountryCode(v) },
  mainPhone: [
    { pdfFieldName: 'form1[0].#subform[0].AreaCode[0]', type: 'text', transform: v => v.replace(/\D/g, '').slice(0, 3) },
    { pdfFieldName: 'form1[0].#subform[0].FirstThreeNumbers[1]', type: 'text', transform: v => v.replace(/\D/g, '').slice(3, 6) },
    { pdfFieldName: 'form1[0].#subform[0].LastFourNumbers[1]', type: 'text', transform: v => v.replace(/\D/g, '').slice(6) },
  ],
  cellPhone: [
    { pdfFieldName: 'form1[0].#subform[0].AreaCode[1]', type: 'text', transform: v => v.replace(/\D/g, '').slice(0, 3) },
    { pdfFieldName: 'form1[0].#subform[0].FirstThreeNumbers[2]', type: 'text', transform: v => v.replace(/\D/g, '').slice(3, 6) },
    { pdfFieldName: 'form1[0].#subform[0].LastFourNumbers[2]', type: 'text', transform: v => v.replace(/\D/g, '').slice(6) },
  ],
  intlPhone: { pdfFieldName: 'form1[0].#subform[0].International_Telephone_Number_If_Applicable[0]', type: 'text' },
  email: [
    { pdfFieldName: 'form1[0].#subform[0].Email_Address[0]', type: 'text', transform: v => fits(v.trim(), EMAIL_MAX) },
    { pdfFieldName: 'DRAW_TEXT_EMAIL', type: 'draw-text', transform: v => overflows(v.trim(), EMAIL_MAX), textPage: 0, textX: 38, textY: 301, textSize: 10 },
  ],
  agreeElectronic: { pdfFieldName: 'form1[0].#subform[0].CheckBox1[0]', type: 'checkbox' },

  // Education
  yearsOfEducation: { pdfFieldName: 'form1[0].#subform[0].Number_Of_Years_Of_Education[0]', type: 'text' },

  // AcroForm fields confirmed from annotation rects (page 1, 0-indexed):
  //   SignatureField11[0]: x=36 y=522 w=348 h=30
  //   IfIDontGiveMyInfo[0]: x=38.8 y=625.5 w=9 h=9  (checkCX=43, checkCY=630)
  //   Month[1]: x=396 y=537  Day[1]: x=450 y=537  Year[1]: x=504 y=537
  signaturePad: {
    pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY',
    type: 'image',
    imagePage: 1,
    imageX: 36,
    imageY: 522,
    imageWidth: 348,
    imageHeight: 30,
  },
  // Date is split into three separate fields (same pattern as DOB)
  signatureDate: [
    { pdfFieldName: 'form1[0].#subform[1].Month[1]', type: 'text', transform: (v: string) => v ? v.split('-')[1] || '' : '' },
    { pdfFieldName: 'form1[0].#subform[1].Day[1]',   type: 'text', transform: (v: string) => v ? v.split('-')[2] || '' : '' },
    { pdfFieldName: 'form1[0].#subform[1].Year[1]',  type: 'text', transform: (v: string) => v ? v.split('-')[0] || '' : '' },
  ],
  // Privacy Act acknowledgment checkbox (IfIDontGiveMyInfo[0]), confirmed via annotation rect
  privacyAct: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: (v: string) => v === 'true' ? 'true' : '', checkPage: 1, checkCX: 43, checkCY: 630, checkSize: 6 },
};
