import type { ExtensionDetector } from '../types';

export const globalVariableDetector = (path: string): ExtensionDetector => ({
  strategy: `global-var:${path}`,
  detect: async () => {
    const parts = path.split('.');
    let current: unknown = window;
    for (const part of parts) {
      if (
        current == null ||
        typeof current !== 'object' ||
        !(part in current)
      ) {
        return false;
      }
      current = (current as Record<string, unknown>)[part];
    }
    return current !== undefined;
  },
});
