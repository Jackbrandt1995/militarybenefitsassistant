import type { FormDefinition } from '../types';
import { stateOptions } from '@/lib/validation';

export const va221990e: FormDefinition = {
  id: 'va-22-1990e',
  formNumber: 'VA 22-1990e',
  title: 'Application for Family Members to Use Transferred Benefits',
  description: 'Apply for transferred Post-9/11 GI Bill benefits as a spouse or child of a service member who has transferred their benefits.',
  pdfTemplate: '/forms/VA-22-1990e.pdf',
  category: 'dependent',
  steps: [
    {
      id: 'applicant',
      title: 'Applicant Information',
      fields: [
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted' },
        { id: 'name', label: 'Name (First, Middle Initial, Last)', type: 'text', required: true, profilePath: 'profile.first_name' },
        { id: 'street', label: 'Street Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'apt', label: 'Apt/Unit', type: 'text', profilePath: 'profile.address_apt' },
        { id: 'cityStateZip', label: 'City, State, ZIP', type: 'text' },
        { id: 'homePhone', label: 'Home Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'mobilePhone', label: 'Mobile Phone', type: 'phone', profilePath: 'profile.phone_mobile' },
        { id: 'email', label: 'Email', type: 'email', profilePath: 'profile.email' },
      ],
    },
    {
      id: 'directDeposit',
      title: 'Direct Deposit',
      fields: [
        { id: 'routingNumber', label: 'Routing Number', type: 'text', profilePath: 'directDeposit.routing_number_encrypted', maxLength: 9 },
        { id: 'accountNumber', label: 'Account Number', type: 'text', profilePath: 'directDeposit.account_number_encrypted' },
        { id: 'accountType', label: 'Account Type', type: 'radio', profilePath: 'directDeposit.account_type', options: [
          { label: 'Checking', value: 'Checking' }, { label: 'Savings', value: 'Savings' },
        ]},
      ],
    },
    {
      id: 'education',
      title: 'Education & Training',
      fields: [
        { id: 'hsGrad', label: 'High school diploma or GED?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'hsGradDate', label: 'Date received', type: 'date', profilePath: 'profile.high_school_diploma_date' },
        { id: 'educationType', label: 'Type of Education', type: 'radio', required: true, options: [
          { label: 'College or Other School', value: 'college' },
          { label: 'Vocational Flight Training', value: 'flight' },
          { label: 'National Test Reimbursement', value: 'test' },
          { label: 'Licensing/Certification Test', value: 'licensing' },
          { label: 'Apprenticeship/OJT', value: 'apprenticeship' },
          { label: 'Correspondence', value: 'correspondence' },
          { label: 'Tuition Assistance Top Up', value: 'topUp' },
        ]},
        { id: 'schoolName', label: 'School Name and Address', type: 'textarea' },
        { id: 'educationObjective', label: 'Educational/Career Objective', type: 'text' },
      ],
    },
    {
      id: 'educationHistory',
      title: 'Education After High School',
      fields: [
        { id: 'edu1Name', label: 'Institution 1', type: 'text', profilePath: 'educationHistory[0].institution' },
        { id: 'edu1From', label: 'From', type: 'date', profilePath: 'educationHistory[0].date_from' },
        { id: 'edu1To', label: 'To', type: 'date', profilePath: 'educationHistory[0].date_to' },
        { id: 'edu1Hours', label: 'Hours (type)', type: 'text' },
        { id: 'edu1Degree', label: 'Degree/Diploma', type: 'text', profilePath: 'educationHistory[0].degree' },
        { id: 'edu1Major', label: 'Major', type: 'text', profilePath: 'educationHistory[0].major' },
      ],
    },
    {
      id: 'serviceMember',
      title: 'Service Member Information',
      description: 'Information about the service member who transferred benefits to you.',
      fields: [
        { id: 'smSSN', label: 'Service Member SSN', type: 'ssn', required: true },
        { id: 'smBranch', label: 'Branch of Service', type: 'text', required: true },
        { id: 'smName', label: 'Service Member Name', type: 'text', required: true },
        { id: 'smStreet', label: 'Address', type: 'text' },
        { id: 'smApt', label: 'Apt/Unit', type: 'text' },
        { id: 'smCityStateZip', label: 'City, State, ZIP', type: 'text' },
      ],
    },
  ],
};
