/**
 * Goal-based form finder configuration.
 *
 * The dashboard presents these goals as clickable cards ("What do you want to
 * do?"). Selecting a goal reveals the matching VA forms with plain-language
 * action labels, so a veteran picks by intent rather than by form number.
 *
 * `icon` is a string key resolved to a lucide-react component in the dashboard.
 * Every form in the registry should appear under exactly one goal so the goal
 * grid stays a complete, non-overlapping map of what the app can do.
 */

export interface GoalForm {
  /** Form id as registered in registry.ts */
  formId: string;
  /** Plain-language description of what this form accomplishes */
  actionLabel: string;
}

export interface Goal {
  id: string;
  /** Short, intent-first label shown on the goal card */
  label: string;
  /** One-line helper under the label */
  tagline: string;
  /** lucide-react icon name (mapped to a component in the dashboard) */
  icon: string;
  forms: GoalForm[];
}

export const goals: Goal[] = [
  {
    id: 'school',
    label: 'Go to school or use the GI Bill',
    tagline: 'Degrees, certificates, tutoring, and work-study',
    icon: 'GraduationCap',
    forms: [
      { formId: 'va-22-1990',  actionLabel: 'Apply for education benefits (GI Bill)' },
      { formId: 'va-22-1990t', actionLabel: 'Apply for tutorial assistance' },
      { formId: 'va-22-8691',  actionLabel: 'Apply for a work-study allowance' },
      { formId: 'va-22-1995',  actionLabel: 'Change your school or training program' },
    ],
  },
  {
    id: 'certification',
    label: 'Get a license or certification',
    tagline: 'Reimburse licensing, certification, and exam fees',
    icon: 'BadgeCheck',
    forms: [
      { formId: 'va-22-0803', actionLabel: 'Reimburse a licensing or certification test fee' },
      { formId: 'va-22-0810', actionLabel: 'Reimburse a national exam fee (SAT, CLEP, GRE, AP)' },
    ],
  },
  {
    id: 'dependents',
    label: 'Use benefits as a spouse or child',
    tagline: 'Transferred, survivor, and dependent education benefits',
    icon: 'Users',
    forms: [
      { formId: 'va-22-1990e', actionLabel: 'Apply to use transferred Post-9/11 GI Bill benefits' },
      { formId: 'va-22-5490',  actionLabel: "Apply for survivors' & dependents' education (DEA / Fry)" },
      { formId: 'va-22-5495',  actionLabel: 'Change your school or program (dependents)' },
    ],
  },
  {
    id: 'vre',
    label: 'Get disability-related career help',
    tagline: 'Veteran Readiness & Employment (VR&E, Chapter 31)',
    icon: 'Briefcase',
    forms: [
      { formId: 'va-28-1900', actionLabel: 'Apply for Veteran Readiness & Employment (VR&E)' },
    ],
  },
  {
    id: 'home',
    label: 'Buy or refinance a home',
    tagline: 'VA home loan Certificate of Eligibility',
    icon: 'Home',
    forms: [
      { formId: 'va-26-1880', actionLabel: 'Request a Certificate of Eligibility (COE)' },
    ],
  },
  {
    id: 'healthcare',
    label: 'Enroll in VA health care',
    tagline: 'Apply for VA medical benefits',
    icon: 'HeartPulse',
    forms: [
      { formId: 'va-10-10ez', actionLabel: 'Apply for VA health care' },
    ],
  },
  {
    id: 'representative',
    label: 'Appoint someone to represent you',
    tagline: 'Authorize a representative to act on your behalf',
    icon: 'UserCheck',
    forms: [
      { formId: 'va-21-22a', actionLabel: 'Appoint an individual as your representative' },
    ],
  },
  {
    id: 'refunds',
    label: 'Refunds & other forms',
    tagline: 'VEAP refunds and course enrollment affirmations',
    icon: 'Receipt',
    forms: [
      { formId: 'va-22-5281',  actionLabel: 'Request a refund of VEAP (Chapter 32) contributions' },
      { formId: 'va-22-1999c', actionLabel: 'Affirm correspondence course enrollment' },
    ],
  },
];
