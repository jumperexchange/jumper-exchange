import envConfig from '@/config/env-config';
import type { ExtensionDefinition } from './types';
import { withTimeout } from './withTimeout';

/**
 * Runs detectors in parallel and resolves as soon as any reports `true`.
 * When all have reported `false`, resolves `false` without waiting for slower
 * detectors that already missed the early-exit window.
 */
export const runDetectors = async (
  definition: ExtensionDefinition,
): Promise<boolean> => {
  if (definition.detectors.length === 0) {
    return false;
  }

  return new Promise<boolean>((resolve) => {
    let remaining = definition.detectors.length;
    let settled = false;

    const settle = (result: boolean, index: number) => {
      if (envConfig.NODE_ENV === 'development') {
        console.log(
          `Result for definition ${definition.detectors[index].strategy}`,
          result,
        );
      }
      if (settled) {
        return;
      }
      if (result) {
        settled = true;
        resolve(true);
        return;
      }
      remaining -= 1;
      if (remaining === 0) {
        settled = true;
        resolve(false);
      }
    };

    definition.detectors.forEach((d, index) => {
      const detectPromise = Promise.resolve().then(() => d.detect());
      withTimeout(detectPromise, d.timeout ?? 2000, false)
        .catch(() => false)
        .then((result) => settle(result, index));
    });
  });
};
