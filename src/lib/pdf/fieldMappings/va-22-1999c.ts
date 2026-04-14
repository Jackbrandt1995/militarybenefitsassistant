import type { FieldMapping } from '../fillPdf';

// VA 22-1999c has no fillable PDF fields.
// This form uses text overlay at fixed coordinates instead.
// The mapping is empty but exists for type consistency.
export const va221999cMapping: FieldMapping = {};
