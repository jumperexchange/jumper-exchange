import type { ExtensionDetector } from '../types';

export const mutationObserverDetector = (
  selector: string,
  observeMs = 1000,
): ExtensionDetector => ({
  strategy: `mutation-observer:${selector}`,
  timeout: observeMs + 200,
  detect: () =>
    new Promise<boolean>((resolve) => {
      if (document.querySelector(selector)) {
        resolve(true);
        return;
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(true);
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      setTimeout(() => {
        observer.disconnect();
        resolve(false);
      }, observeMs);
    }),
});
