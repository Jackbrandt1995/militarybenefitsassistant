import { z } from 'zod';

export const ssnSchema = z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, 'SSN must be 9 digits (XXX-XX-XXXX)');
export const phoneSchema = z.string().regex(/^[\d() .-]{10,14}$/, 'Invalid phone number');
export const zipSchema = z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code');
export const emailSchema = z.string().email('Invalid email address');
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format');
export const routingNumberSchema = z.string().regex(/^\d{9}$/, 'Routing number must be 9 digits');

export const stateOptions = [
  { label: 'Alabama', value: 'AL' }, { label: 'Alaska', value: 'AK' }, { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' }, { label: 'California', value: 'CA' }, { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' }, { label: 'Delaware', value: 'DE' }, { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' }, { label: 'Hawaii', value: 'HI' }, { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' }, { label: 'Indiana', value: 'IN' }, { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' }, { label: 'Kentucky', value: 'KY' }, { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' }, { label: 'Maryland', value: 'MD' }, { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' }, { label: 'Minnesota', value: 'MN' }, { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' }, { label: 'Montana', value: 'MT' }, { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' }, { label: 'New Hampshire', value: 'NH' }, { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' }, { label: 'New York', value: 'NY' }, { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' }, { label: 'Ohio', value: 'OH' }, { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' }, { label: 'Pennsylvania', value: 'PA' }, { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' }, { label: 'South Dakota', value: 'SD' }, { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' }, { label: 'Utah', value: 'UT' }, { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' }, { label: 'Washington', value: 'WA' }, { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' }, { label: 'Wyoming', value: 'WY' }, { label: 'Washington DC', value: 'DC' },
  { label: 'Puerto Rico', value: 'PR' }, { label: 'Virgin Islands', value: 'VI' },
  { label: 'Guam', value: 'GU' }, { label: 'American Samoa', value: 'AS' },
];

export const branchOptions = [
  { label: 'Army', value: 'Army' },
  { label: 'Navy', value: 'Navy' },
  { label: 'Air Force', value: 'Air Force' },
  { label: 'Marine Corps', value: 'Marine Corps' },
  { label: 'Coast Guard', value: 'Coast Guard' },
  { label: 'Space Force', value: 'Space Force' },
  { label: 'Army Reserve', value: 'USAR' },
  { label: 'Navy Reserve', value: 'USNR' },
  { label: 'Air Force Reserve', value: 'USAFR' },
  { label: 'Marine Corps Reserve', value: 'USMCR' },
  { label: 'Coast Guard Reserve', value: 'USCGR' },
  { label: 'Army National Guard', value: 'ARNG' },
  { label: 'Air National Guard', value: 'ANG' },
];

export const dischargeOptions = [
  { label: 'Honorable', value: 'Honorable' },
  { label: 'General (Under Honorable Conditions)', value: 'General' },
  { label: 'Other Than Honorable', value: 'OTH' },
  { label: 'Bad Conduct', value: 'Bad Conduct' },
  { label: 'Dishonorable', value: 'Dishonorable' },
  { label: 'Uncharacterized', value: 'Uncharacterized' },
];
