import type { FieldMapping } from '../fillPdf';
import { va221990Mapping } from './va-22-1990';
import { va221990eMapping } from './va-22-1990e';
import { va221990tMapping } from './va-22-1990t';
import { va221995Mapping } from './va-22-1995';
import { va220803Mapping } from './va-22-0803';
import { va220810Mapping } from './va-22-0810';
import { va225281Mapping } from './va-22-5281';
import { va225490Mapping } from './va-22-5490';
import { va225495Mapping } from './va-22-5495';
import { va228691Mapping } from './va-22-8691';
import { va281900Mapping } from './va-28-1900';
import { va221999cMapping } from './va-22-1999c';

const mappings: Record<string, FieldMapping> = {
  'va-22-1990': va221990Mapping,
  'va-22-1990e': va221990eMapping,
  'va-22-1990t': va221990tMapping,
  'va-22-1995': va221995Mapping,
  'va-22-0803': va220803Mapping,
  'va-22-0810': va220810Mapping,
  'va-22-5281': va225281Mapping,
  'va-22-5490': va225490Mapping,
  'va-22-5495': va225495Mapping,
  'va-22-8691': va228691Mapping,
  'va-28-1900': va281900Mapping,
  'va-22-1999c': va221999cMapping,
};

export function getFieldMapping(formId: string): FieldMapping | undefined {
  return mappings[formId];
}
