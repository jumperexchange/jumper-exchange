import { z } from 'zod';
import { sanitizeAddress } from 'src/utils/image-generation/sanitizeParams';
import { isValidAddress } from 'src/utils/regex-patterns';
import { AvailableSteps } from '../ClaimPerkModal.types';

export const createStepSchema = (step: AvailableSteps) => {
  switch (step) {
    case AvailableSteps.Username:
      return z
        .string()
        .transform((val) => val.trim().replace(/^@/, ''))
        .refine((val) => val.length > 0, 'Username must not be empty')
        .refine(
          (val) => val.length <= 80,
          'Username must not exceed 80 characters',
        )
        .refine(
          (val) => /^[a-zA-Z0-9_.]+$/.test(val),
          'This does not look like a username',
        );

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
