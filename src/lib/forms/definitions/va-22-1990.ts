import type { FormDefinition } from '../types';
import { branchOptions, dischargeOptions, stateOptions } from '@/lib/validation';

export const va221990: FormDefinition = {
  id: 'va-22-1990',
  formNumber: 'VA 22-1990',
  title: 'Application for VA Education Benefits',
  description: 'Apply for VA education benefits under the GI Bill, MGIB, VEAP, or other programs. This is the primary application form for veterans seeking education benefits.',
  pdfTemplate: '/forms/VA-22-1990.pdf',
  category: 'application',
  steps: [
    {
      id: 'benefit',
      title: 'Benefit Selection',
      description: 'Select which education benefit you are applying for.',
      fields: [
        { id: 'benefitChapter', label: 'Education Benefit', type: 'radio', required: true, options: [
          { label: 'Chapter 33 - Post-9/11 GI Bill', value: 'chapter33' },
          { label: 'Chapter 30 - Montgomery GI Bill (MGIB)', value: 'chapter30' },
          { label: 'Chapter 1606 - MGIB Selected Reserve', value: 'chapter1606' },
          { label: 'Chapter 32/Section 903 - VEAP', value: 'chapter32' },
        ]},
      ],
    },
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Your basic identification information.',
      fields: [
        { id: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, profilePath: 'profile.ssn_encrypted' },
        { id: 'sex', label: 'Sex', type: 'radio', required: true, profilePath: 'profile.sex', options: [
          { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' },
        ]},
        { id: 'dob', label: 'Date of Birth', type: 'date', required: true, profilePath: 'profile.dob' },
        { id: 'firstName', label: 'First Name', type: 'text', required: true, profilePath: 'profile.first_name', maxLength: 30 },
        { id: 'middleName', label: 'Middle Name', type: 'text', profilePath: 'profile.middle_name' },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, profilePath: 'profile.last_name', maxLength: 30 },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      fields: [
        { id: 'street', label: 'Street Address', type: 'text', required: true, profilePath: 'profile.address_street' },
        { id: 'street2', label: 'Street Address Line 2', type: 'text' },
        { id: 'apt', label: 'Apt/Unit Number', type: 'text', profilePath: 'profile.address_apt' },
        { id: 'city', label: 'City', type: 'text', required: true, profilePath: 'profile.address_city' },
        { id: 'state', label: 'State', type: 'select', required: true, profilePath: 'profile.address_state', options: stateOptions },
        { id: 'zip', label: 'ZIP Code', type: 'text', required: true, profilePath: 'profile.address_zip', maxLength: 10 },
        { id: 'phonePrimary', label: 'Primary Phone', type: 'phone', required: true, profilePath: 'profile.phone_mobile' },
        { id: 'phoneSecondary', label: 'Secondary Phone', type: 'phone', profilePath: 'profile.phone_home' },
        { id: 'email', label: 'Email Address', type: 'email', required: true, profilePath: 'profile.email' },
      ],
    },
    {
      id: 'directDeposit',
      title: 'Direct Deposit',
      description: 'Provide your bank information for benefit payments.',
      fields: [
        { id: 'accountType', label: 'Account Type', type: 'radio', profilePath: 'directDeposit.account_type', options: [
          { label: 'Checking', value: 'Checking' }, { label: 'Savings', value: 'Savings' },
        ]},
        { id: 'routingNumber', label: 'Routing/Transit Number', type: 'text', profilePath: 'directDeposit.routing_number_encrypted', maxLength: 9 },
        { id: 'accountNumber', label: 'Account Number', type: 'text', profilePath: 'directDeposit.account_number_encrypted' },
      ],
    },
    {
      id: 'emergencyContact',
      title: 'Emergency Contact',
      description: 'Someone who will always know where you can be reached.',
      fields: [
        { id: 'emergencyName', label: 'Name', type: 'text' },
        { id: 'emergencyAddress', label: 'Address', type: 'text' },
        { id: 'emergencyPhone', label: 'Phone Number', type: 'phone' },
      ],
    },
    {
      id: 'educationType',
      title: 'Education Type & School',
      fields: [
        { id: 'educationType', label: 'Type of Education or Training', type: 'radio', required: true, options: [
          { label: 'College or Other School', value: 'college' },
          { label: 'Vocational Flight Training', value: 'flight' },
          { label: 'National Test Reimbursement', value: 'nationalTest' },
          { label: 'Licensing/Certification Test', value: 'licensingTest' },
          { label: 'Apprenticeship/On-the-Job', value: 'apprenticeship' },
          { label: 'Correspondence', value: 'correspondence' },
          { label: 'Tuition Assistance Top Up', value: 'taTopUp' },
        ]},
        { id: 'schoolNameAddress', label: 'Name and Address of School', type: 'textarea', helpText: 'Skip if applying for test reimbursement or TA Top Up' },
        { id: 'educationObjective', label: 'Educational or Career Objective', type: 'text', placeholder: 'e.g., Bachelor of Arts in Accounting, welding certificate' },
      ],
    },
    {
      id: 'service',
      title: 'Military Service',
      description: 'Your military service periods. Include all periods of active duty service.',
      fields: [
        { id: 'onActiveDuty', label: 'Are you now on active duty?', type: 'radio', required: true, options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'onTerminalLeave', label: 'Are you on terminal leave?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'service1Entered', label: 'Period 1 - Date Entered', type: 'date', profilePath: 'servicePeriods[0].date_entered' },
        { id: 'service1Separated', label: 'Period 1 - Date Separated', type: 'date', profilePath: 'servicePeriods[0].date_separated' },
        { id: 'service1Branch', label: 'Period 1 - Branch/Component', type: 'select', profilePath: 'servicePeriods[0].branch', options: branchOptions },
        { id: 'service1Status', label: 'Period 1 - Service Status', type: 'text', profilePath: 'servicePeriods[0].service_status', placeholder: 'Active duty, drilling reservist, IRR, etc.' },
        { id: 'service1Involuntary', label: 'Period 1 - Involuntarily called?', type: 'text' },
        { id: 'service2Entered', label: 'Period 2 - Date Entered', type: 'date', profilePath: 'servicePeriods[1].date_entered' },
        { id: 'service2Separated', label: 'Period 2 - Date Separated', type: 'date', profilePath: 'servicePeriods[1].date_separated' },
        { id: 'service2Branch', label: 'Period 2 - Branch/Component', type: 'select', profilePath: 'servicePeriods[1].branch', options: branchOptions },
        { id: 'service2Status', label: 'Period 2 - Service Status', type: 'text', profilePath: 'servicePeriods[1].service_status' },
        { id: 'service3Entered', label: 'Period 3 - Date Entered', type: 'date', profilePath: 'servicePeriods[2].date_entered' },
        { id: 'service3Separated', label: 'Period 3 - Date Separated', type: 'date', profilePath: 'servicePeriods[2].date_separated' },
        { id: 'service3Branch', label: 'Period 3 - Branch/Component', type: 'select', profilePath: 'servicePeriods[2].branch', options: branchOptions },
      ],
    },
    {
      id: 'education',
      title: 'Education History',
      fields: [
        { id: 'hsGrad', label: 'Did you receive a high school diploma or GED?', type: 'radio', profilePath: 'profile.high_school_diploma', options: [
          { label: 'Yes', value: 'true' }, { label: 'No', value: 'false' },
        ]},
        { id: 'hsGradDate', label: 'Date of Diploma/GED', type: 'date', profilePath: 'profile.high_school_diploma_date' },
        { id: 'faaFlightCerts', label: 'Do you hold any FAA flight certificates?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'edu1Name', label: 'College/Training 1 - Name & Location', type: 'text', profilePath: 'educationHistory[0].institution' },
        { id: 'edu1From', label: 'College 1 - From', type: 'date', profilePath: 'educationHistory[0].date_from' },
        { id: 'edu1To', label: 'College 1 - To', type: 'date', profilePath: 'educationHistory[0].date_to' },
        { id: 'edu1Hours', label: 'College 1 - Hours (type)', type: 'text', profilePath: 'educationHistory[0].hours_count' },
        { id: 'edu1Degree', label: 'College 1 - Degree/Diploma', type: 'text', profilePath: 'educationHistory[0].degree' },
        { id: 'edu1Major', label: 'College 1 - Major Field', type: 'text', profilePath: 'educationHistory[0].major' },
        { id: 'edu2Name', label: 'College/Training 2 - Name & Location', type: 'text', profilePath: 'educationHistory[1].institution' },
        { id: 'edu2From', label: 'College 2 - From', type: 'date', profilePath: 'educationHistory[1].date_from' },
        { id: 'edu2To', label: 'College 2 - To', type: 'date', profilePath: 'educationHistory[1].date_to' },
        { id: 'edu2Degree', label: 'College 2 - Degree/Diploma', type: 'text', profilePath: 'educationHistory[1].degree' },
        { id: 'edu2Major', label: 'College 2 - Major Field', type: 'text', profilePath: 'educationHistory[1].major' },
      ],
    },
    {
      id: 'employment',
      title: 'Employment History',
      description: 'Only complete if you held a license or journeyman rating.',
      fields: [
        { id: 'emp1Occupation', label: 'Before Service - Occupation', type: 'text', profilePath: 'employmentHistory[0].principal_occupation' },
        { id: 'emp1Months', label: 'Before Service - Months Worked', type: 'number' },
        { id: 'emp1License', label: 'Before Service - License/Rating', type: 'text', profilePath: 'employmentHistory[0].license_or_rating' },
        { id: 'emp2Occupation', label: 'After Service - Occupation', type: 'text' },
        { id: 'emp2Months', label: 'After Service - Months Worked', type: 'number' },
        { id: 'emp2License', label: 'After Service - License/Rating', type: 'text' },
      ],
    },
    {
      id: 'additional',
      title: 'Additional Information',
      fields: [
        { id: 'mgibContributions', label: 'Did you make additional contributions (up to $600)?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'activeDutyKicker', label: 'Do you qualify for an Active Duty Kicker?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'reserveKicker', label: 'Do you qualify for a Reserve Kicker?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'seniorROTC', label: 'Were you commissioned through Senior ROTC scholarship?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'receivingMilitaryTuition', label: 'Are you receiving money from the Armed Forces for this course?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'married', label: 'Are you married?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'dependentChildren', label: 'Do you have dependent children?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'dependentParent', label: 'Do you have a dependent parent?', type: 'radio', options: [
          { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' },
        ]},
        { id: 'remarks', label: 'Remarks', type: 'textarea' },
      ],
    },
  ],
};
