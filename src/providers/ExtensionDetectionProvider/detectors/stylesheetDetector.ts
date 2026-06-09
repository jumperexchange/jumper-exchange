import type { ExtensionDetector } from '../types';

export const stylesheetDetector = (
  hrefSubstring: string,
): ExtensionDetector => ({
  strategy: `stylesheet:${hrefSubstring}`,
  detect: async () => {
    const links = Array.from(
      document.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet']"),
    );
    return links.some((l) => l.href.includes(hrefSubstring));
  },
});
