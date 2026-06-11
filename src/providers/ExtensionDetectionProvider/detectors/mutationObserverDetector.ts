import type { ExtensionDetector } from '../types';

export const mutationObserverDetector = (
  selector: string,
  observeMs = 1000,
): ExtensionDetector => ({
  strategy: `mutation-observer:${selector}`,
  timeout: observeMs + 200,
  detect: () =>
    new Promise<boolean>((resolve) => {
      let settled = false;
      let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
      let observer: MutationObserver | undefined = undefined;

      const finish = (result: boolean) => {
        if (settled) {
          return;
        }
        settled = true;
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }
        observer?.disconnect();
        resolve(result);
      };

      if (document.querySelector(selector)) {
        finish(true);
        return;
      }

      observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          finish(true);
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      timeoutId = setTimeout(() => finish(false), observeMs);
    }),
});
