import type { FieldMapping } from '../fillPdf';

export const va281900Mapping: FieldMapping = {
  // Personal
  firstName: { pdfFieldName: 'form1[0].#subform[0].FirstName[0]', type: 'text' },
  middleInitial: { pdfFieldName: 'form1[0].#subform[0].MiddleInitial[0]', type: 'text' },
  lastName: { pdfFieldName: 'form1[0].#subform[0].LastName[0]', type: 'text' },
  ssn_1: { pdfFieldName: 'form1[0].#subform[0].FirstThreeNumbers[0]', type: 'text' },
  ssn_2: { pdfFieldName: 'form1[0].#subform[0].SecondTwoNumbers[0]', type: 'text' },
  ssn_3: { pdfFieldName: 'form1[0].#subform[0].LastFourNumbers[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'form1[0].#subform[0].VA_File_Number[0]', type: 'text' },
  dob_month: { pdfFieldName: 'form1[0].#subform[0].Month[0]', type: 'text' },
  dob_day: { pdfFieldName: 'form1[0].#subform[0].Day[0]', type: 'text' },
  dob_year: { pdfFieldName: 'form1[0].#subform[0].Year[0]', type: 'text' },

  // Contact
  street: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_NumberAndStreet[0]', type: 'text' },
  apt: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_ApartmentOrUnitNumber[0]', type: 'text' },
  city: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_City[0]', type: 'text' },
  state: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_StateOrProvince[0]', type: 'text' },
  zip: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_ZIPOrPostalCode_FirstFiveNumbers[0]', type: 'text' },
  country: { pdfFieldName: 'form1[0].#subform[0].CurrentMailingAddress_Country[0]', type: 'text' },

  mainPhone_area: { pdfFieldName: 'form1[0].#subform[0].AreaCode[0]', type: 'text' },
  mainPhone_first3: { pdfFieldName: 'form1[0].#subform[0].FirstThreeNumbers[1]', type: 'text' },
  mainPhone_last4: { pdfFieldName: 'form1[0].#subform[0].LastFourNumbers[1]', type: 'text' },
  cellPhone_area: { pdfFieldName: 'form1[0].#subform[0].AreaCode[1]', type: 'text' },
  cellPhone_first3: { pdfFieldName: 'form1[0].#subform[0].FirstThreeNumbers[2]', type: 'text' },
  cellPhone_last4: { pdfFieldName: 'form1[0].#subform[0].LastFourNumbers[2]', type: 'text' },

  intlPhone: { pdfFieldName: 'form1[0].#subform[0].International_Telephone_Number_If_Applicable[0]', type: 'text' },
  email: { pdfFieldName: 'form1[0].#subform[0].Email_Address[0]', type: 'text' },
  agreeElectronic: { pdfFieldName: 'form1[0].#subform[0].CheckBox1[0]', type: 'checkbox' },

  // Education
  yearsOfEducation: { pdfFieldName: 'form1[0].#subform[0].Number_Of_Years_Of_Education[0]', type: 'text' },
};
