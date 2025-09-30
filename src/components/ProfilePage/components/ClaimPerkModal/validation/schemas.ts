import { z } from 'zod';
import { sanitizeAddress } from 'src/utils/image-generation/sanitizeParams';
import { isValidAddress } from 'src/utils/regex-patterns';
import { AvailableSteps } from '../ClaimPerkModal.types';

export const createStepSchema = (step: AvailableSteps) => {
  switch (step) {
    case AvailableSteps.Username:
      return z
        .string()
        .transform((val) => (val ? val.trim().replace('@', '') : ''))
        .refine((val) => val.length > 0, 'Username must not be empty');

    case AvailableSteps.Wallet:
      return z
        .string()
        .transform((val) => (val ? sanitizeAddress(val) : ''))
        .refine((val) => isValidAddress(val), 'Invalid wallet address');

    default:
      return z.string();
  }
};

export const buildFormSchema = (steps: AvailableSteps[]) => {
  const stepSchemas = steps.reduce(
    (acc, step) => {
      acc[step] = createStepSchema(step);
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>,
  );

  return z.object(stepSchemas);
};
