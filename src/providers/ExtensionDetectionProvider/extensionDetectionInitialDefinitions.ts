import type { ExtensionDefinition } from './utils';
import {
  chromeExtensionInjectedDetector,
  eip6963AnnounceProviderDetector,
  POCKET_UNIVERSE_EIP6963_LISTEN_MS,
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
    pocketUniverseHtmlDataCsnSnapshotDetector(),
    postMessageProxyDetector(),
    chromeExtensionInjectedDetector(POCKET_UNIVERSE_EXTENSION_ID),
    eip6963AnnounceProviderDetector(
      { nameIncludes: 'Pocket Universe' },
      POCKET_UNIVERSE_EIP6963_LISTEN_MS,
    ),
    pocketUniverseDatasetCsnDetector(
      POCKET_UNIVERSE_HTML_DATA_CSN_SNAPSHOT_OBSERVE_MS,
    ),
  ],
};

export const extensionDetectionInitialDefinitions: ExtensionDefinition[] = [
  pocketUniverseExtensionDefinition,
];
