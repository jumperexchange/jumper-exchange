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

/** Mutation fallback when snapshot / postMessage / DOM injection miss. */
export const POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_OBSERVE_MS = 500;

/** EIP-6963 announce listen window (providers usually respond immediately). */
export const POCKET_UNIVERSE_EIP6963_LISTEN_MS = 1500;

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

/**
 * Pocket replaces `window.postMessage` with a proxied function (spoofed as native).
 * Snapshot the native function reference in the earliest `<head>` script before inject runs.
 */
export const POCKET_UNIVERSE_NATIVE_POST_MESSAGE_SNAPSHOT_KEY =
  '__jumperExtNativePostMessage' as const;

/** Wait after an `eth_blockNumber` probe before re-checking the reference. */
export const POCKET_UNIVERSE_POST_MESSAGE_PROXY_PROBE_SETTLE_MS = 100;

/**
 * MetaMask-shaped message that activates Pocket's lazy postMessage proxy without
 * entering signing/simulation (`EVM_INTERCEPT_METHODS` passthrough).
 */
export const POCKET_UNIVERSE_POST_MESSAGE_WEB3_PROBE = {
  target: 'metamask-contentscript',
  data: {
    name: 'metamask-provider',
    data: {
      jsonrpc: '2.0',
      id: 'jumper-ext-postmessage-probe',
      method: 'eth_blockNumber',
      params: [] as [],
    },
  },
} as const;

export const getPostMessageNativeSnapshotInlineScript = (): string => {
  const k = JSON.stringify(POCKET_UNIVERSE_NATIVE_POST_MESSAGE_SNAPSHOT_KEY);
  const log = JSON.stringify('[extension-detection:postMessage-snapshot]');
  return `
(function () {
  try {
    var w = window;
    var k = ${k};
    if (typeof w.postMessage === 'function') {
      w[k] = w.postMessage;
    } else {
      console.log(${log}, 'postMessage not a function, snapshot skipped');
    }
  } catch (e) {
    console.error(${log}, 'snapshot error', e);
  }
})();
`.trim();
};

const getSnapshottedNativePostMessage = ():
  | Window['postMessage']
  | undefined => {
  const ref = Reflect.get(
    window,
    POCKET_UNIVERSE_NATIVE_POST_MESSAGE_SNAPSHOT_KEY,
  );
  return typeof ref === 'function' ? ref : undefined;
};

const isPostMessageProxied = (): boolean => {
  const native = getSnapshottedNativePostMessage();
  if (native === undefined) {
    return false;
  }
  return window.postMessage !== native;
};

export interface PostMessageProxyDetectorOptions {
  /**
   * When true (default), posts an `eth_blockNumber` MetaMask-shaped message to
   * wake Pocket's lazy proxy, then compares references after a short delay.
   */
  triggerWeb3Probe?: boolean;
  probeSettleMs?: number;
}

/**
 * Detects Pocket-style `window.postMessage` replacement via reference inequality
 * against {@link POCKET_UNIVERSE_NATIVE_POST_MESSAGE_SNAPSHOT_KEY}.
 */
export function postMessageProxyDetector(
  options: PostMessageProxyDetectorOptions = {},
): ExtensionDetector {
  const triggerWeb3Probe = options.triggerWeb3Probe ?? true;
  const probeSettleMs =
    options.probeSettleMs ?? POCKET_UNIVERSE_POST_MESSAGE_PROXY_PROBE_SETTLE_MS;
  const timeout = triggerWeb3Probe ? probeSettleMs + 150 : 200;

  return {
    strategy: triggerWeb3Probe
      ? 'pocket:postMessage-proxy:eth_blockNumber-probe'
      : 'pocket:postMessage-proxy:reference-only',
    timeout,
    detect: async () => {
      if (isPostMessageProxied()) {
        return true;
      }
      if (!triggerWeb3Probe) {
        return false;
      }

      try {
        window.postMessage(POCKET_UNIVERSE_POST_MESSAGE_WEB3_PROBE, '*');
      } catch {
        return false;
      }

      await new Promise<void>((resolve) => {
        setTimeout(resolve, probeSettleMs);
      });

      const proxied = isPostMessageProxied();
      if (proxied && envConfig.NODE_ENV === 'development') {
        console.log('[extension-detection:postMessageProxy]', {
          proxied: true,
          probeSettleMs,
        });
      }
      return proxied;
    },
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

/**
 * Runs detectors in parallel and resolves as soon as any reports `true`.
 * When all have reported `false`, resolves `false` without waiting for slower
 * detectors that already missed the early-exit window.
 */
export async function runDetectors(
  definition: ExtensionDefinition,
): Promise<boolean> {
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
      withTimeout(d.detect(), d.timeout ?? 2000, false)
        .catch(() => false)
        .then((result) => settle(result, index));
    });
  });
}
