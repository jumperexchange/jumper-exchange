import type { ExtensionDetector } from '../types';

export const resourceFetchDetector = (
  resourceUrl: string,
): ExtensionDetector => ({
  strategy: `resource-fetch:${resourceUrl}`,
  detect: async () => {
    try {
      const res = await fetch(resourceUrl, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  },
});
