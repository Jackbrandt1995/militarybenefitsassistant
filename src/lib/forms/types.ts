export type FieldType = 'text' | 'date' | 'select' | 'checkbox' | 'radio' | 'ssn' | 'phone' | 'textarea' | 'number' | 'email' | 'signature' | 'document';

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  required?: boolean;
  validation?: string;
  profilePath?: string;
  helpText?: string;
  placeholder?: string;
  maxLength?: number;
  condition?: { field: string; value: string | boolean };
  sensitive?: boolean; // show/hide toggle for bank account numbers, etc.
}

export interface FormStepDef {
  id: string;
  title: string;
  description?: string;
  fields: FieldDef[];
}

export type FormCategory = 'application' | 'change' | 'reimbursement' | 'dependent' | 'other';

export interface FormDefinition {
  id: string;
  formNumber: string;
  title: string;
  description: string;
  pdfTemplate: string;
  category: FormCategory;
  steps: FormStepDef[];
  /** Bump this number to force-clear any cached wizard state in localStorage. */
  version?: number;
}
