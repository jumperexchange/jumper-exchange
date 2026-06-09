import type { ExtensionDetector } from '../types';

export const domElementDetector = (selector: string): ExtensionDetector => ({
  strategy: `dom-element:${selector}`,
  detect: async () => document.querySelector(selector) !== null,
});
