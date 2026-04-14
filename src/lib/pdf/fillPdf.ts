import { PDFDocument, PDFCheckBox, PDFRadioGroup, PDFTextField, PDFDropdown } from 'pdf-lib';

export interface FieldMapping {
  [wizardFieldId: string]: {
    pdfFieldName: string;
    type: 'text' | 'checkbox' | 'radio' | 'dropdown';
    transform?: (value: string) => string;
  };
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

    if (!fieldNames.includes(mapping.pdfFieldName)) {
      console.warn(`PDF field not found: ${mapping.pdfFieldName} (wizard: ${wizardId})`);
      continue;
    }

    try {
      const value = mapping.transform
        ? mapping.transform(String(rawValue))
        : String(rawValue);

      switch (mapping.type) {
        case 'text': {
          const textField = form.getField(mapping.pdfFieldName);
          if (textField instanceof PDFTextField) {
            textField.setText(value);
          }
          break;
        }
        case 'checkbox': {
          const checkField = form.getField(mapping.pdfFieldName);
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
          const radioField = form.getField(mapping.pdfFieldName);
          if (radioField instanceof PDFRadioGroup) {
            radioField.select(value);
          }
          break;
        }
        case 'dropdown': {
          const dropField = form.getField(mapping.pdfFieldName);
          if (dropField instanceof PDFDropdown) {
            dropField.select(value);
          }
          break;
        }
      }
    } catch (err) {
      console.warn(`Error filling field ${mapping.pdfFieldName}:`, err);
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
