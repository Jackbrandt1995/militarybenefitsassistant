import type { FormDefinition, FormStepDef, FieldDef } from '../types';
import { va281900 } from './va-28-1900';
import { va281902w } from './va-28-1902w';

/**
 * VR&E Complete Package: one guided wizard that fills BOTH Chapter 31 forms
 * at once, VA Form 28-1900 (the VR&E application) and VA Form 28-1902w (the
 * Rehabilitation Needs Inventory brought to the initial evaluation).
 *
 * This is a BUNDLE definition (see FormDefinition.bundleForms): it owns the
 * merged wizard steps but has NO field mapping of its own. At generate time
 * the complete page fills each member form with its own registered mapping
 * and its own computeAnswers, run over this wizard's shared answer set, then
 * concatenates the two filled PDFs into one download and one submission.
 *
 * The steps below are COMPOSED from the two member definitions (not retyped),
 * so every field id, label, option value, condition and maxLength stays
 * byte-identical to what the audited member mappings expect, and any future
 * edit to a member step flows into the package automatically.
 *
 * Field-by-field diff of the two member definitions (documented here so the
 * merge stays auditable):
 *
 *   ASKED ONCE, FEEDS BOTH FORMS (same id in both member definitions):
 *     - firstName, middleInitial, lastName  (identical questions)
 *     - vaFileNumber                        (identical fact; the 1902w mapping
 *                                            prints only the last 4 digits via
 *                                            its own transform)
 *     - privacyAct                          (one acknowledgment gate covering
 *                                            both Privacy Act notices; mapped
 *                                            as the 28-1900 draw-check, and a
 *                                            documented no-PDF-cell residual
 *                                            on the 28-1902w)
 *
 *   ALIASES: none. The diff found NO pair of questions asking the same fact
 *   under different ids (e.g. the 28-1900's yearsOfEducation counts years of
 *   schooling while the 1902w's highestEducation asks the credential level:
 *   related, but distinct items on the printed forms), so this definition
 *   needs no computeAnswers of its own. The members' computeAnswers still run
 *   at fill time (the 1902w derives service1Dates/service2Dates there).
 *
 *   EVERYTHING ELSE is specific to one form and keeps its original id.
 *
 *   28-1900 ONLY: ssn, dob, the contact step (street, apt, city, state, zip,
 *   country, mainPhone, cellPhone, intlPhone, email, agreeElectronic),
 *   yearsOfEducation, signaturePad, signatureDate.
 *   28-1902w ONLY: every inventory item (contact verification, employment,
 *   jobs 1-5, work difficulties, military history, legal history, substance
 *   history, education/training items 16-18, disabilities, referrals,
 *   comments). The 1902w has no claimant signature block, so the single
 *   signature step feeds the 28-1900 only.
 */

/** Look up a member step by id; throws at module load if a member changed. */
function memberStep(def: FormDefinition, stepId: string): FormStepDef {
  const s = def.steps.find(st => st.id === stepId);
  if (!s) throw new Error(`va-vre-package: step "${stepId}" missing from ${def.id}`);
  return s;
}

/** Look up a member field by id; throws at module load if a member changed. */
function memberField(def: FormDefinition, stepId: string, fieldId: string): FieldDef {
  const f = memberStep(def, stepId).fields.find(fl => fl.id === fieldId);
  if (!f) throw new Error(`va-vre-package: field "${fieldId}" missing from ${def.id}.${stepId}`);
  return f;
}

// ── Personal: the 28-1900 personal step is a superset of the 1902w's ─────────
// (firstName, middleInitial, lastName, vaFileNumber are asked once here and
// feed both mappings; ssn and dob print on the 28-1900 only.)
const personal1900 = memberStep(va281900, 'personal');
const personalStep: FormStepDef = {
  ...personal1900,
  description: 'Your name and identifying information as they appear on your VA record. These print on both forms.',
  fields: personal1900.fields.map(f =>
    f.id === 'vaFileNumber'
      ? { ...f, helpText: 'If different from your SSN. Leave blank if unknown. Only the last four digits print on the Rehabilitation Needs Inventory.' }
      : f,
  ),
};

// ── Education: merge the 28-1900's years-of-education item into the 1902w's
//    education and training step so schooling is covered in one place ────────
const edu1902w = memberStep(va281902w, 'educationTraining');
const educationStep: FormStepDef = {
  ...edu1902w,
  title: 'Education and Training History',
  description: 'This section covers the education items on both forms: the number of years of education on the application, and Section VI (Items 16-18) of the Rehabilitation Needs Inventory. If you provide academic or training transcripts, certifications, and/or licenses, you do not need to complete every field.',
  fields: [memberField(va281900, 'education', 'yearsOfEducation'), ...edu1902w.fields],
};

// ── Documents: the 28-1900's required uploads plus the 1902w's optional ones.
//    The DD-214 appears on both lists; it is kept once, as required, with a
//    note that providing it also covers the inventory's military items. ──────
const requiredDocs1900 = memberStep(va281900, 'requiredDocs');
const optionalDocs1902w = memberStep(va281902w, 'optionalDocs');
const documentsStep: FormStepDef = {
  id: 'attachments',
  title: 'Supporting Documents',
  description: 'Upload the required documents for your VR&E application. The optional documents help your Vocational Rehabilitation Counselor at the initial evaluation: each one you provide means fewer inventory items to fill in by hand.',
  requiredAttachments: (requiredDocs1900.requiredAttachments ?? []).map(a =>
    a.label.startsWith('DD-214')
      ? { ...a, helpText: 'Also covers Items 10-13 of the Rehabilitation Needs Inventory, so your counselor only needs military details that are not on it.' }
      : a,
  ),
  optionalAttachments: (optionalDocs1902w.optionalAttachments ?? []).filter(
    a => !a.label.startsWith('DD-214'),
  ),
  fields: [],
};

// ── Certification: ONE privacyAct acknowledgment covering both notices, plus
//    the 28-1900 signature (the 1902w has no claimant signature block) ────────
const sig1900 = memberStep(va281900, 'signature');
const cert1902w = memberStep(va281902w, 'certification');
const signatureStep: FormStepDef = {
  ...sig1900,
  title: 'Certification & Signature',
  description: `FOR VA FORM 28-1900 (APPLICATION):\n\n${sig1900.description ?? ''}\n\nFOR VA FORM 28-1902w (REHABILITATION NEEDS INVENTORY):\n\n${cert1902w.description ?? ''}`,
  fields: sig1900.fields.map(f =>
    f.id === 'privacyAct'
      ? {
          ...f,
          label: 'I have read and understand the Privacy Act notices above for both forms.',
          helpText: 'You must check this box to certify that you have read both Privacy Act notices before signing. Your signature below prints on VA Form 28-1900 only; the Rehabilitation Needs Inventory has no claimant signature block.',
        }
      : f,
  ),
};

export const vaVrePackage: FormDefinition = {
  id: 'va-vre-package',
  version: 1,
  formNumber: 'VA 28-1900 + 28-1902w',
  title: 'VR&E Complete Package: Application + Rehabilitation Needs Inventory',
  description: 'One guided process for Veteran Readiness & Employment (Chapter 31). Answer the questions once and generate both VA Form 28-1900 (the application) and VA Form 28-1902w (the Rehabilitation Needs Inventory) filled out together.',
  // Members are filled from their own templates at generate time; this path
  // only identifies the lead form for tooling that expects one template.
  pdfTemplate: '/forms/VA-28-1900.pdf',
  category: 'application',
  bundleForms: ['va-28-1900', 'va-28-1902w'],
  steps: [
    personalStep,
    memberStep(va281900, 'contact'),
    memberStep(va281902w, 'contactVerification'),
    memberStep(va281902w, 'employmentStatus'),
    memberStep(va281902w, 'job1'),
    memberStep(va281902w, 'job2'),
    memberStep(va281902w, 'job3'),
    memberStep(va281902w, 'job4'),
    memberStep(va281902w, 'job5'),
    memberStep(va281902w, 'workDifficulties'),
    memberStep(va281902w, 'militaryHistory'),
    memberStep(va281902w, 'legalHistory'),
    memberStep(va281902w, 'substanceHistory'),
    educationStep,
    memberStep(va281902w, 'disabilities'),
    memberStep(va281902w, 'miscellaneous'),
    memberStep(va281902w, 'comments'),
    documentsStep,
    signatureStep,
  ],
  nextSteps: 'Your download contains both forms. Mail only VA Form 28-1900 (the first 3 pages) to your nearest VA Regional Office, or apply online at va.gov. Keep VA Form 28-1902w (the remaining pages) and bring it, with your resume, military records, and transcripts, to the initial evaluation appointment your Vocational Rehabilitation Counselor schedules.',
};
