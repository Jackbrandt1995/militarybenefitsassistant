/**
 * VA 26-1880 Field Mapping — SKELETON
 *
 * The PDF template must be placed at /public/forms/VA-26-1880.pdf
 * (download from https://www.vba.va.gov/pubs/forms/VBA-26-1880-ARE.pdf)
 *
 * After placing the PDF, run the field extraction script to get actual
 * field names/coordinates, then fill in each mapping entry below.
 */

import type { FieldMapping } from '../fillPdf';

export const va261880Mapping: FieldMapping = {
  // ─── Step 1: Personal Information ──────────────────────────────────────────
  firstName: [],
  middleName: [],
  lastName: [],
  suffix: [],
  ssn: [],
  dob: [],
  vaFileNumber: [],

  // ─── Step 2: Contact Information ───────────────────────────────────────────
  street: [],
  apt: [],
  city: [],
  state: [],
  zip: [],
  daytimePhone: [],
  email: [],

  // ─── Step 3: Type of Loan ───────────────────────────────────────────────────
  loanPurpose: [],
  propertyAddress: [],
  priorUse: [],
  entitlementRestored: [],
  stillOwnPriorHome: [],

  // ─── Step 4: Military Service — Period 1 ───────────────────────────────────
  service1Branch: [],
  service1Entered: [],
  service1Separated: [],
  service1Discharge: [],
  onActiveDuty: [],
  expectedSeparation: [],

  // ─── Step 5: Military Service — Periods 2 & 3 ─────────────────────────────
  service2Branch: [],
  service2Entered: [],
  service2Separated: [],
  service2Discharge: [],
  service3Branch: [],
  service3Entered: [],
  service3Separated: [],
  service3Discharge: [],

  // ─── Step 6: Prior VA Loans ─────────────────────────────────────────────────
  hadPriorLoan: [],
  priorLoanAddress: [],
  priorLoanAmount: [],
  priorLoanDate: [],
  priorLoanPaidOff: [],
  priorPropertySold: [],

  // ─── Step 8: Certification & Signature ─────────────────────────────────────
  // (Step 7 is attachments only — no wizard fields to map)
  privacyAct: [],
  signaturePad: [],
  signatureDate: [],
};
