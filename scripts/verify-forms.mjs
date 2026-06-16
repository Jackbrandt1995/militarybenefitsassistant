/**
 * Form-fill correctness verifier.
 *
 * Transpiles + imports the REAL definition (questions) and field mapping (with its
 * transform/computeAnswers functions) for every form, generates realistic answers,
 * then validates each mapping entry against the actual PDF AcroForm. Flags the
 * silent-failure modes fillPdf.ts swallows in its try/catch:
 *   - maxLength overflow on a text field   -> field renders BLANK
 *   - invalid radio/dropdown option        -> field renders BLANK
 *   - missing PDF field / type mismatch    -> nothing written
 *   - mapping key produced by no question  -> field always blank
 *
 * Usage: node scripts/verify-forms.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import ts from 'typescript';
import { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup, PDFDropdown } from 'pdf-lib';

const SCRIPTS = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPTS, '..');
const DEF_DIR = path.join(ROOT, 'src/lib/forms/definitions');
const MAP_DIR = path.join(ROOT, 'src/lib/pdf/fieldMappings');
const TMP = path.join(SCRIPTS, '.verify-tmp-' + process.pid); // pid-scoped: safe to run in parallel
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

// ── tiny TS bundler: transpile a module + its local deps, leave bare imports ──
const EXTS = ['.ts', '.tsx', '.js', '.mjs'];
const compiled = new Map();
let counter = 0;
function resolveSpec(spec, fromAbs) {
  let base;
  if (spec.startsWith('@/')) base = path.join(ROOT, 'src', spec.slice(2));
  else if (spec.startsWith('./') || spec.startsWith('../')) base = path.resolve(path.dirname(fromAbs), spec);
  else return null; // bare package -> Node resolves from node_modules
  for (const e of EXTS) if (existsSync(base + e)) return base + e;
  for (const e of EXTS) if (existsSync(path.join(base, 'index' + e))) return path.join(base, 'index' + e);
  return existsSync(base) ? base : null;
}
function compile(absPath) {
  if (compiled.has(absPath)) return compiled.get(absPath);
  const outName = `m${counter++}.mjs`;
  compiled.set(absPath, outName);
  let js = ts.transpileModule(readFileSync(absPath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  js = js.replace(/from\s+(['"])([^'"]+)\1/g, (m, q, spec) => {
    const dep = resolveSpec(spec, absPath);
    return dep ? `from ${q}./${compile(dep)}${q}` : m;
  });
  writeFileSync(path.join(TMP, outName), js, 'utf8');
  return outName;
}
const importTs = absPath => import(pathToFileURL(path.join(TMP, compile(absPath))).href);

const ALL_FORMS = [
  'va-22-1990', 'va-22-1990e', 'va-22-1990t', 'va-22-1995', 'va-22-0803',
  'va-22-0810', 'va-22-5281', 'va-22-5490', 'va-22-5495', 'va-22-8691',
  'va-28-1900', 'va-22-1999c', 'va-10-10ez', 'va-10-10ezr', 'va-26-1880', 'va-21-22a',
];
// Optional CLI arg filters to a single form id, e.g. `node verify-forms.mjs va-22-5490`.
const ONLY = process.argv[2];
const FORM_FILES = ALL_FORMS.filter(f => !ONLY || f === ONLY);

function genValue(field) {
  const id = (field.id || '').toLowerCase();
  const lbl = (field.label || '').toLowerCase();
  const t = field.type;
  const has = s => id.includes(s) || lbl.includes(s);
  let v;
  if (t === 'ssn' || has('ssn') || has('social security')) v = '123-45-6789';
  else if (t === 'date' || has('date') || has('dob') || has('birth')) v = '1985-07-04';
  else if (t === 'phone' || has('phone') || has('telephone')) v = '5125550100';
  else if (t === 'email' || has('email')) v = 'jonathan.public@example.com';
  else if (t === 'number') v = '12';
  else if (t === 'checkbox') return true;
  else if (t === 'select' || t === 'radio') return field.options?.[0]?.value ?? 'Yes';
  else if (t === 'signature') return 'data:image/png;base64,iVBORw0KGgo=';
  else if (t === 'document') return '';
  else if (has('year')) v = '2010';
  else if (has('zip')) v = '02118';
  else if (has('country')) v = 'US';
  else if (has('state')) v = 'MA';
  else if (has('apt') || has('unit') || has('apartment')) v = '4B';
  else if (has('routing')) v = '011000015';
  else if (has('account')) v = '000123456789';
  else if (has('middle') || /\bm\.?i\.?\b/.test(id) || /\bm\.?i\.?\b/.test(lbl)) v = 'Q'; // middle initial
  else if (has('first')) v = 'Jonathan';
  else if (has('last') || has('surname')) v = 'Public';
  else if (has('city')) v = 'Boston';
  else if (has('street') || has('address')) v = '123 Main Street';
  else if (has('vafile') || has('file number') || has('filenumber') || has('claim')) v = '12345678';
  else v = 'Sample';
  // Respect the question's own maxLength so we don't false-flag fields the app constrains.
  if (typeof v === 'string' && field.maxLength && v.length > field.maxLength) v = v.slice(0, field.maxLength);
  return v;
}

const pdfPathFor = def => path.join(ROOT, 'public/forms', (def.pdfTemplate || '').replace(/^\/?forms\//, '').replace(/^\//, ''));

let total = 0;
const summary = [];

for (const base of FORM_FILES) {
  const findings = [];
  let def, mapping;
  try {
    def = Object.values(await importTs(path.join(DEF_DIR, base + '.ts'))).find(v => v && v.steps && v.id);
    mapping = Object.values(await importTs(path.join(MAP_DIR, base + '.ts'))).find(v => v && typeof v === 'object' && !v.steps);
  } catch (e) {
    console.log(`\n### ${base}: FAILED TO LOAD — ${e.message}`);
    total++; summary.push([base, '!']); continue;
  }
  if (!def || !mapping) { console.log(`\n### ${base}: missing ${!def ? 'definition ' : ''}${!mapping ? 'mapping' : ''}`); total++; summary.push([base, '!']); continue; }

  const answers = {};
  for (const step of def.steps || []) for (const f of step.fields || []) { const v = genValue(f); if (v !== '') answers[f.id] = v; }
  let finalAnswers = { ...answers };
  if (typeof def.computeAnswers === 'function') {
    try { finalAnswers = { ...answers, ...def.computeAnswers(answers) }; }
    catch (e) { findings.push(`computeAnswers() THREW: ${e.message}`); }
  }

  let form, fieldNames;
  try {
    const pdf = await PDFDocument.load(readFileSync(pdfPathFor(def)), { ignoreEncryption: true });
    form = pdf.getForm();
    fieldNames = new Set(form.getFields().map(f => f.getName()));
  } catch (e) { console.log(`\n### ${base}: cannot open PDF — ${e.message}`); total++; summary.push([base, '!']); continue; }

  // Mirror fillPdf.ts: exact match, else the same endsWith fallback production uses.
  const allNames = [...fieldNames];
  const getField = name => {
    let resolved = fieldNames.has(name) ? name : allNames.find(n => n === name || n.endsWith('.' + name) || name.endsWith('.' + n));
    if (!resolved) return null;
    try { return form.getField(resolved); } catch { return null; }
  };

  const checkEntry = (wizardId, entry) => {
    if (!entry || !entry.type || ['draw-check', 'draw-text', 'image'].includes(entry.type)) return;
    const raw = finalAnswers[wizardId];
    if (raw === undefined || raw === '' || raw === null) {
      findings.push(`orphan key "${wizardId}" -> "${entry.pdfFieldName}": no value from any question/computeAnswers (always blank)`);
      return;
    }
    let value;
    try { value = entry.transform ? entry.transform(String(raw)) : String(raw); }
    catch (e) { findings.push(`transform threw for "${wizardId}": ${e.message}`); return; }
    if (value === '' || value == null) return; // legitimately empty after transform
    const field = getField(entry.pdfFieldName);
    if (!field) { findings.push(`MISSING field "${entry.pdfFieldName}" (key "${wizardId}")`); return; }
    if (entry.type === 'text') {
      if (!(field instanceof PDFTextField)) { findings.push(`TYPE MISMATCH "${entry.pdfFieldName}": mapped text, is ${field.constructor.name}`); return; }
      const max = field.getMaxLength();
      if (max != null && String(value).length > max) findings.push(`MAXLENGTH OVERFLOW (silent blank) "${entry.pdfFieldName}" (key "${wizardId}"): "${value}" len ${String(value).length} > max ${max}`);
    } else if (entry.type === 'radio') {
      if (!(field instanceof PDFRadioGroup)) { findings.push(`TYPE MISMATCH "${entry.pdfFieldName}": mapped radio, is ${field.constructor.name}`); return; }
      const opts = field.getOptions();
      if (!opts.includes(value)) findings.push(`INVALID RADIO OPTION (silent blank) "${entry.pdfFieldName}": "${value}" not in [${opts.join(' | ')}]`);
    } else if (entry.type === 'dropdown') {
      if (!(field instanceof PDFDropdown)) { findings.push(`TYPE MISMATCH "${entry.pdfFieldName}": mapped dropdown, is ${field.constructor.name}`); return; }
      const opts = field.getOptions();
      if (!opts.includes(value)) findings.push(`INVALID DROPDOWN OPTION (silent blank) "${entry.pdfFieldName}": "${value}" not in [${opts.join(' | ')}]`);
    } else if (entry.type === 'checkbox') {
      if (!(field instanceof PDFCheckBox)) findings.push(`TYPE MISMATCH "${entry.pdfFieldName}": mapped checkbox, is ${field.constructor.name}`);
    }
  };

  for (const [wizardId, m] of Object.entries(mapping)) {
    if (Array.isArray(m)) m.forEach(e => checkEntry(wizardId, e));
    else checkEntry(wizardId, m);
  }

  // ── Regression guard: a wizard field collected but never mapped prints BLANK ──
  // (Covers verify-forms' biggest blind spot — the class that caused 1990 items
  //  19/20 and most blank-item bugs. A field is "covered" if it's a mapping key
  //  OR it's read by computeAnswers, e.g. firstName feeding a derived fullName.)
  const mappingKeys = new Set(Object.keys(mapping));
  const computeSrc = typeof def.computeAnswers === 'function' ? def.computeAnswers.toString() : '';
  const readByCompute = id => {
    try { return new RegExp('\\b' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(computeSrc); }
    catch { return computeSrc.includes(id); }
  };
  for (const step of def.steps || []) {
    for (const f of step.fields || []) {
      if (!f.id || f.type === 'document') continue; // attachments aren't PDF fields
      if (mappingKeys.has(f.id) || readByCompute(f.id)) continue;
      findings.push(`UNMAPPED QUESTION (collected but not on PDF -> blank): "${f.id}"${f.label ? ' — ' + String(f.label).slice(0, 55) : ''}`);
    }
  }

  total += findings.length;
  summary.push([base, findings.length]);
  console.log(`\n### ${base}  (${findings.length} finding${findings.length === 1 ? '' : 's'})`);
  for (const f of findings) console.log('   - ' + f);
}

console.log('\n========== SUMMARY ==========');
for (const [b, n] of summary) console.log(`${(n === 0 ? 'OK' : String(n)).padStart(3)}  ${b}`);
console.log(`\nTotal findings: ${total}`);
rmSync(TMP, { recursive: true, force: true });
