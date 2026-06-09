import { chromeExtensionInjectedDetector } from './detectors/chromeExtensionInjectedDetector';
import { domElementDetector } from './detectors/domElementDetector';
import type { Eip6963AnnounceProviderMatch } from './detectors/eip6963AnnounceProviderDetector';
import { eip6963AnnounceProviderDetector } from './detectors/eip6963AnnounceProviderDetector';
import { globalVariableDetector } from './detectors/globalVariableDetector';
import { messageHandshakeDetector } from './detectors/messageHandshakeDetector';
import { mutationObserverDetector } from './detectors/mutationObserverDetector';
import {
  pocketUniverseDatasetCsnDetector,
  pocketUniverseHtmlDataCsnSnapshotDetector,
} from './detectors/pocketUniverse/htmlDataCsnDetector';
import {
  type PostMessageProxyDetectorOptions,
  postMessageProxyDetector,
} from './detectors/pocketUniverse/postMessageProxyDetector';
import { resourceFetchDetector } from './detectors/resourceFetchDetector';
import { stylesheetDetector } from './detectors/stylesheetDetector';
import type { ExtensionDetector } from './types';

export type ExtensionDetectorConfig =
  | { kind: 'domElement'; selector: string }
  | { kind: 'globalVariable'; path: string }
  | { kind: 'stylesheet'; hrefSubstring: string }
  | { kind: 'chromeExtensionInjected'; extensionId: string }
  | {
      kind: 'eip6963AnnounceProvider';
      match: Eip6963AnnounceProviderMatch;
      listenMs?: number;
    }
  | {
      kind: 'messageHandshake';
      outgoing: Record<string, unknown>;
      expectedReplyType: string;
      timeoutMs?: number;
    }
  | { kind: 'mutationObserver'; selector: string; observeMs?: number }
  | { kind: 'resourceFetch'; resourceUrl: string }
  | { kind: 'pocketHtmlDataCsnSnapshot' }
  | { kind: 'pocketDatasetCsn'; observeMs?: number }
  | {
      kind: 'pocketPostMessageProxy';
      options?: PostMessageProxyDetectorOptions;
    };

/**
 * Named factory functions for extension detectors. Prefer
 * {@link createExtensionDetector} when building definitions from config data.
 */
export const extensionDetectorFactories = {
  domElement: domElementDetector,
  globalVariable: globalVariableDetector,
  stylesheet: stylesheetDetector,
  chromeExtensionInjected: chromeExtensionInjectedDetector,
  eip6963AnnounceProvider: eip6963AnnounceProviderDetector,
  messageHandshake: messageHandshakeDetector,
  mutationObserver: mutationObserverDetector,
  resourceFetch: resourceFetchDetector,
  pocketHtmlDataCsnSnapshot: pocketUniverseHtmlDataCsnSnapshotDetector,
  pocketDatasetCsn: pocketUniverseDatasetCsnDetector,
  pocketPostMessageProxy: postMessageProxyDetector,
} as const;

export type ExtensionDetectorFactoryName =
  keyof typeof extensionDetectorFactories;

/**
 * Builds an {@link ExtensionDetector} from a typed config object.
 */
export const createExtensionDetector = (
  config: ExtensionDetectorConfig,
): ExtensionDetector => {
  switch (config.kind) {
    case 'domElement':
      return domElementDetector(config.selector);
    case 'globalVariable':
      return globalVariableDetector(config.path);
    case 'stylesheet':
      return stylesheetDetector(config.hrefSubstring);
    case 'chromeExtensionInjected':
      return chromeExtensionInjectedDetector(config.extensionId);
    case 'eip6963AnnounceProvider':
      return eip6963AnnounceProviderDetector(config.match, config.listenMs);
    case 'messageHandshake':
      return messageHandshakeDetector(
        config.outgoing,
        config.expectedReplyType,
        config.timeoutMs,
      );
    case 'mutationObserver':
      return mutationObserverDetector(config.selector, config.observeMs);
    case 'resourceFetch':
      return resourceFetchDetector(config.resourceUrl);
    case 'pocketHtmlDataCsnSnapshot':
      return pocketUniverseHtmlDataCsnSnapshotDetector();
    case 'pocketDatasetCsn':
      return pocketUniverseDatasetCsnDetector(config.observeMs);
    case 'pocketPostMessageProxy':
      return postMessageProxyDetector(config.options);
    default: {
      const _exhaustive: never = config;
      return _exhaustive;
    }
  }
};
