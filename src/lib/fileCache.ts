/**
 * Module-level file cache for form attachments.
 *
 * Files selected in the wizard's "Attach Documents" step need to survive
 * client-side navigation (wizard → review → complete). Because File objects
 * can't be serialised into localStorage/sessionStorage without lossy base64
 * encoding, we keep them in a module-level variable instead.
 *
 * This works reliably for Next.js client-side navigation (router.push) where
 * the JS module stays loaded. The cache is cleared by complete/page.tsx after
 * the files have been merged into the PDF.
 */

let pendingFiles: File[] = [];

/** Store files selected in the wizard for use on the complete page. */
export function cacheFormFiles(files: File[]): void {
  pendingFiles = [...files];
}

/** Retrieve previously cached files (call on complete page). */
export function getFormFiles(): File[] {
  return pendingFiles;
}

/** Clear the cache after files have been consumed. */
export function clearFormFiles(): void {
  pendingFiles = [];
}
