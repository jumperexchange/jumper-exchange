import envConfig from '@/config/env-config';
import type { ExtensionDetector } from '../../types';

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
export const postMessageProxyDetector = (
  options: PostMessageProxyDetectorOptions = {},
): ExtensionDetector => {
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
        window.postMessage(
          POCKET_UNIVERSE_POST_MESSAGE_WEB3_PROBE,
          window.location.origin,
        );
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
};
