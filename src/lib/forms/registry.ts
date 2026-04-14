import type { FormDefinition, FormCategory } from './types';
import { va221990 } from './definitions/va-22-1990';
import { va221990e } from './definitions/va-22-1990e';
import { va221990t } from './definitions/va-22-1990t';
import { va221995 } from './definitions/va-22-1995';
import { va220803 } from './definitions/va-22-0803';
import { va220810 } from './definitions/va-22-0810';
import { va225281 } from './definitions/va-22-5281';
import { va225490 } from './definitions/va-22-5490';
import { va225495 } from './definitions/va-22-5495';
import { va228691 } from './definitions/va-22-8691';
import { va281900 } from './definitions/va-28-1900';
import { va221999c } from './definitions/va-22-1999c';

const forms: FormDefinition[] = [
  va221990,
  va221990e,
  va221990t,
  va221995,
  va220803,
  va220810,
  va225281,
  va225490,
  va225495,
  va228691,
  va281900,
  va221999c,
];

const formMap = new Map<string, FormDefinition>(
  forms.map((f) => [f.id, f])
);

export function getAllForms(): FormDefinition[] {
  return forms;
}

export function getFormById(id: string): FormDefinition | undefined {
  return formMap.get(id);
}

export function getFormsByCategory(category: FormCategory): FormDefinition[] {
  return forms.filter((f) => f.category === category);
}
