// Dev-only: fill a form with sample data (incl. a solid-black signature bar so
// placement is visible) and write a filled PDF. Usage: node _fill-sample.mjs <id>
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import ts from 'typescript';
import { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup, PDFDropdown, StandardFonts, rgb } from 'pdf-lib';

const SCRIPTS = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPTS, '..');
const TMP = path.join(SCRIPTS, '.fill-tmp');
rmSync(TMP, { recursive: true, force: true }); mkdirSync(TMP, { recursive: true });

const EXTS = ['.ts', '.tsx', '.js', '.mjs']; const compiled = new Map(); let counter = 0;
function resolveSpec(spec, fromAbs) {
  let b; if (spec.startsWith('@/')) b = path.join(ROOT, 'src', spec.slice(2));
  else if (spec.startsWith('./') || spec.startsWith('../')) b = path.resolve(path.dirname(fromAbs), spec); else return null;
  for (const e of EXTS) if (existsSync(b + e)) return b + e;
  for (const e of EXTS) if (existsSync(path.join(b, 'index' + e))) return path.join(b, 'index' + e);
  return existsSync(b) ? b : null;
}
function compile(abs) {
  if (compiled.has(abs)) return compiled.get(abs); const out = `m${counter++}.mjs`; compiled.set(abs, out);
  let js = ts.transpileModule(readFileSync(abs, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  js = js.replace(/from\s+(['"])([^'"]+)\1/g, (m, q, s) => { const d = resolveSpec(s, abs); return d ? `from ${q}./${compile(d)}${q}` : m; });
  writeFileSync(path.join(TMP, out), js, 'utf8'); return out;
}
const importTs = abs => import(pathToFileURL(path.join(TMP, compile(abs))).href);

const id = process.argv[2];
const def = Object.values(await importTs(path.join(ROOT, 'src/lib/forms/definitions', id + '.ts'))).find(v => v && v.steps && v.id);
const mapping = Object.values(await importTs(path.join(ROOT, 'src/lib/pdf/fieldMappings', id + '.ts'))).find(v => v && typeof v === 'object' && !v.steps);

const SIG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
function gen(f) {
  const t = f.type, i = (f.id || '').toLowerCase(), l = (f.label || '').toLowerCase(), has = s => i.includes(s) || l.includes(s);
  if (t === 'signature') return SIG;
  if (t === 'ssn') return '123-45-6789';
  if (t === 'date' || has('date') || has('dob') || has('birth')) return '1985-07-04';
  if (t === 'phone') return '5125550100';
  if (t === 'email') return 'jane.public@example.com';
  if (t === 'number') return '12';
  if (t === 'checkbox') return true;
  if (t === 'select' || t === 'radio') return f.options?.[0]?.value ?? 'Yes';
  if (t === 'document') return '';
  if (has('year')) return '2010'; if (has('zip')) return '02118'; if (has('country')) return 'US'; if (has('state')) return 'MA';
  if (has('middle') || /\bm\.?i\.?\b/.test(i)) return 'Q';
  if (has('first')) return 'Jonathan'; if (has('last') || has('surname')) return 'Public'; if (has('city')) return 'Boston';
  if (has('street') || has('address')) return '123 Main Street'; if (has('routing')) return '011000015'; if (has('account')) return '000123456789';
  if (has('course')) return 'B.S. Computer Science'; if (has('school')) return 'State University, Columbus OH';
  if (has('name')) return 'Jonathan'; return 'Sample';
}
const answers = {}; for (const s of def.steps || []) for (const f of s.fields || []) { const v = gen(f); if (v !== '') answers[f.id] = v; }
let fin = { ...answers }; if (typeof def.computeAnswers === 'function') { try { fin = { ...answers, ...def.computeAnswers(answers) }; } catch (e) { console.error('computeAnswers threw', e.message); } }
if (process.env.FILL_OVERRIDE) { try { Object.assign(fin, JSON.parse(process.env.FILL_OVERRIDE)); } catch (e) { console.error('FILL_OVERRIDE parse fail', e.message); } }

const pdfPath = path.join(ROOT, 'public/forms', (def.pdfTemplate || '').replace(/^\/?forms\//, '').replace(/^\//, ''));
const pdf = await PDFDocument.load(readFileSync(pdfPath), { ignoreEncryption: true });
const form = pdf.getForm(); const helv = await pdf.embedFont(StandardFonts.Helvetica);
const names = new Set(form.getFields().map(f => f.getName())); const all = [...names];
const resolve = n => names.has(n) ? n : all.find(x => x === n || x.endsWith('.' + n) || n.endsWith('.' + x));
const pages = pdf.getPages();
async function fill(wid, e) {
  if (!e || !e.type) return; const raw = fin[wid]; if (raw === undefined || raw === '' || raw === null) return;
  let val; try { val = e.transform ? e.transform(String(raw)) : String(raw); } catch { return; }
  if (e.type === 'draw-check') { if (val !== 'true' && raw !== true) return; const p = pages[e.checkPage ?? 0]; if (!p) return; const s = e.checkSize ?? 6; p.drawRectangle({ x: (e.checkCX ?? 0) - s / 2, y: (e.checkCY ?? 0) - s / 2, width: s, height: s, color: rgb(0, 0, 0) }); return; }
  if (e.type === 'draw-text') { if (!val) return; const p = pages[e.textPage ?? 0]; if (!p) return; p.drawText(val, { x: e.textX ?? 0, y: e.textY ?? 0, size: e.textSize ?? 10, font: helv, color: rgb(0, 0, 0) }); return; }
  if (e.type === 'image') { const du = String(raw); if (!du.startsWith('data:image/')) return; const bytes = Uint8Array.from(atob(du.split(',')[1]), c => c.charCodeAt(0)); const img = await pdf.embedPng(bytes); const p = pages[e.imagePage ?? 0]; if (!p) return; p.drawImage(img, { x: e.imageX ?? 36, y: e.imageY ?? 80, width: e.imageWidth ?? 230, height: e.imageHeight ?? 50 }); return; }
  if (val === '') return; const rn = resolve(e.pdfFieldName); if (!rn) return; const fld = form.getField(rn);
  try { if (e.type === 'text' && fld instanceof PDFTextField) fld.setText(val || ''); else if (e.type === 'checkbox' && fld instanceof PDFCheckBox) { (raw === true || val === 'true' || val === 'Yes') ? fld.check() : fld.uncheck(); } else if (e.type === 'radio' && fld instanceof PDFRadioGroup) fld.select(val); else if (e.type === 'dropdown' && fld instanceof PDFDropdown) fld.select(val); } catch (err) { console.error('fill err', e.pdfFieldName, err.message); }
}
for (const [wid, m] of Object.entries(mapping)) { if (Array.isArray(m)) for (const e of m) await fill(wid, e); else await fill(wid, m); }
try { form.updateFieldAppearances(helv); } catch {}
const out = path.join(TMP, id + '-filled.pdf'); writeFileSync(out, await pdf.save());
console.log(out);
