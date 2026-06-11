import type { ExtensionDetector } from '../types';

export const chromeExtensionInjectedDetector = (
  extensionId: string,
): ExtensionDetector => ({
  strategy: `chrome-extension:${extensionId}`,
  detect: async () => {
    const selectors = [
      `link[href*="chrome-extension://${extensionId}"]`,
      `script[src*="chrome-extension://${extensionId}"]`,
      `iframe[src*="chrome-extension://${extensionId}"]`,
      `img[src*="chrome-extension://${extensionId}"]`,
    ];
    return selectors.some(
      (selector) => document.querySelector(selector) !== null,
    );
  },
});
