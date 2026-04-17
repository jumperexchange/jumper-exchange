'use client';

import { extensionDetectionInitialDefinitions } from './extensionDetectionInitialDefinitions';
import { extensionDetectionStore } from './extensionDetectionSingletonStore';

extensionDetectionStore
  .getState()
  .initRegistry(extensionDetectionInitialDefinitions);

for (const def of extensionDetectionInitialDefinitions) {
  void extensionDetectionStore.getState().runCheck(def.name);
}
