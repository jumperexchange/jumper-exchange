export interface ExtensionStatus {
  detected: boolean;
  loading: boolean;
  error: Error | null;
}

export interface ExtensionDetector {
  strategy: string;
  detect: () => Promise<boolean>;
  timeout?: number;
}

export interface ExtensionDefinition {
  name: string;
  detectors: ExtensionDetector[];
}

export function domElementDetector(selector: string): ExtensionDetector {
  return {
    strategy: `dom-element:${selector}`,
    detect: async () => document.querySelector(selector) !== null,
  };
}

export function globalVariableDetector(path: string): ExtensionDetector {
  return {
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
  };
}

export function stylesheetDetector(hrefSubstring: string): ExtensionDetector {
  return {
    strategy: `stylesheet:${hrefSubstring}`,
    detect: async () => {
      const links = Array.from(
        document.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet']"),
      );
      return links.some((l) => l.href.includes(hrefSubstring));
    },
  };
}

/**
 * True when the page loads any asset from `chrome-extension://<extensionId>/…`
 * (stylesheet, script, iframe, img). This is the most reliable page-level
 * signal for “this extension injected something here” without needing
 * `postMessage` types from minified bundles.
 */
export function chromeExtensionInjectedDetector(
  extensionId: string,
): ExtensionDetector {
  return {
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
  };
}

const messageHandshakeMatchesReply = (
  data: unknown,
  expectedReplyType: string,
): boolean => {
  if (expectedReplyType === '*') {
    return data != null && typeof data === 'object';
  }
  if (data == null || typeof data !== 'object' || !('type' in data)) {
    return false;
  }
  return (data as { type: unknown }).type === expectedReplyType;
};

/**
 * Posts `outgoing` with `window.postMessage(outgoing, '*')` and listens for a
 * reply. When `expectedReplyType` is `'*'`, any `message` whose `data` is a
 * non-null object counts as success; otherwise `event.data.type` must match.
 */
export function messageHandshakeDetector(
  outgoing: Record<string, unknown>,
  expectedReplyType: string,
  timeoutMs = 500,
): ExtensionDetector {
  return {
    strategy: `message-handshake:${expectedReplyType}`,
    timeout: timeoutMs + 100,
    detect: () =>
      new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => {
          window.removeEventListener('message', handler);
          resolve(false);
        }, timeoutMs);

        function handler(event: MessageEvent) {
          if (!messageHandshakeMatchesReply(event.data, expectedReplyType)) {
            return;
          }
          clearTimeout(timer);
          window.removeEventListener('message', handler);
          resolve(true);
        }

        window.addEventListener('message', handler);
        window.postMessage(outgoing, '*');
      }),
  };
}

export function mutationObserverDetector(
  selector: string,
  observeMs = 1000,
): ExtensionDetector {
  return {
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
  };
}

export function resourceFetchDetector(resourceUrl: string): ExtensionDetector {
  return {
    strategy: `resource-fetch:${resourceUrl}`,
    detect: async () => {
      try {
        const res = await fetch(resourceUrl, { method: 'HEAD' });
        return res.ok;
      } catch {
        return false;
      }
    },
  };
}

export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export async function runDetectors(
  definition: ExtensionDefinition,
): Promise<boolean> {
  const results = await Promise.all(
    definition.detectors.map((d) =>
      withTimeout(d.detect(), d.timeout ?? 2000, false).catch(() => false),
    ),
  );
  return results.some(Boolean);
}
