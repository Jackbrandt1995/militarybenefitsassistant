/**
 * PDF field extraction script
 * Usage: node scripts/extract-fields.mjs <pdf-path> [fieldNameFilter]
 *
 * Lists every AcroForm field with its page, rect, and (for radio/checkbox) option values.
 */
import { readFileSync } from 'fs';
import { PDFDocument } from 'pdf-lib';

const [,, pdfPath, filter] = process.argv;
if (!pdfPath) { console.error('Usage: node scripts/extract-fields.mjs <pdf-path> [filter]'); process.exit(1); }

const bytes = readFileSync(pdfPath);
const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
const form = pdfDoc.getForm();
const pages = pdfDoc.getPages();

const fields = form.getFields();
console.log(`\n=== ${pdfPath} — ${fields.length} AcroForm fields ===\n`);

for (const field of fields) {
  const name = field.getName();
  if (filter && !name.toLowerCase().includes(filter.toLowerCase())) continue;

  const type = field.constructor.name;
  const widgets = field.acroField.getWidgets();

  let optionsStr = '';
  try {
    if (type === 'PDFRadioGroup') {
      optionsStr = ` options=${JSON.stringify(field.getOptions())}`;
    } else if (type === 'PDFDropdown') {
      optionsStr = ` options=${JSON.stringify(field.getOptions())}`;
    }
  } catch {}

  if (widgets.length === 0) {
    console.log(`  [${type}] "${name}"${optionsStr}  (no widgets)`);
    continue;
  }

  console.log(`  [${type}] "${name}"${optionsStr}`);
  for (let i = 0; i < widgets.length; i++) {
    const w = widgets[i];
    const rect = w.getRectangle();
    const pageRef = w.P();
    let pageIdx = -1;
    if (pageRef) {
      pageIdx = pages.findIndex(p => p.ref === pageRef);
    }
    const cx = Math.round((rect.x + rect.width / 2) * 10) / 10;
    const cy = Math.round((rect.y + rect.height / 2) * 10) / 10;
    const w2 = Math.round(rect.width * 10) / 10;
    const h2 = Math.round(rect.height * 10) / 10;

    // For radio groups, get the on-value for this widget
    let onVal = '';
    try {
      const ap = w.getAppearances();
      if (ap) {
        const keys = Object.keys(ap.normal ?? {}).filter(k => k !== 'Off');
        if (keys.length) onVal = ` on="${keys[0]}"`;
      }
    } catch {}

    console.log(`    w${i}: p=${pageIdx} cx=${cx} cy=${cy} w=${w2} h=${h2}${onVal}  rect=(${Math.round(rect.x*10)/10}, ${Math.round(rect.y*10)/10})`);
  }
}
console.log('\nDone.\n');
