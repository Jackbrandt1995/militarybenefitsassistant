import { PDFDocument, PDFCheckBox, PDFRadioGroup, PDFTextField, PDFDropdown, StandardFonts, rgb } from 'pdf-lib';

export interface FieldMappingEntry {
  pdfFieldName: string;
  type: 'text' | 'checkbox' | 'radio' | 'dropdown' | 'image' | 'draw-check';
  transform?: (value: string) => string;
  // For 'image' type — draw the value (data URL) as an image overlay on the PDF
  imagePage?: number; // 0-indexed page number
  imageX?: number;
  imageY?: number;
  imageWidth?: number;
  imageHeight?: number;
  // For 'draw-check' type — draw a filled rectangle at precise coordinates (XFA form workaround)
  checkPage?: number; // 0-indexed page number
  checkCX?: number;   // center x coordinate (PDF points)
  checkCY?: number;   // center y coordinate (PDF points)
  checkSize?: number; // side length of the filled square (default 6)
}

// One wizard field can map to one PDF field or multiple (e.g., SSN → 3 boxes)
export interface FieldMapping {
  [wizardFieldId: string]: FieldMappingEntry | FieldMappingEntry[];
}

async function fillOneField(
  form: ReturnType<PDFDocument['getForm']>,
  pdfDoc: PDFDocument,
  fieldNames: string[],
  entry: FieldMappingEntry,
  rawValue: string | boolean,
) {
  try {
    const value = entry.transform
      ? entry.transform(String(rawValue))
      : String(rawValue);

    // Draw-check type: draw a filled square at precise page coordinates (XFA checkbox workaround)
    if (entry.type === 'draw-check') {
      if (value !== 'true' && rawValue !== true) return;
      const pages = pdfDoc.getPages();
      const pageIndex = entry.checkPage ?? 0;
      if (pageIndex >= pages.length) return;
      const page = pages[pageIndex];
      const size = entry.checkSize ?? 6;
      const cx = entry.checkCX ?? 0;
      const cy = entry.checkCY ?? 0;
      page.drawRectangle({
        x: cx - size / 2,
        y: cy - size / 2,
        width: size,
        height: size,
        color: rgb(0, 0, 0),
      });
      return;
    }

    // Image type: embed the data URL as a PNG overlay (used for signatures)
    if (entry.type === 'image') {
      const dataUrl = String(rawValue);
      if (!dataUrl.startsWith('data:image/')) return;
      const base64 = dataUrl.split(',')[1];
      if (!base64) return;
      const imageBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const image = await pdfDoc.embedPng(imageBytes);
      const pageIndex = entry.imagePage ?? 0;
      const pages = pdfDoc.getPages();
      if (pageIndex < pages.length) {
        pages[pageIndex].drawImage(image, {
          x: entry.imageX ?? 36,
          y: entry.imageY ?? 25,
          width: entry.imageWidth ?? 200,
          height: entry.imageHeight ?? 40,
        });
      }
      return;
    }

    // Try exact match first; if not found, fall through to try/catch below.
    // We intentionally let form.getField() throw rather than silently skip —
    // the outer try/catch logs a warning so we can diagnose mismatches.
    if (!fieldNames.includes(entry.pdfFieldName)) {
      // Attempt a partial-name fallback (useful if pdf-lib returns leaf names only)
      const fallback = fieldNames.find(n => n === entry.pdfFieldName || n.endsWith(`.${entry.pdfFieldName}`) || entry.pdfFieldName.endsWith(`.${n}`));
      if (!fallback) {
        console.warn(`[fillPdf] field not found: "${entry.pdfFieldName}"`);
        return;
      }
      console.warn(`[fillPdf] using fallback name "${fallback}" for "${entry.pdfFieldName}"`);
    }

    switch (entry.type) {
      case 'text': {
        const textField = form.getField(entry.pdfFieldName);
        if (textField instanceof PDFTextField) {
          textField.setText(value || '');
        } else {
          console.warn(`[fillPdf] "${entry.pdfFieldName}" is not a PDFTextField (got ${textField?.constructor?.name})`);
        }
        break;
      }
      case 'checkbox': {
        const checkField = form.getField(entry.pdfFieldName);
        if (checkField instanceof PDFCheckBox) {
          if (rawValue === true || value === 'true' || value === 'Yes') {
            checkField.check();
          } else {
            checkField.uncheck();
          }
        }
        break;
      }
      case 'radio': {
        const radioField = form.getField(entry.pdfFieldName);
        if (radioField instanceof PDFRadioGroup) {
          radioField.select(value);
        }
        break;
      }
      case 'dropdown': {
        const dropField = form.getField(entry.pdfFieldName);
        if (dropField instanceof PDFDropdown) {
          dropField.select(value);
        }
        break;
      }
    }
  } catch (err) {
    console.warn(`Error filling field ${entry.pdfFieldName}:`, err);
  }
}

export async function fillPdf(
  templatePath: string,
  answers: Record<string, string | boolean>,
  fieldMapping: FieldMapping
): Promise<Uint8Array> {
  const response = await fetch(templatePath);
  const templateBytes = await response.arrayBuffer();

  const pdfDoc = await PDFDocument.load(templateBytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();

  // Embed Helvetica so pdf-lib can regenerate appearance streams after filling,
  // including Comb fields (Ff bit 25) like routing/account numbers.
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const fields = form.getFields();
  const fieldNames = fields.map(f => f.getName());

  // Debug: log field lookup results for banking fields
  const bankFields = ['routingno1', 'accountno1'];
  bankFields.forEach(partial => {
    const match = fieldNames.find(n => n.includes(partial));
    console.log(`[fillPdf] "${partial}" -> ${match ?? 'NOT FOUND'}`);
  });

  for (const [wizardId, mapping] of Object.entries(fieldMapping)) {
    const rawValue = answers[wizardId];
    if (rawValue === undefined || rawValue === null || rawValue === '') continue;
    if (!mapping) continue;

    if (Array.isArray(mapping)) {
      for (const entry of mapping) {
        await fillOneField(form, pdfDoc, fieldNames, entry, rawValue);
      }
    } else {
      await fillOneField(form, pdfDoc, fieldNames, mapping, rawValue);
    }
  }

  // Regenerate all field appearances with embedded Helvetica.
  // This is critical for Comb text fields (routing/account numbers) which have no
  // pre-existing AP stream — without this call their text won't render visually.
  try {
    form.updateFieldAppearances(helvetica);
  } catch (err) {
    console.warn('[fillPdf] updateFieldAppearances failed (non-fatal):', err);
  }

  return pdfDoc.save();
}

/**
 * Merge one or more File objects (PDFs only) as additional pages appended to
 * the base PDF. Non-PDF files are silently skipped. Returns updated bytes.
 */
export async function mergePdfsWithAttachments(
  basePdfBytes: Uint8Array,
  attachments: File[],
): Promise<Uint8Array> {
  const pdfAttachments = attachments.filter(f => f.type === 'application/pdf');
  if (pdfAttachments.length === 0) return basePdfBytes;

  const mergedDoc = await PDFDocument.load(basePdfBytes, { ignoreEncryption: true });

  for (const file of pdfAttachments) {
    try {
      const bytes = await file.arrayBuffer();
      const attachDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const indices = attachDoc.getPageIndices();
      const copiedPages = await mergedDoc.copyPages(attachDoc, indices);
      for (const page of copiedPages) {
        mergedDoc.addPage(page);
      }
    } catch (err) {
      console.warn(`Could not merge attachment "${file.name}":`, err);
    }
  }

  return mergedDoc.save();
}

export function downloadPdf(pdfBytes: Uint8Array, filename: string) {
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatDateForPdf(dateStr: string): { month: string; day: string; year: string } {
  if (!dateStr) return { month: '', day: '', year: '' };
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return { month: parts[1], day: parts[2], year: parts[0] };
  }
  return { month: '', day: '', year: '' };
}

export function formatSSNParts(ssn: string): { first3: string; middle2: string; last4: string } {
  const digits = ssn.replace(/\D/g, '');
  return {
    first3: digits.substring(0, 3),
    middle2: digits.substring(3, 5),
    last4: digits.substring(5, 9),
  };
}

export function formatPhoneParts(phone: string): { areaCode: string; first3: string; last4: string } {
  const digits = phone.replace(/\D/g, '');
  return {
    areaCode: digits.substring(0, 3),
    first3: digits.substring(3, 6),
    last4: digits.substring(6, 10),
  };
}

export function formatDateString(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  }
  return '';
}
