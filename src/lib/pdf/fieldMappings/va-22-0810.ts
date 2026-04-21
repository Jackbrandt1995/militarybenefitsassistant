import type { FieldMapping } from '../fillPdf';

export const va220810Mapping: FieldMapping = {
  // Applicant – firstName maps to combined PDF name field
  firstName: { pdfFieldName: 'F[0].Page_1[0].ApplicantsName[0]', type: 'text' },
  address: { pdfFieldName: 'F[0].Page_1[0].Address[0]', type: 'text' },
  ssn: { pdfFieldName: 'F[0].Page_1[0].SSN[0]', type: 'text' },
  daytimePhone: { pdfFieldName: 'F[0].Page_1[0].DaytimePhone[0]', type: 'text' },
  eveningPhone: { pdfFieldName: 'F[0].Page_1[0].EveningPhone[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'F[0].Page_1[0].VAFileNumber[0]', type: 'text' },

  // Benefit chapter checkboxes (driven by benefitProgram radio)
  benefitProgram: [
    { pdfFieldName: 'F[0].Page_1[0].box_ch33[0]', type: 'checkbox', transform: v => v === 'chapter33' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].box_ch30[0]', type: 'checkbox', transform: v => v === 'chapter30' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].box_ch32[0]', type: 'checkbox', transform: v => v === 'chapter32' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].box_ch35[0]', type: 'checkbox', transform: v => v === 'chapter35' ? 'true' : 'false' },
    { pdfFieldName: 'F[0].Page_1[0].box_ch1606[0]', type: 'checkbox', transform: v => v === 'chapter1606' ? 'true' : 'false' },
  ],

  // Exam
  examName: { pdfFieldName: 'F[0].Page_1[0].NameOfExam[0]', type: 'text' },
  examDate: { pdfFieldName: 'F[0].Page_1[0].DateExamTaken[0]', type: 'text' },
  organization: { pdfFieldName: 'F[0].Page_1[0].Organization[0]', type: 'text' },
  examCost: { pdfFieldName: 'F[0].Page_1[0].ItemizeExamCost[0]', type: 'text' },
  remarks: { pdfFieldName: 'F[0].Page_1[0].Remarks[0]', type: 'text' },
};
