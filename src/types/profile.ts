export interface Profile {
  id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  suffix: string | null;
  ssn_encrypted: string | null;
  dob: string | null;
  sex: 'Male' | 'Female' | null;
  email: string | null;
  phone_home: string | null;
  phone_mobile: string | null;
  address_street: string | null;
  address_apt: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  address_country: string | null;
  va_file_number: string | null;
  high_school_diploma: boolean;
  high_school_diploma_date: string | null;
  faa_certificates: string | null;
  years_of_education: number | null;
  created_at: string;
  updated_at: string;
}

export interface ServicePeriod {
  id: string;
  user_id: string;
  branch: string | null;
  component: string | null;
  date_entered: string | null;
  date_separated: string | null;
  service_status: string | null;
  character_of_discharge: string | null;
  involuntarily_called: boolean;
  national_guard_duty_type: string | null;
  sort_order: number;
}

export interface EducationRecord {
  id: string;
  user_id: string;
  institution: string | null;
  location: string | null;
  date_from: string | null;
  date_to: string | null;
  hours_count: string | null;
  hours_type: 'Semester' | 'Quarter' | 'Clock' | null;
  degree: string | null;
  major: string | null;
  sort_order: number;
}

export interface EmploymentRecord {
  id: string;
  user_id: string;
  principal_occupation: string | null;
  license_or_rating: string | null;
  months_worked: number | null;
  before_or_after_service: 'before' | 'after' | null;
  sort_order: number;
}

export interface DirectDeposit {
  id: string;
  user_id: string;
  account_type: 'Checking' | 'Savings' | null;
  routing_number_encrypted: string | null;
  account_number_encrypted: string | null;
  bank_name: string | null;
}

export interface Dependent {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  relationship: string | null;
  ssn_encrypted: string | null;
  dob: string | null;
  sort_order: number;
}

export interface FormSubmission {
  id: string;
  user_id: string;
  form_id: string;
  form_name: string;
  answers_json: Record<string, unknown>;
  generated_at: string;
}

export interface UserProfile {
  profile: Profile;
  servicePeriods: ServicePeriod[];
  educationHistory: EducationRecord[];
  employmentHistory: EmploymentRecord[];
  directDeposit: DirectDeposit | null;
  dependents: Dependent[];
}
