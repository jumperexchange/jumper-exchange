// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createExtensionDetector } from './createExtensionDetector';
import { chromeExtensionInjectedDetector } from './detectors/chromeExtensionInjectedDetector';
import { domElementDetector } from './detectors/domElementDetector';
import { eip6963AnnounceProviderDetector } from './detectors/eip6963AnnounceProviderDetector';
import { globalVariableDetector } from './detectors/globalVariableDetector';
import { messageHandshakeDetector } from './detectors/messageHandshakeDetector';
import { mutationObserverDetector } from './detectors/mutationObserverDetector';
import {
  getPocketUniverseHtmlDataCsnSnapshotInlineScript,
  POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_KEY,
  pocketUniverseDatasetCsnDetector,
  pocketUniverseHtmlDataCsnSnapshotDetector,
} from './detectors/pocketUniverse/htmlDataCsnDetector';
import {
  getPostMessageNativeSnapshotInlineScript,
  POCKET_UNIVERSE_NATIVE_POST_MESSAGE_SNAPSHOT_KEY,
  POCKET_UNIVERSE_POST_MESSAGE_PROXY_PROBE_SETTLE_MS,
  postMessageProxyDetector,
} from './detectors/pocketUniverse/postMessageProxyDetector';
import { resourceFetchDetector } from './detectors/resourceFetchDetector';
import { stylesheetDetector } from './detectors/stylesheetDetector';
import { runDetectors } from './runDetectors';
import type { ExtensionDefinition } from './types';
import { withTimeout } from './withTimeout';

const runInlineScript = (source: string): void => {
  const execute = new Function(source);
  execute();
};

describe('createExtensionDetector', () => {
  it('builds the same detector as domElementDetector', async () => {
    const el = document.createElement('div');
    el.id = 'api-marker';
    document.body.appendChild(el);

    const detector = createExtensionDetector({
      kind: 'domElement',
      selector: '#api-marker',
    });

    await expect(detector.detect()).resolves.toBe(true);
    expect(detector.strategy).toBe('dom-element:#api-marker');
    document.body.innerHTML = '';
  });
});

describe('domElementDetector', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns true when the selector matches', async () => {
    const el = document.createElement('div');
    el.id = 'ext-marker';
    document.body.appendChild(el);

    await expect(domElementDetector('#ext-marker').detect()).resolves.toBe(
      true,
    );
  });

  it('returns false when the selector does not match', async () => {
    await expect(domElementDetector('#missing').detect()).resolves.toBe(false);
  });
});

describe('globalVariableDetector', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, 'extTest');
  });

  it('returns true when the nested path exists', async () => {
    Reflect.set(window, 'extTest', { nested: { flag: true } });

    await expect(
      globalVariableDetector('extTest.nested.flag').detect(),
    ).resolves.toBe(true);
  });

  it('returns false when a segment is missing', async () => {
    Reflect.set(window, 'extTest', {});

    await expect(
      globalVariableDetector('extTest.missing').detect(),
    ).resolves.toBe(false);
  });
});

describe('stylesheetDetector', () => {
  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('returns true when a stylesheet href contains the substring', async () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://example.com/chrome-extension/abc/styles.css';
    document.head.appendChild(link);

    await expect(
      stylesheetDetector('chrome-extension/abc').detect(),
    ).resolves.toBe(true);
  });

  it('returns false when no stylesheet matches', async () => {
    await expect(
      stylesheetDetector('chrome-extension/abc').detect(),
    ).resolves.toBe(false);
  });
});

describe('chromeExtensionInjectedDetector', () => {
  const extensionId = 'abcdefghijklmnop';

  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('detects extension scripts in the DOM', async () => {
    const script = document.createElement('script');
    script.src = `chrome-extension://${extensionId}/inject.js`;
    document.head.appendChild(script);

    await expect(
      chromeExtensionInjectedDetector(extensionId).detect(),
    ).resolves.toBe(true);
  });

  it('returns false when no extension assets are present', async () => {
    await expect(
      chromeExtensionInjectedDetector(extensionId).detect(),
    ).resolves.toBe(false);
  });
});

describe('eip6963AnnounceProviderDetector', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns false for an empty match (noop detector)', async () => {
    await expect(eip6963AnnounceProviderDetector({}).detect()).resolves.toBe(
      false,
    );
  });

  it('resolves true when a matching provider is announced', async () => {
    const detectPromise = eip6963AnnounceProviderDetector(
      { nameIncludes: 'Pocket Universe' },
      500,
    ).detect();

    window.dispatchEvent(
      new CustomEvent('eip6963:announceProvider', {
        detail: {
          info: { name: 'Pocket Universe', rdns: 'io.pocket' },
          provider: {},
        },
      }),
    );

    await expect(detectPromise).resolves.toBe(true);
  });

  it('matches by exact rdns', async () => {
    const detectPromise = eip6963AnnounceProviderDetector(
      { rdns: 'io.pocket' },
      500,
    ).detect();

    window.dispatchEvent(
      new CustomEvent('eip6963:announceProvider', {
        detail: {
          info: { name: 'Other', rdns: 'io.pocket' },
          provider: {},
        },
      }),
    );

    await expect(detectPromise).resolves.toBe(true);
  });

  it('matches by rdnsIncludes case-insensitively', async () => {
    const detectPromise = eip6963AnnounceProviderDetector(
      { rdnsIncludes: 'POCKET' },
      500,
    ).detect();

    window.dispatchEvent(
      new CustomEvent('eip6963:announceProvider', {
        detail: {
          info: { name: 'X', rdns: 'io.pocket-universe' },
          provider: {},
        },
      }),
    );

    await expect(detectPromise).resolves.toBe(true);
  });

  it('dispatches eip6963:requestProvider on detect', async () => {
    const requestSpy = vi.fn();
    window.addEventListener('eip6963:requestProvider', requestSpy);

    void eip6963AnnounceProviderDetector({ nameIncludes: 'Test' }, 50).detect();
    await vi.advanceTimersByTimeAsync(0);

    expect(requestSpy).toHaveBeenCalled();
    window.removeEventListener('eip6963:requestProvider', requestSpy);
  });

  it('times out when no matching provider is announced', async () => {
    const detectPromise = eip6963AnnounceProviderDetector(
      { nameIncludes: 'Pocket Universe' },
      100,
    ).detect();

    await vi.advanceTimersByTimeAsync(150);

    await expect(detectPromise).resolves.toBe(false);
  });

  it('ignores non-CustomEvent announcements', async () => {
    const detectPromise = eip6963AnnounceProviderDetector(
      { nameIncludes: 'Pocket' },
      100,
    ).detect();

    window.dispatchEvent(new Event('eip6963:announceProvider'));

    await vi.advanceTimersByTimeAsync(150);

    await expect(detectPromise).resolves.toBe(false);
  });
});

describe('messageHandshakeDetector', () => {
  const dispatchMessage = (init: MessageEventInit) => {
    window.dispatchEvent(new MessageEvent('message', init));
  };

  const dispatchTrustedReply = (data: unknown) => {
    dispatchMessage({
      data,
      origin: window.location.origin,
      source: window,
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('posts outgoing payload to window.location.origin', async () => {
    const postMessageSpy = vi.spyOn(window, 'postMessage');
    const outgoing = { type: 'probe' };
    const detectPromise = messageHandshakeDetector(
      outgoing,
      'pong',
      500,
    ).detect();

    await Promise.resolve();

    expect(postMessageSpy).toHaveBeenCalledWith(
      outgoing,
      window.location.origin,
    );

    dispatchTrustedReply({ type: 'pong' });
    await expect(detectPromise).resolves.toBe(true);
  });

  it('resolves true when a same-origin reply from window is received', async () => {
    const detectPromise = messageHandshakeDetector(
      { type: 'probe' },
      'pong',
      500,
    ).detect();

    await Promise.resolve();

    dispatchTrustedReply({ type: 'pong' });

    await expect(detectPromise).resolves.toBe(true);
  });

  it('accepts any object reply when expectedReplyType is *', async () => {
    const detectPromise = messageHandshakeDetector(
      { type: 'probe' },
      '*',
      500,
    ).detect();

    await Promise.resolve();

    dispatchTrustedReply({ foo: 'bar' });

    await expect(detectPromise).resolves.toBe(true);
  });

  it('ignores replies from a different origin', async () => {
    const detectPromise = messageHandshakeDetector(
      { type: 'probe' },
      'pong',
      100,
    ).detect();

    await Promise.resolve();

    dispatchMessage({
      data: { type: 'pong' },
      origin: 'https://evil.example',
      source: window,
    });

    await vi.advanceTimersByTimeAsync(150);

    await expect(detectPromise).resolves.toBe(false);
  });

  it('ignores replies when event.source is not window', async () => {
    const detectPromise = messageHandshakeDetector(
      { type: 'probe' },
      'pong',
      100,
    ).detect();

    await Promise.resolve();

    dispatchMessage({
      data: { type: 'pong' },
      origin: window.location.origin,
      source: null,
    });

    await vi.advanceTimersByTimeAsync(150);

    await expect(detectPromise).resolves.toBe(false);
  });

  it('times out when no matching reply arrives', async () => {
    const detectPromise = messageHandshakeDetector(
      { type: 'probe' },
      'pong',
      100,
    ).detect();

    await vi.advanceTimersByTimeAsync(150);

    await expect(detectPromise).resolves.toBe(false);
  });
});

describe('mutationObserverDetector', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('returns true immediately when the element already exists', async () => {
    const el = document.createElement('div');
    el.id = 'late-node';
    document.body.appendChild(el);

    await expect(
      mutationObserverDetector('#late-node', 500).detect(),
    ).resolves.toBe(true);
  });

  it('returns true when the element is added during observation', async () => {
    const detectPromise = mutationObserverDetector(
      '#appears-later',
      500,
    ).detect();

    const el = document.createElement('div');
    el.id = 'appears-later';
    document.body.appendChild(el);

    await expect(detectPromise).resolves.toBe(true);
  });

  it('clears the timeout after a match during observation', async () => {
    const detectPromise = mutationObserverDetector('#appears', 500).detect();

    const el = document.createElement('div');
    el.id = 'appears';
    document.body.appendChild(el);

    await expect(detectPromise).resolves.toBe(true);
    await vi.advanceTimersByTimeAsync(500);
    await expect(detectPromise).resolves.toBe(true);
  });

  it('returns false after the observe window elapses', async () => {
    const detectPromise = mutationObserverDetector(
      '#never-appears',
      100,
    ).detect();

    await vi.advanceTimersByTimeAsync(150);

    await expect(detectPromise).resolves.toBe(false);
  });
});

describe('pocketUniverseHtmlDataCsnSnapshotDetector', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_KEY);
    document.documentElement.removeAttribute('data-csn');
  });

  it('returns true when the beforeInteractive snapshot flag is set', async () => {
    Reflect.set(window, POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_KEY, true);

    await expect(
      pocketUniverseHtmlDataCsnSnapshotDetector().detect(),
    ).resolves.toBe(true);
  });

  it('returns true when data-csn is on documentElement', async () => {
    document.documentElement.setAttribute('data-csn', '');

    await expect(
      pocketUniverseHtmlDataCsnSnapshotDetector().detect(),
    ).resolves.toBe(true);
  });

  it('returns false when neither snapshot nor attribute is present', async () => {
    await expect(
      pocketUniverseHtmlDataCsnSnapshotDetector().detect(),
    ).resolves.toBe(false);
  });
});

describe('getPocketUniverseHtmlDataCsnSnapshotInlineScript', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_KEY);
    document.documentElement.removeAttribute('data-csn');
  });

  it('sets snapshot true when data-csn is already present', () => {
    document.documentElement.setAttribute('data-csn', '');

    runInlineScript(getPocketUniverseHtmlDataCsnSnapshotInlineScript());

    expect(
      Reflect.get(window, POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_KEY),
    ).toBe(true);
  });

  it('sets snapshot true when data-csn is added after the script runs', async () => {
    runInlineScript(getPocketUniverseHtmlDataCsnSnapshotInlineScript());

    expect(
      Reflect.get(window, POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_KEY),
    ).toBe(false);

    document.documentElement.setAttribute('data-csn', '');

    await vi.waitFor(() => {
      expect(
        Reflect.get(window, POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_KEY),
      ).toBe(true);
    });
  });
});

describe('pocketUniverseDatasetCsnDetector', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.removeAttribute('data-csn');
  });

  it('detects html[data-csn] via mutation observer', async () => {
    const detectPromise = pocketUniverseDatasetCsnDetector(200).detect();

    document.documentElement.setAttribute('data-csn', '');

    await expect(detectPromise).resolves.toBe(true);
  });
});

describe('getPostMessageNativeSnapshotInlineScript', () => {
  let nativePostMessage: typeof window.postMessage;

  beforeEach(() => {
    nativePostMessage = window.postMessage;
  });

  afterEach(() => {
    Reflect.deleteProperty(
      window,
      POCKET_UNIVERSE_NATIVE_POST_MESSAGE_SNAPSHOT_KEY,
    );
    window.postMessage = nativePostMessage;
  });

  it('stores the native postMessage reference on window', () => {
    runInlineScript(getPostMessageNativeSnapshotInlineScript());

    const snapshotted = Reflect.get(
      window,
      POCKET_UNIVERSE_NATIVE_POST_MESSAGE_SNAPSHOT_KEY,
    );
    expect(snapshotted).toBe(nativePostMessage);
  });
});

describe('postMessageProxyDetector', () => {
  let nativePostMessage: typeof window.postMessage;

  beforeEach(() => {
    nativePostMessage = window.postMessage;
    vi.useFakeTimers();
    Reflect.set(
      window,
      POCKET_UNIVERSE_NATIVE_POST_MESSAGE_SNAPSHOT_KEY,
      nativePostMessage,
    );
    window.postMessage = nativePostMessage;
  });

  afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(
      window,
      POCKET_UNIVERSE_NATIVE_POST_MESSAGE_SNAPSHOT_KEY,
    );
    window.postMessage = nativePostMessage;
  });

  it('returns true when postMessage reference differs from snapshot', async () => {
    window.postMessage = vi.fn() as unknown as typeof window.postMessage;

    await expect(postMessageProxyDetector().detect()).resolves.toBe(true);
  });

  it('returns false when snapshot is missing and probe is disabled', async () => {
    Reflect.deleteProperty(
      window,
      POCKET_UNIVERSE_NATIVE_POST_MESSAGE_SNAPSHOT_KEY,
    );

    await expect(
      postMessageProxyDetector({ triggerWeb3Probe: false }).detect(),
    ).resolves.toBe(false);
  });

  it('posts Web3 probe to window.location.origin', async () => {
    let probeTargetOrigin: string | undefined;
    const recordingPostMessage = ((message: unknown, targetOrigin: string) => {
      probeTargetOrigin = targetOrigin;
      void message;
    }) as typeof window.postMessage;

    Reflect.set(
      window,
      POCKET_UNIVERSE_NATIVE_POST_MESSAGE_SNAPSHOT_KEY,
      recordingPostMessage,
    );
    window.postMessage = recordingPostMessage;

    const detectPromise = postMessageProxyDetector().detect();
    await Promise.resolve();

    expect(probeTargetOrigin).toBe(window.location.origin);

    window.postMessage = vi.fn() as unknown as typeof window.postMessage;

    await vi.advanceTimersByTimeAsync(
      POCKET_UNIVERSE_POST_MESSAGE_PROXY_PROBE_SETTLE_MS,
    );

    await expect(detectPromise).resolves.toBe(true);
  });
});

describe('resourceFetchDetector', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true when HEAD request succeeds', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

    await expect(
      resourceFetchDetector('https://example.com/asset.js').detect(),
    ).resolves.toBe(true);

    expect(fetch).toHaveBeenCalledWith('https://example.com/asset.js', {
      method: 'HEAD',
    });
  });

  it('returns false when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

    await expect(
      resourceFetchDetector('https://example.com/asset.js').detect(),
    ).resolves.toBe(false);
  });

  it('returns false when response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(
      resourceFetchDetector('https://example.com/asset.js').detect(),
    ).resolves.toBe(false);
  });
});

describe('withTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves with the promise value when it settles before the timeout', async () => {
    const result = withTimeout(
      new Promise<string>((resolve) => {
        setTimeout(() => resolve('ok'), 50);
      }),
      200,
      'fallback',
    );

    await vi.advanceTimersByTimeAsync(50);

    await expect(result).resolves.toBe('ok');
  });

  it('resolves with the fallback when the promise exceeds the timeout', async () => {
    const result = withTimeout(
      new Promise<string>((resolve) => {
        setTimeout(() => resolve('ok'), 500);
      }),
      100,
      'fallback',
    );

    await vi.advanceTimersByTimeAsync(100);

    await expect(result).resolves.toBe('fallback');
  });
});

describe('runDetectors', () => {
  it('returns true when any detector succeeds', async () => {
    const definition: ExtensionDefinition = {
      name: 'test-ext',
      detectors: [
        { strategy: 'always-false', detect: async () => false },
        { strategy: 'always-true', detect: async () => true },
      ],
    };

    await expect(runDetectors(definition)).resolves.toBe(true);
  });

  it('returns false when all detectors fail', async () => {
    const definition: ExtensionDefinition = {
      name: 'test-ext',
      detectors: [
        { strategy: 'a', detect: async () => false },
        { strategy: 'b', detect: async () => false },
      ],
    };

    await expect(runDetectors(definition)).resolves.toBe(false);
  });

  it('treats rejected detectors as false', async () => {
    const definition: ExtensionDefinition = {
      name: 'test-ext',
      detectors: [
        {
          strategy: 'throws',
          detect: async () => {
            throw new Error('detect failed');
          },
        },
        { strategy: 'ok', detect: async () => true },
      ],
    };

    await expect(runDetectors(definition)).resolves.toBe(true);
  });

  it('treats synchronous detector throws as false', async () => {
    const definition: ExtensionDefinition = {
      name: 'test-ext',
      detectors: [
        {
          strategy: 'throws-sync',
          detect: () => {
            throw new Error('sync detect failed');
          },
        },
        { strategy: 'ok', detect: async () => true },
      ],
    };

    await expect(runDetectors(definition)).resolves.toBe(true);
  });

  it('resolves false when every detector throws synchronously', async () => {
    const definition: ExtensionDefinition = {
      name: 'test-ext',
      detectors: [
        {
          strategy: 'throws-sync-a',
          detect: () => {
            throw new Error('sync a');
          },
        },
        {
          strategy: 'throws-sync-b',
          detect: () => {
            throw new Error('sync b');
          },
        },
      ],
    };

    await expect(runDetectors(definition)).resolves.toBe(false);
  });

  it('uses detector timeout via withTimeout', async () => {
    vi.useFakeTimers();

    const definition: ExtensionDefinition = {
      name: 'test-ext',
      detectors: [
        {
          strategy: 'slow',
          timeout: 100,
          detect: () =>
            new Promise<boolean>((resolve) => {
              setTimeout(() => resolve(true), 500);
            }),
        },
      ],
    };

    const resultPromise = runDetectors(definition);
    await vi.advanceTimersByTimeAsync(100);

    await expect(resultPromise).resolves.toBe(false);

    vi.useRealTimers();
  });

  it('resolves as soon as a fast detector succeeds without waiting for slow ones', async () => {
    vi.useFakeTimers();

    let slowCompleted = false;
    const definition: ExtensionDefinition = {
      name: 'test-ext',
      detectors: [
        {
          strategy: 'slow',
          timeout: 5000,
          detect: () =>
            new Promise<boolean>((resolve) => {
              setTimeout(() => {
                slowCompleted = true;
                resolve(false);
              }, 5000);
            }),
        },
        { strategy: 'fast', detect: async () => true },
      ],
    };

    const resultPromise = runDetectors(definition);
    await expect(resultPromise).resolves.toBe(true);
    expect(slowCompleted).toBe(false);

    vi.useRealTimers();
  });
});
