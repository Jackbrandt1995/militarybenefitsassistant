'use client';

import { useMemo } from 'react';
import type { FormDefinition, FieldDef } from '@/lib/forms/types';
import type { UserProfile } from '@/types/profile';

function resolveProfilePath(profile: UserProfile, path: string): string | boolean | null {
  if (!path || !profile) return null;

  const parts = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = profile;

  for (const part of parts) {
    if (current === null || current === undefined) return null;

    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, key, indexStr] = arrayMatch;
      const arr = current[key];
      if (!Array.isArray(arr)) return null;
      const index = parseInt(indexStr, 10);
      if (index >= arr.length) return null;
      current = arr[index];
    } else {
      current = current[part];
    }
  }

  if (current === null || current === undefined) return null;
  if (typeof current === 'boolean') return current;
  return String(current);
}

function getAllFields(form: FormDefinition): FieldDef[] {
  return form.steps.flatMap(step => step.fields);
}

interface AutoFillResult {
  preFilledAnswers: Record<string, string | boolean>;
  filledCount: number;
  totalCount: number;
  percentage: number;
  isStepFullyFilled: (stepId: string) => boolean;
  missingFields: FieldDef[];
}

export function useAutoFill(
  form: FormDefinition | undefined,
  profile: UserProfile | null
): AutoFillResult {
  return useMemo(() => {
    if (!form || !profile) {
      return {
        preFilledAnswers: {},
        filledCount: 0,
        totalCount: 0,
        percentage: 0,
        isStepFullyFilled: () => false,
        missingFields: [],
      };
    }

    const allFields = getAllFields(form);
    const preFilledAnswers: Record<string, string | boolean> = {};
    const missingFields: FieldDef[] = [];
    let filledCount = 0;

    for (const field of allFields) {
      if (field.profilePath) {
        const value = resolveProfilePath(profile, field.profilePath);
        if (value !== null && value !== '') {
          preFilledAnswers[field.id] = value;
          filledCount++;
          continue;
        }
      }
      if (field.required) {
        missingFields.push(field);
      }
    }

    const totalCount = allFields.filter(f => f.profilePath).length;
    const percentage = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;

    const isStepFullyFilled = (stepId: string): boolean => {
      const step = form.steps.find(s => s.id === stepId);
      if (!step) return false;
      return step.fields
        .filter(f => f.profilePath && f.required)
        .every(f => preFilledAnswers[f.id] !== undefined);
    };

    return {
      preFilledAnswers,
      filledCount,
      totalCount,
      percentage,
      isStepFullyFilled,
      missingFields,
    };
  }, [form, profile]);
}
