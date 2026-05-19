import envConfig from '@/config/env-config';

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

export interface Eip6963AnnounceProviderMatch {
  rdns?: string;
  nameIncludes?: string;
  rdnsIncludes?: string;
}

const eip6963DetailMatches = (
  detail: unknown,
  match: Eip6963AnnounceProviderMatch,
): boolean => {
  if (detail == null || typeof detail !== 'object' || !('info' in detail)) {
    return false;
  }
  const info = (detail as { info?: unknown }).info;
  if (info == null || typeof info !== 'object') {
    return false;
  }
  const rec = info as { name?: unknown; rdns?: unknown };
  const name = typeof rec.name === 'string' ? rec.name : '';
  const rdns = typeof rec.rdns === 'string' ? rec.rdns : '';
  const nameLower = name.toLowerCase();
  const rdnsLower = rdns.toLowerCase();

  if (match.rdns !== undefined && rdns === match.rdns) {
    return true;
  }
  if (
    match.rdnsIncludes !== undefined &&
    rdnsLower.includes(match.rdnsIncludes.toLowerCase())
  ) {
    return true;
  }
  if (
    match.nameIncludes !== undefined &&
    nameLower.includes(match.nameIncludes.toLowerCase())
  ) {
    return true;
  }
  return false;
};

const eip6963MatchIsEmpty = (match: Eip6963AnnounceProviderMatch): boolean =>
  match.rdns === undefined &&
  match.nameIncludes === undefined &&
  match.rdnsIncludes === undefined;

export function eip6963AnnounceProviderDetector(
  match: Eip6963AnnounceProviderMatch,
  listenMs = 8000,
): ExtensionDetector {
  if (eip6963MatchIsEmpty(match)) {
    return {
      strategy: 'eip6963:announceProvider:noop',
      detect: async () => false,
    };
  }

  const strategyKey = [
    match.rdns ?? '',
    match.nameIncludes ?? '',
    match.rdnsIncludes ?? '',
  ]
    .filter(Boolean)
    .join('|');

  return {
    strategy: `eip6963:announceProvider:${strategyKey}`,
    timeout: listenMs + 150,
    detect: () =>
      new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => {
          window.removeEventListener('eip6963:announceProvider', handler);
          resolve(false);
        }, listenMs);

        function handler(event: Event) {
          if (!(event instanceof CustomEvent)) {
            return;
          }
          if (!eip6963DetailMatches(event.detail, match)) {
            return;
          }
          clearTimeout(timer);
          window.removeEventListener('eip6963:announceProvider', handler);
          resolve(true);
        }

        window.addEventListener('eip6963:announceProvider', handler);
        window.dispatchEvent(new CustomEvent('eip6963:requestProvider'));
      }),
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
          window.removeEventListener('message', handler, true);
          resolve(false);
        }, timeoutMs);

        function handler(event: MessageEvent) {
          if (!messageHandshakeMatchesReply(event.data, expectedReplyType)) {
            return;
          }
          if (envConfig.NODE_ENV === 'development') {
            console.log('[extension-detection:messageHandshake]', {
              data: event.data,
              origin: event.origin,
              expectedReplyType,
            });
          }
          clearTimeout(timer);
          window.removeEventListener('message', handler, true);
          resolve(true);
        }

        window.addEventListener('message', handler, true);
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

/**
 * Pocket may set `data-csn` on `<html>` very early, then remove it before
 * Next.js client chunks run. Snapshot in a `beforeInteractive` script and read
 * that flag from detectors instead of relying on the DOM alone.
 */
export const POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_KEY =
  '__jumperExtPocketHtmlDataCsn' as const;

/** Same window as {@link pocketUniverseDatasetCsnDetector} (mutation path). */
export const POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_OBSERVE_MS = 2000;

export function pocketUniverseHtmlDataCsnSnapshotDetector(): ExtensionDetector {
  return {
    strategy: 'pocket:html-data-csn-beforeInteractive-snapshot',
    detect: async () =>
      Reflect.get(window, POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_KEY) ===
        true || !!document.documentElement?.hasAttribute('data-csn'),
  };
}

/**
 * Inline script for {@link pocketUniverseHtmlDataCsnSnapshotDetector}: sync
 * check plus a persistent MutationObserver on `document.documentElement` for
 * `data-csn`. The observer is never disconnected so late injections are caught.
 */
export const getPocketUniverseHtmlDataCsnSnapshotInlineScript = (): string => {
  const k = JSON.stringify(POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_KEY);
  const log = JSON.stringify('[extension-detection:pocket-data-csn]');
  return `
(function () {
  try {
    var w = window;
    var k = ${k};
    var L = ${log};

    function hasCsn() {
      var el = document.documentElement;
      return !!(el && el.hasAttribute('data-csn'));
    }

    var el = document.documentElement;
    if (!el) {
      console.log(L, 'no documentElement, snapshot false');
      w[k] = false;
      return;
    }

    if (hasCsn()) {
      console.log(L, 'sync: data-csn already present, snapshot true');
      w[k] = true;
    } else {
      console.log(L, 'watching documentElement for data-csn');
      w[k] = false;
    }

    // Never disconnected — catches data-csn however late the extension injects it.
    var obs = new MutationObserver(function () {
      if (hasCsn()) {
        console.log(L, 'mutation: data-csn present, snapshot true');
        w[k] = true;
      }
    });
    obs.observe(el, { attributes: true, attributeFilter: ['data-csn'] });
  } catch (e) {
    console.error(L, 'snapshot error', e);
    window[${k}] = false;
  }
})();
`.trim();
};

export function pocketUniverseDatasetCsnDetector(
  observeMs = POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_OBSERVE_MS,
): ExtensionDetector {
  const inner = mutationObserverDetector('html[data-csn]', observeMs);
  return {
    strategy: 'pocket:documentElement-data-csn',
    timeout: inner.timeout,
    detect: inner.detect,
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
  results.forEach((result, index) => {
    console.log(
      `Result for definition ${definition.detectors[index].strategy}`,
      result,
    );
  });
  return results.some(Boolean);
}
