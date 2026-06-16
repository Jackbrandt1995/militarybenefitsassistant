import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

export const va225490Mapping: FieldMapping = {
  // Applicant – Page 1
  // fullName / fullAddress computed by computeAnswers in the form definition
  fullName: { pdfFieldName: 'form1[0].Page_1[0].NAME[0]', type: 'text' },
  ssn: { pdfFieldName: 'form1[0].Page_1[0].SSN[0]', type: 'text' , transform: (v: string) => v.replace(/\D/g, '')},
  dob: { pdfFieldName: 'form1[0].Page_1[0].DOB[0]', type: 'text', transform: formatDateString },
  // GENDER (Q2) is a single radio group with export options MALE | FEMALE.
  sex: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[0]', type: 'radio', transform: v => v === 'Male' ? 'MALE' : 'FEMALE' },
  fullAddress: { pdfFieldName: 'form1[0].Page_1[0].address[0]', type: 'text' },
  homePhone: { pdfFieldName: 'form1[0].Page_1[0].PrimaryTelephone[0]', type: 'text' },
  mobilePhone: { pdfFieldName: 'form1[0].Page_1[0].SecondaryTelephone[0]', type: 'text' },
  email: { pdfFieldName: 'form1[0].Page_1[0].EMAIL[0]', type: 'text' },

  // Direct Deposit (Q8). ACCOUNT TYPE is a single radio group: CHECKING | SAVINGS.
  accountType: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[1]', type: 'radio', transform: v => v === 'Savings' ? 'SAVINGS' : 'CHECKING' },
  // Routing/account number text fields are (mis)named SocialSecurityNumber[2]/[3] in the real PDF.
  // Confirmed via tooltip: [2]="ROUTING OR TRANSIT NUMBER", [3]="ACCOUNT NUMBER".
  routingNumber: { pdfFieldName: 'form1[0].Page_1[0].SocialSecurityNumber[2]', type: 'text', transform: (v: string) => v.replace(/\D/g, '') },
  accountNumber: { pdfFieldName: 'form1[0].Page_1[0].SocialSecurityNumber[3]', type: 'text' },

  // Qualifying Individual.
  // Item 9 name wants "First name, middle initial, last name" in one field (Name[1]).
  // qiFullName is computed in the definition's computeAnswers from qiFirstName +
  // qiMiddleName initial + qiLastName so the middle initial / last name aren't dropped.
  qiFullName: { pdfFieldName: 'form1[0].Page_1[0].Name[1]', type: 'text' },
  qiSSN: { pdfFieldName: 'form1[0].Page_1[0].SocialSecurityNumber[1]', type: 'text' , transform: (v: string) => v.replace(/\D/g, '')},
  qiBranch: { pdfFieldName: 'form1[0].Page_1[0].BranchService[0]', type: 'text' },
  qiDOB: { pdfFieldName: 'form1[0].Page_1[0].DOB2[0]', type: 'text', transform: formatDateString },
  qiDateMIA: { pdfFieldName: 'form1[0].Page_1[0].DateListed[0]', type: 'text', transform: formatDateString },
  qiDateOfDeath: { pdfFieldName: 'form1[0].Page_1[0].DateofDeath[0]', type: 'text', transform: formatDateString },
  // Item 13C "DID PARENT OR SPOUSE DIE FROM A SERVICE CONNECTED DISABILITY WHILE A
  // MEMBER OF THE SELECTED RESERVE?" — left YES/NO group (RadioButtonList[2], cy=282).
  // NOTE: the wizard label ("Does the veteran have a service-connected disability?")
  // is the closest collected question but is not a perfect semantic match — 13C asks
  // whether the qualifying individual *died from* a service-connected disability.
  // Mapped here (was previously unmapped/blank) as the nearest available field.
  qiServiceConnectedDisability: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[2]', type: 'radio', transform: v => v === 'Yes' ? 'YES' : 'NO' },
  // Q14 "IS QUALIFYING INDIVIDUAL CURRENTLY ON ACTIVE DUTY?" — left column YES/NO group
  // on page 1 (RadioButtonList[3], rect y=229 x=36). Options: YES | NO.
  qiOnActiveDuty: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[3]', type: 'radio', transform: v => v === 'Yes' ? 'YES' : 'NO' },

  // Item 16 RELATIONSHIP (required, Check only one). Single radio group
  // RadioButtonList[8] OPTS=[SPOUSE|BIOLOGICAL CHILD|STEPCHILD|ADOPTED CHILD].
  relationship: {
    pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[8]',
    type: 'radio',
    transform: v =>
      v === 'Spouse' ? 'SPOUSE'
      : v === 'BiologicalChild' ? 'BIOLOGICAL CHILD'
      : v === 'Stepchild' ? 'STEPCHILD'
      : v === 'AdoptedChild' ? 'ADOPTED CHILD'
      : '',
  },
  // Item 17A DATE OF MARRIAGE TO THE QUALIFYING INDIVIDUAL (Page_1 DateSigned[0], cy=114).
  marriageDate: { pdfFieldName: 'form1[0].Page_1[0].DateSigned[0]', type: 'text', transform: formatDateString },
  // Item 18 "IF YOU ARE THE SURVIVING SPOUSE, HAVE YOU REMARRIED?" — left YES/NO group
  // (RadioButtonList[7], cy=90). Options: YES | NO.
  remarried: { pdfFieldName: 'form1[0].Page_1[0].RadioButtonList[7]', type: 'radio', transform: v => v === 'Yes' ? 'YES' : 'NO' },

  // Benefit election – Page 2. The primary election depends on relationship:
  //   Item 19 (SPOUSE):  A[0] = Chapter 35 DEA, B[0] = Chapter 33 Fry
  //   Item 20 (CHILD):   A[1] = Chapter 35 DEA, B[1] = Chapter 33 Fry
  // (Confirmed via field-dump tooltips.) Because a transform only receives its own
  // field's value, the relationship+benefitType combination is resolved into four
  // booleans in the definition's computeAnswers (benefitSpouseDEA / benefitSpouseFry /
  // benefitChildDEA / benefitChildFry); each checkbox is gated on its own computed key.
  // The two CheckBox_Chapter35DEA[0]/CheckBox_Chapter33_FRYScholarship[0] boxes are the
  // rare "use this benefit FIRST" boxes and are intentionally left unchecked.
  benefitSpouseDEA: { pdfFieldName: 'form1[0].Page_2[0].A[0]', type: 'checkbox', transform: v => v === 'true' ? 'true' : 'false' },
  benefitSpouseFry: { pdfFieldName: 'form1[0].Page_2[0].B[0]', type: 'checkbox', transform: v => v === 'true' ? 'true' : 'false' },
  benefitChildDEA:  { pdfFieldName: 'form1[0].Page_2[0].A[1]', type: 'checkbox', transform: v => v === 'true' ? 'true' : 'false' },
  benefitChildFry:  { pdfFieldName: 'form1[0].Page_2[0].B[1]', type: 'checkbox', transform: v => v === 'true' ? 'true' : 'false' },

  // Education info – Page 2. Q23 "HAS THE APPLICANT GRADUATED HIGH SCHOOL OR RECEIVED A GED?"
  // is a single radio group (Page_2 RadioButtonList[3]) whose export options are long strings.
  hsGraduated: {
    pdfFieldName: 'form1[0].Page_2[0].RadioButtonList[3]',
    type: 'radio',
    transform: v => v === 'Yes'
      ? 'YES (If "YES," please provide the date of graduation or the date you received GED) (MM/DD/YYYY)'
      : 'NO (If "NO," please provide the expected date of graduation or GED) (MM/DD/YYYY)',
  },
  // hsGradDate removed: orphan key — no matching wizard question (the definition only
  // collects hsGraduated Yes/No) and computeAnswers never produces it, so it was always blank.

  // educationType (type of training), schoolName (name/address of school) and
  // educationObjective (educational/vocational objective) are INTENTIONALLY NOT MAPPED.
  // The JAN 2024 edition of VA Form 22-5490 has no such data-entry cells: Part IV
  // ("AGE AND HIGH SCHOOL INFORMATION", items 22-25) only collects under-18 status, HS/GED
  // graduation, vocational-counseling interest, and special-training disability — there is
  // no "TYPE OF TRAINING/EDUCATION", no "NAME AND LOCATION/ADDRESS OF SCHOOL", and no
  // "EDUCATIONAL OR VOCATIONAL OBJECTIVE" field anywhere on the form (the only mentions of
  // "vocational objective" / "courses" / "educational institutions" are in the prose
  // instructions). On the modern form the applicant selects a school/program later via the
  // va.gov enrollment flow, so these wizard fields have no destination cell here.

  // bankName (wizard) is INTENTIONALLY NOT MAPPED. Item 8 DIRECT DEPOSIT has only
  // ROUTING OR TRANSIT NUMBER, ACCOUNT TYPE (CHECKING|SAVINGS) and ACCOUNT NUMBER — no
  // bank/financial-institution NAME cell (the bank is identified by the routing number).

  // previouslyReceivedVABenefits (wizard Yes/No) is INTENTIONALLY NOT MAPPED.
  // Item 26 on the PDF is not a single Yes/No control — it is a checkbox SET
  // (Page_3 A[0]/B[0]/C[0]/D[0]/E[0]/G[0]: "check all that apply" among disability
  // compensation, DIC, etc.). A boolean Yes/No can't choose which box(es) to tick, so
  // forcing it onto any one box would be wrong. Left unmapped until the wizard collects
  // the specific benefit categories.

  // Service Periods – Page 3
  sp1Entered: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].DateEntered[0]', type: 'text', transform: formatDateString },
  sp1Separated: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].DateEntered[1]', type: 'text', transform: formatDateString },
  sp1Branch: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].BranchReserveGuard1[0]', type: 'text' },
  sp1Discharge: { pdfFieldName: 'form1[0].Page_3[0].#subform[0].#subform[2].characterdischarge1[0]', type: 'text' },

  // Signature image overlay + draw-text date fallback
  // AcroForm fields confirmed: SignatureField11[0] page=2 x=36 y=288 w=378 h=24 (applicant)
  //                            DateSigned[2] page=2 x=426 y=288
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 2, imageX: 36, imageY: 284, imageWidth: 230, imageHeight: 24 },
  ],
  signatureDate: [
    { pdfFieldName: 'form1[0].Page_3[0].DateSigned[2]', type: 'text', transform: formatDateString },
    { pdfFieldName: 'DRAW_TEXT_DATE', type: 'draw-text', transform: formatDateString, textPage: 2, textX: 426, textY: 290, textSize: 10 },
  ],
};
