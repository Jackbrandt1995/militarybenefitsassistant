/**
 * VA 22-1999c (JUN 2005) — Certificate of Affirmation of Enrollment Agreement
 *
 * This PDF has ZERO AcroForm fields. The page content is a scanned-style Form
 * XObject drawn under a `0.072 0 0 -0.072 0 792 cm` transform, so nothing can be
 * "filled" — every value is a draw-text / image overlay placed at the real page
 * coordinates (verified against the XObject grid lines + label baselines).
 *
 * The form is three carbon copies, each on its own page (the even pages); the odd
 * pages are Privacy Act backs:
 *   page 0 = Fm01  VA COPY 1
 *   page 2 = Fm03  SCHOOL COPY 2
 *   page 4 = Fm05  STUDENT COPY 3
 * All three copies share an identical layout (item-1 label sits at page x=30.2
 * y=700.6 on each), so the SAME overlay X/Y apply within each copy's page —
 * hence every overlay is duplicated for pages 0, 2, and 4.
 *
 * Cell bands (page coords, 612x792, bottom-left origin), from the XObject grid:
 *   Items 1 & 2 row : top line y=708, bottom line y=672; divider x=403.2
 *     Item 1 FIRST-MIDDLE-LAST NAME   x 28.8..403.2   label baseline y=700.6
 *     Item 2 VA FILE NO.              x 403.2..582.9  label baseline y=700.6
 *   Items 3,4,5 row : top line y=672, bottom line y=624; dividers x=165.6, x=266.4
 *     Item 3 NAME OF COURSE           x 28.8..165.6   label baseline y=664.6
 *     Item 4 DATE ENROLLMENT SIGNED   x 165.6..266.4  label baselines y=664.6/657.4
 *     Item 5 NAME AND ADDRESS SCHOOL  x 266.4..582.9  label baseline y=664.6
 *   Items 6 & 7 row : top line y=84, bottom line y=36; divider x=165.6
 *     Item 6 DATE SIGNED              x 28.8..165.6   label baseline y=76.7
 *     Item 7 SIGNATURE               x 165.6..583.2  label baseline y=76.7
 *
 * draw-text textY is the text BASELINE; values entered just below each label.
 */

import type { FieldMapping } from '../fillPdf';
import { formatDateString } from '../fillPdf';

const mi = (v: string) => (v ? v.charAt(0).toUpperCase() : '');

// The three copy pages share one layout, so overlays repeat per page.
const COPY_PAGES = [0, 2, 4];

// Helpers to fan a single overlay spec out across the three copy pages.
const drawTextOnCopies = (
  base: { textX: number; textY: number; textSize?: number; transform?: (v: string) => string },
): FieldMapping[string] =>
  COPY_PAGES.map((p) => ({
    pdfFieldName: `DRAW_TEXT_p${p}`,
    type: 'draw-text' as const,
    textPage: p,
    textX: base.textX,
    textY: base.textY,
    textSize: base.textSize ?? 10,
    ...(base.transform ? { transform: base.transform } : {}),
  }));

const drawImageOnCopies = (
  base: { imageX: number; imageY: number; imageWidth: number; imageHeight: number },
): FieldMapping[string] =>
  COPY_PAGES.map((p) => ({
    pdfFieldName: `SIGNATURE_IMAGE_p${p}`,
    type: 'image' as const,
    imagePage: p,
    imageX: base.imageX,
    imageY: base.imageY,
    imageWidth: base.imageWidth,
    imageHeight: base.imageHeight,
  }));

export const va221999cMapping: FieldMapping = {
  // ── Item 1: FIRST NAME — MIDDLE INITIAL — LAST NAME (band x 28.8..403.2) ──
  // Three staggered draw-text entries across the wide name cell, on every copy.
  firstName: drawTextOnCopies({ textX: 36, textY: 688, textSize: 10 }),
  middleName: drawTextOnCopies({ textX: 175, textY: 688, textSize: 10, transform: mi }),
  lastName: drawTextOnCopies({ textX: 210, textY: 688, textSize: 10 }),

  // ── Item 2: VA FILE NO. (band x 403.2..582.9) ──
  vaFileNumber: drawTextOnCopies({ textX: 410, textY: 688, textSize: 10 }),

  // ── Item 3: NAME OF COURSE (band x 28.8..165.6) ──
  courseName: drawTextOnCopies({ textX: 36, textY: 650, textSize: 9 }),

  // ── Item 4: DATE ENROLLMENT AGREEMENT SIGNED (band x 165.6..266.4) ──
  enrollmentDate: drawTextOnCopies({ textX: 170, textY: 650, textSize: 9, transform: formatDateString }),

  // ── Item 5: NAME AND ADDRESS OF SCHOOL (band x 266.4..582.9) ──
  // textarea value; pdf-lib drawText renders embedded newlines downward from textY.
  schoolNameAddress: drawTextOnCopies({ textX: 272, textY: 650, textSize: 9 }),

  // ── Item 7: SIGNATURE (band x 165.6..583.2, y 36..84) ──
  signaturePad: drawImageOnCopies({ imageX: 175, imageY: 40, imageWidth: 330, imageHeight: 28 }),

  // ── Item 6: DATE SIGNED (band x 28.8..165.6, y 36..84) ──
  signatureDate: drawTextOnCopies({ textX: 40, textY: 58, textSize: 10, transform: formatDateString }),
};
