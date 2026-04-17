'use client';

import React, { useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import {
  createExtensionDetectionStore,
  ExtensionDetectionStoreContext,
  useExtensionDetectionStore,
} from './store';
import type { ExtensionDefinition, ExtensionStatus } from './utils';

export type {
  Eip6963AnnounceProviderMatch,
  ExtensionDefinition,
  ExtensionDetector,
  ExtensionStatus,
} from './utils';
export {
  chromeExtensionInjectedDetector,
  domElementDetector,
  eip6963AnnounceProviderDetector,
  globalVariableDetector,
  messageHandshakeDetector,
  mutationObserverDetector,
  resourceFetchDetector,
  stylesheetDetector,
} from './utils';

export interface ExtensionDetectionProviderProps {
  children: React.ReactNode;
  detectors?: ExtensionDefinition[];
  pollingInterval?: number;
}

export function ExtensionDetectionProvider({
  children,
  detectors: propDetectors,
  pollingInterval,
}: ExtensionDetectionProviderProps) {
  const storeRef = useRef<
    ReturnType<typeof createExtensionDetectionStore> | undefined
  >(undefined);
  if (!storeRef.current) {
    storeRef.current = createExtensionDetectionStore();
  }
  const store = storeRef.current;

  useEffect(() => {
    const { initRegistry, runCheck, registry } = store.getState();
    initRegistry(propDetectors);
    Array.from(registry.keys()).forEach(runCheck);
  }, [store, propDetectors]);

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
