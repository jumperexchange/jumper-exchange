import { createExtensionDetector } from './createExtensionDetector';
import {
  POCKET_UNIVERSE_EIP6963_LISTEN_MS,
  POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_OBSERVE_MS,
} from './detectors/pocketUniverse/htmlDataCsnDetector';
import type { ExtensionDefinition } from './types';

export const POCKET_UNIVERSE_EXTENSION = 'pocket';

const POCKET_UNIVERSE_EXTENSION_ID = 'gacgndbocaddlemdiaadajmlggabdeod';

export const pocketUniverseExtensionDefinition: ExtensionDefinition = {
  name: POCKET_UNIVERSE_EXTENSION,
  detectors: [
    createExtensionDetector({ kind: 'pocketHtmlDataCsnSnapshot' }),
    createExtensionDetector({ kind: 'pocketPostMessageProxy' }),
    createExtensionDetector({
      kind: 'chromeExtensionInjected',
      extensionId: POCKET_UNIVERSE_EXTENSION_ID,
    }),
    createExtensionDetector({
      kind: 'eip6963AnnounceProvider',
      match: { nameIncludes: 'Pocket Universe' },
      listenMs: POCKET_UNIVERSE_EIP6963_LISTEN_MS,
    }),
    createExtensionDetector({
      kind: 'pocketDatasetCsn',
      observeMs: POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_OBSERVE_MS,
    }),
  ],
};

export const extensionDetectionInitialDefinitions: ExtensionDefinition[] = [
  pocketUniverseExtensionDefinition,
];
