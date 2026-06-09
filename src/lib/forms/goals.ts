/**
 * Top-level benefit categories for the dashboard finder.
 *
 * The dashboard shows these four categories as full-screen quadrant tiles
 * (Education · Certifications · Home Loan · Healthcare). Selecting one expands
 * it to fill the screen and lists its forms with plain-language action labels.
 *
 * `icon` is a string key resolved to a lucide-react component in the dashboard.
 * Every public (non-hidden) form should appear under at least one category so the
 * grid stays a complete map of what the app can do. A form may appear under more
 * than one category when it genuinely fits both (e.g. VR&E under Education and
 * Certifications).
 */

export interface GoalForm {
  /** Form id as registered in registry.ts */
  formId: string;
  /** Plain-language description of what this form accomplishes */
  actionLabel: string;
}

export interface Goal {
  id: string;
  /** Big category title shown on the quadrant tile */
  label: string;
  /** One-line helper under the title */
  tagline: string;
  /** lucide-react icon name (mapped to a component in the dashboard) */
  icon: string;
  forms: GoalForm[];
}

export const goals: Goal[] = [
  {
    id: 'education',
    label: 'Education',
    tagline: 'GI Bill, VR&E, dependents, work-study, and more',
    icon: 'GraduationCap',
    forms: [
      { formId: 'va-22-1990',  actionLabel: 'Apply for education benefits (GI Bill)' },
      { formId: 'va-22-1990e', actionLabel: 'Use transferred Post-9/11 GI Bill benefits' },
      { formId: 'va-22-1990t', actionLabel: 'Apply for tutorial assistance' },
      { formId: 'va-22-8691',  actionLabel: 'Apply for a work-study allowance' },
      { formId: 'va-22-1995',  actionLabel: 'Change your school or training program' },
      { formId: 'va-22-5490',  actionLabel: "Survivors' & dependents' education (DEA / Fry)" },
      { formId: 'va-22-5495',  actionLabel: 'Change school or program (dependents)' },
      { formId: 'va-28-1900',  actionLabel: 'Apply for Veteran Readiness & Employment (VR&E)' },
      { formId: 'va-22-5281',  actionLabel: 'Request a refund of VEAP contributions' },
      { formId: 'va-22-1999c', actionLabel: 'Affirm correspondence course enrollment' },
    ],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    tagline: 'Test-fee reimbursement and career readiness (VR&E)',
    icon: 'BadgeCheck',
    forms: [
      { formId: 'va-22-0803', actionLabel: 'Reimburse a licensing or certification test fee' },
      { formId: 'va-22-0810', actionLabel: 'Reimburse a national exam fee (SAT, CLEP, GRE, AP)' },
      { formId: 'va-28-1900', actionLabel: 'Apply for Veteran Readiness & Employment (VR&E)' },
    ],
  },
  {
    id: 'home',
    label: 'Home Loan',
    tagline: 'VA home loan Certificate of Eligibility',
    icon: 'Home',
    forms: [
      { formId: 'va-26-1880', actionLabel: 'Request a Certificate of Eligibility (COE)' },
    ],
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    tagline: 'Apply for or update VA medical benefits',
    icon: 'HeartPulse',
    forms: [
      { formId: 'va-10-10ez',  actionLabel: 'Apply for VA health care' },
      { formId: 'va-10-10ezr', actionLabel: 'Update your VA health benefits information' },
    ],
  },
];
