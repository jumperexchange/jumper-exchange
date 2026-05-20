'use client';

import React, { useCallback, useEffect } from 'react';
import { useStore } from 'zustand';
import { extensionDetectionInitialDefinitions } from './extensionDetectionInitialDefinitions';
import {
  DEFAULT_EXTENSION_STATUS,
  type ExtensionDetectionStore,
  extensionDetectionStore,
  ExtensionDetectionStoreContext,
  useExtensionDetectionStore,
} from './store';
import type { ExtensionStatus } from './types';

extensionDetectionStore
  .getState()
  .initRegistry(extensionDetectionInitialDefinitions);

for (const def of extensionDetectionInitialDefinitions) {
  void extensionDetectionStore.getState().runCheck(def.name);
}

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

export function useExtensionDetectionStatus(name: string): ExtensionStatus {
  const store = useExtensionDetectionStore();
  const key = name.toLowerCase();
  const selectStatus = useCallback(
    (state: ExtensionDetectionStore) =>
      state.statusMap[key] ?? DEFAULT_EXTENSION_STATUS,
    [key],
  );
  return useStore(store, selectStatus);
}

export function useExtensionDetection() {
  const store = useExtensionDetectionStore();
  const selectRunCheck = useCallback(
    (s: ExtensionDetectionStore) => s.runCheck,
    [],
  );
  const selectRegister = useCallback(
    (s: ExtensionDetectionStore) => s.register,
    [],
  );
  const recheck = useStore(store, selectRunCheck);
  const register = useStore(store, selectRegister);
  return { recheck, register };
}
