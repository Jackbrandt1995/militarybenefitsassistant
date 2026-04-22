import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va281900Mapping: FieldMapping = {
  // Personal
  firstName: { pdfFieldName: 'form1[0].#subform[0].FirstName[0]', type: 'text' },
  middleInitial: { pdfFieldName: 'form1[0].#subform[0].MiddleInitial[0]', type: 'text' },
  lastName: { pdfFieldName: 'form1[0].#subform[0].LastName[0]', type: 'text' },
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
  street: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_NumberAndStreet[0]', type: 'text' },
  apt: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_ApartmentOrUnitNumber[0]', type: 'text' },
  city: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_City[0]', type: 'text' },
  state: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_StateOrProvince[0]', type: 'text' },
  zip: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_ZIPOrPostalCode_FirstFiveNumbers[0]', type: 'text' },
  country: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_Country[0]', type: 'text' },
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
  email: { pdfFieldName: 'form1[0].#subform[0].Email_Address[0]', type: 'text' },
  agreeElectronic: { pdfFieldName: 'form1[0].#subform[0].CheckBox1[0]', type: 'checkbox' },
  // "None" checkboxes — injected by FormWizard when that phone field is blank.
  // Coordinates are estimates; adjust checkCY if squares land in wrong rows after testing.
  mainPhoneNone: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 510, checkSize: 6 },
  cellPhoneNone: { pdfFieldName: 'DRAW_CHECK', type: 'draw-check', transform: v => v === 'true' ? 'true' : '', checkPage: 0, checkCX: 43, checkCY: 493, checkSize: 6 },

  // Education
  yearsOfEducation: { pdfFieldName: 'form1[0].#subform[0].Number_Of_Years_Of_Education[0]', type: 'text' },

  // AcroForm field confirmed: SignatureField11[0] page=1 x=36 y=522 w=348 h=30
  // Signature is on page 1 (second page, 0-indexed).
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 1, imageX: 36, imageY: 518, imageWidth: 230, imageHeight: 30 },
  ],
  signatureDate: [
    { pdfFieldName: 'form1[0].#subform[1].DateSigned[0]', type: 'text', transform: formatDateString },
    { pdfFieldName: 'DRAW_TEXT', type: 'draw-text', transform: formatDateString, textPage: 1, textX: 400, textY: 524, textSize: 10 },
  ],
};
