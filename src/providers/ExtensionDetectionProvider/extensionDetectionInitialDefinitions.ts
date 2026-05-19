import type { ExtensionDefinition } from './utils';
import {
  chromeExtensionInjectedDetector,
  eip6963AnnounceProviderDetector,
  messageHandshakeDetector,
  POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_OBSERVE_MS,
  pocketUniverseDatasetCsnDetector,
  pocketUniverseHtmlDataCsnSnapshotDetector,
} from './utils';

export const POCKET_UNIVERSE_EXTENSION = 'pocket';

const POCKET_UNIVERSE_EXTENSION_ID = 'gacgndbocaddlemdiaadajmlggabdeod';

export const pocketUniverseExtensionDefinition: ExtensionDefinition = {
  name: POCKET_UNIVERSE_EXTENSION,
  detectors: [
    messageHandshakeDetector(
      { type: 'jumper-extension-detection', action: 'probe' },
      '*',
      1000,
    ),
    pocketUniverseHtmlDataCsnSnapshotDetector(),
    chromeExtensionInjectedDetector(POCKET_UNIVERSE_EXTENSION_ID),
    eip6963AnnounceProviderDetector({ nameIncludes: 'Pocket Universe' }, 8000),
    pocketUniverseDatasetCsnDetector(
      POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_OBSERVE_MS,
    ),
  ],
};

export const extensionDetectionInitialDefinitions: ExtensionDefinition[] = [
  pocketUniverseExtensionDefinition,
];
