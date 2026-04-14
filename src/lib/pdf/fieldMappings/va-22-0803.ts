import type { FieldMapping } from '../fillPdf';

export const va220803Mapping: FieldMapping = {
  // Applicant
  name: { pdfFieldName: 'F[0].Page_1[0].nameapp[0]', type: 'text' },
  address: { pdfFieldName: 'F[0].Page_1[0].mailing[0]', type: 'text' },
  phone: { pdfFieldName: 'F[0].Page_1[0].telephone[0]', type: 'text' },
  vaFileNumber: { pdfFieldName: 'F[0].Page_1[0].VAFile[0]', type: 'text' },

  // Benefit checkboxes
  benefit_ch30: { pdfFieldName: 'F[0].Page_1[0].box1[0]', type: 'checkbox' },
  benefit_ch32: { pdfFieldName: 'F[0].Page_1[0].box2[0]', type: 'checkbox' },
  benefit_ch33: { pdfFieldName: 'F[0].Page_1[0].box3[0]', type: 'checkbox' },
  benefit_ch35: { pdfFieldName: 'F[0].Page_1[0].box4[0]', type: 'checkbox' },
  benefit_ch1606: { pdfFieldName: 'F[0].Page_1[0].box5[0]', type: 'checkbox' },

  passedAllYes: { pdfFieldName: 'F[0].Page_1[0].yes6a[0]', type: 'checkbox' },
  passedAllNo: { pdfFieldName: 'F[0].Page_1[0].no6a[0]', type: 'checkbox' },
  lastAttendance: { pdfFieldName: 'F[0].Page_1[0].DatelastAttendance[0]', type: 'text' },

  // Tests (up to 4)
  test1Name: { pdfFieldName: 'F[0].Page_1[0].NameTest1[0]', type: 'text' },
  test1Date: { pdfFieldName: 'F[0].Page_1[0].DateTest1[0]', type: 'text' },
  test1Results: { pdfFieldName: 'F[0].Page_1[0].TestResults1[0]', type: 'text' },
  test1Cost: { pdfFieldName: 'F[0].Page_1[0].CostTest1[0]', type: 'text' },
  test1OrgName: { pdfFieldName: 'F[0].Page_1[0].CompleteName1[0]', type: 'text' },
  test1OrgAddress: { pdfFieldName: 'F[0].Page_1[0].CompleteName1[1]', type: 'text' },

  test2Name: { pdfFieldName: 'F[0].Page_1[0].NameTest2[0]', type: 'text' },
  test2Date: { pdfFieldName: 'F[0].Page_1[0].DateTest2[0]', type: 'text' },
  test2Results: { pdfFieldName: 'F[0].Page_1[0].TestResults2[0]', type: 'text' },
  test2Cost: { pdfFieldName: 'F[0].Page_1[0].CostTest2[0]', type: 'text' },
  test2OrgName: { pdfFieldName: 'F[0].Page_1[0].CompleteName2[0]', type: 'text' },

  test3Name: { pdfFieldName: 'F[0].Page_1[0].NameTest3[0]', type: 'text' },
  test3Date: { pdfFieldName: 'F[0].Page_1[0].DateTest3[0]', type: 'text' },
  test3Results: { pdfFieldName: 'F[0].Page_1[0].TestResults3[0]', type: 'text' },
  test3Cost: { pdfFieldName: 'F[0].Page_1[0].CostTest3[0]', type: 'text' },
  test3OrgName: { pdfFieldName: 'F[0].Page_1[0].CompleteName3[0]', type: 'text' },

  test4Name: { pdfFieldName: 'F[0].Page_1[0].NameTest4[0]', type: 'text' },
  test4Date: { pdfFieldName: 'F[0].Page_1[0].DateTest4[0]', type: 'text' },
  test4Results: { pdfFieldName: 'F[0].Page_1[0].TestResults4[0]', type: 'text' },
  test4Cost: { pdfFieldName: 'F[0].Page_1[0].CostTest4[0]', type: 'text' },
  test4OrgName: { pdfFieldName: 'F[0].Page_1[0].CompleteName4[0]', type: 'text' },

  remarks: { pdfFieldName: 'F[0].Page_1[0].Remarks[0]', type: 'text' },
};
