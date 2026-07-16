import { getCanvasBackgroundRegistration } from '@/components/CanvasBackground/canvasBackgroundRegistry';
import type {
  ResolvedCanvasBackgroundConfig,
  StrapiCanvasBackgroundConfig,
} from '@/components/CanvasBackground/types';

const deepMerge = (
  base: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> => {
  const result = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    const existing = result[key];
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      existing &&
      typeof existing === 'object' &&
      !Array.isArray(existing)
    ) {
      result[key] = deepMerge(
        existing as Record<string, unknown>,
        value as Record<string, unknown>,
      );
      continue;
    }

    result[key] = value;
  }

  return result;
};

export const resolveCanvasBackgroundConfig = (
  raw: StrapiCanvasBackgroundConfig | undefined | null,
  backgroundColor: string | null,
): ResolvedCanvasBackgroundConfig | null => {
  if (!raw?.id) {
    return null;
  }

  const registration = getCanvasBackgroundRegistration(raw.id);
  if (!registration) {
    return null;
  }

  const merged = deepMerge(registration.defaultOptions, raw.options ?? {});

  if (!('bg' in (raw.options ?? {})) && backgroundColor) {
    merged.bg = backgroundColor;
  }

  const parsed = registration.optionsSchema.safeParse(merged);
  if (!parsed.success) {
    return null;
  }

  return {
    id: raw.id,
    options: parsed.data as Record<string, unknown>,
  };
};
