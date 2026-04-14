import type { FieldMapping } from '../fillPdf';

export const va220810Mapping: FieldMapping = {
  name: { pdfFieldName: 'F[0].Page_1[0].ApplicantsName[0]', type: 'text' },
  address: { pdfFieldName: 'F[0].Page_1[0].Address[0]', type: 'text' },
  ssn: { pdfFieldName: 'F[0].Page_1[0].SSN[0]', type: 'text' },
  dayPhone: { pdfFieldName: 'F[0].Page_1[0].DaytimePhone[0]', type: 'text' },
  eveningPhone: { pdfFieldName: 'F[0].Page_1[0].EveningPhone[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'F[0].Page_1[0].VAFileNumber[0]', type: 'text' },
  examName: { pdfFieldName: 'F[0].Page_1[0].NameOfExam[0]', type: 'text' },
  examDate: { pdfFieldName: 'F[0].Page_1[0].DateExamTaken[0]', type: 'text' },
  organization: { pdfFieldName: 'F[0].Page_1[0].Organization[0]', type: 'text' },
  examCost: { pdfFieldName: 'F[0].Page_1[0].ItemizeExamCost[0]', type: 'text' },
  education: { pdfFieldName: 'F[0].Page_1[0].Education[0]', type: 'text' },
  remarks: { pdfFieldName: 'F[0].Page_1[0].Remarks[0]', type: 'text' },
};
