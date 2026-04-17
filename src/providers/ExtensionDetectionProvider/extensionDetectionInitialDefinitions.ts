import type { ExtensionDefinition } from './utils';
import {
  chromeExtensionInjectedDetector,
  eip6963AnnounceProviderDetector,
  pocketUniverseDatasetCsnDetector,
  pocketUniverseHtmlDataCsnSnapshotDetector,
} from './utils';

export const POCKET_UNIVERSE_EXTENSION = 'pocket';

const POCKET_UNIVERSE_EXTENSION_ID = 'gacgndbocaddlemdiaadajmlggabdeod';

export const pocketUniverseExtensionDefinition: ExtensionDefinition = {
  name: POCKET_UNIVERSE_EXTENSION,
  detectors: [
    pocketUniverseHtmlDataCsnSnapshotDetector(),
    chromeExtensionInjectedDetector(POCKET_UNIVERSE_EXTENSION_ID),
    eip6963AnnounceProviderDetector({ nameIncludes: 'Pocket Universe' }, 8000),
    pocketUniverseDatasetCsnDetector(100),
  ],
};

export const extensionDetectionInitialDefinitions: ExtensionDefinition[] = [
  pocketUniverseExtensionDefinition,
];
