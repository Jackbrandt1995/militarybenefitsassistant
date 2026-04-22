import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

// VA 22-1999c has no fillable PDF fields.
// This form uses text overlay at fixed coordinates instead.
// The mapping is empty but exists for type consistency.
export const va221999cMapping: FieldMapping = {
  // Signature image overlay + draw-text date fallback
  signaturePad: [
    { pdfFieldName: 'SIGNATURE_IMAGE_OVERLAY', type: 'image', imagePage: 0, imageX: 36, imageY: 80, imageWidth: 230, imageHeight: 50 },
  ],
  signatureDate: [
    { pdfFieldName: 'DRAW_TEXT_DATE', type: 'draw-text', transform: formatDateString, textPage: 0, textX: 370, textY: 88, textSize: 10 },
  ],
};
