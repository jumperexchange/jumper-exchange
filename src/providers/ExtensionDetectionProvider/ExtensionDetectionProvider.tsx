'use client';

import './extensionDetectionRegister';

import React, { useEffect } from 'react';
import { useStore } from 'zustand';
import { extensionDetectionStore } from './extensionDetectionSingletonStore';
import {
  ExtensionDetectionStoreContext,
  useExtensionDetectionStore,
} from './store';
import type { ExtensionStatus } from './utils';

export type {
  Eip6963AnnounceProviderMatch,
  ExtensionDefinition,
  ExtensionDetector,
  ExtensionStatus,
} from './utils';

export { extensionDetectionStore } from './extensionDetectionSingletonStore';
export {
  chromeExtensionInjectedDetector,
  domElementDetector,
  eip6963AnnounceProviderDetector,
  globalVariableDetector,
  messageHandshakeDetector,
  mutationObserverDetector,
  pocketUniverseDatasetCsnDetector,
  pocketUniverseHtmlDataCsnSnapshotDetector,
  resourceFetchDetector,
  stylesheetDetector,
} from './utils';

export interface ExtensionDetectionProviderProps {
  children: React.ReactNode;
  pollingInterval?: number;
}

export function ExtensionDetectionProvider({
  children,
  pollingInterval,
}: ExtensionDetectionProviderProps) {
  const store = extensionDetectionStore;

  useEffect(() => {
    if (!pollingInterval) {
      return;
    }
    const id = setInterval(() => {
      const { runCheck, registry } = store.getState();
      Array.from(registry.keys()).forEach(runCheck);
    }, pollingInterval);
    return () => clearInterval(id);
  }, [store, pollingInterval]);

  return (
    <ExtensionDetectionStoreContext.Provider value={store}>
      {children}
    </ExtensionDetectionStoreContext.Provider>
  );
}

export function useExtension(name: string): ExtensionStatus {
  const store = useExtensionDetectionStore();
  return useStore(
    store,
    (state) =>
      state.statusMap[name.toLowerCase()] ?? {
        detected: false,
        loading: true,
        error: null,
      },
  );
}

export function useExtensionDetection() {
  const store = useExtensionDetectionStore();
  const recheck = useStore(store, (s) => s.runCheck);
  const register = useStore(store, (s) => s.register);
  return { recheck, register };
}
