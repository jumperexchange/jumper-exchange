import { mutationObserverDetector } from '../mutationObserverDetector';
import type { ExtensionDetector } from '../../types';

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

export const pocketUniverseHtmlDataCsnSnapshotDetector =
  (): ExtensionDetector => ({
    strategy: 'pocket:html-data-csn-beforeInteractive-snapshot',
    detect: async () =>
      Reflect.get(window, POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_KEY) ===
        true || !!document.documentElement?.hasAttribute('data-csn'),
  });

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

export const pocketUniverseDatasetCsnDetector = (
  observeMs = POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_OBSERVE_MS,
): ExtensionDetector => {
  const inner = mutationObserverDetector('html[data-csn]', observeMs);
  return {
    strategy: 'pocket:documentElement-data-csn',
    timeout: inner.timeout,
    detect: inner.detect,
  };
};
