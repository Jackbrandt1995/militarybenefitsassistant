import { PDFDocument, PDFCheckBox, PDFRadioGroup, PDFTextField, PDFDropdown } from 'pdf-lib';

export interface FieldMappingEntry {
  pdfFieldName: string;
  type: 'text' | 'checkbox' | 'radio' | 'dropdown';
  transform?: (value: string) => string;
}

// One wizard field can map to one PDF field or multiple (e.g., SSN → 3 boxes)
export interface FieldMapping {
  [wizardFieldId: string]: FieldMappingEntry | FieldMappingEntry[];
}

function fillOneField(
  form: ReturnType<PDFDocument['getForm']>,
  fieldNames: string[],
  entry: FieldMappingEntry,
  rawValue: string | boolean,
) {
  if (!fieldNames.includes(entry.pdfFieldName)) {
    console.warn(`PDF field not found: ${entry.pdfFieldName}`);
    return;
  }

  try {
    const value = entry.transform
      ? entry.transform(String(rawValue))
      : String(rawValue);

    switch (entry.type) {
      case 'text': {
        const textField = form.getField(entry.pdfFieldName);
        if (textField instanceof PDFTextField) {
          textField.setText(value);
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

  const fields = form.getFields();
  const fieldNames = fields.map(f => f.getName());

  for (const [wizardId, mapping] of Object.entries(fieldMapping)) {
    const rawValue = answers[wizardId];
    if (rawValue === undefined || rawValue === null || rawValue === '') continue;

    if (Array.isArray(mapping)) {
      for (const entry of mapping) {
        fillOneField(form, fieldNames, entry, rawValue);
      }
    } else {
      fillOneField(form, fieldNames, mapping, rawValue);
    }
  }

  return pdfDoc.save();
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
