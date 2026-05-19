import type { ExtensionDefinition } from './utils';
import {
  chromeExtensionInjectedDetector,
  eip6963AnnounceProviderDetector,
  POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_OBSERVE_MS,
  pocketUniverseDatasetCsnDetector,
  pocketUniverseHtmlDataCsnSnapshotDetector,
  postMessageProxyDetector,
} from './utils';

export const POCKET_UNIVERSE_EXTENSION = 'pocket';

const POCKET_UNIVERSE_EXTENSION_ID = 'gacgndbocaddlemdiaadajmlggabdeod';

export const pocketUniverseExtensionDefinition: ExtensionDefinition = {
  name: POCKET_UNIVERSE_EXTENSION,
  detectors: [
    postMessageProxyDetector(),
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
