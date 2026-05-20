'use client';

import { createContext, useContext } from 'react';
import { createStore, type StoreApi } from 'zustand';
import { runDetectors } from './runDetectors';
import type { ExtensionDefinition, ExtensionStatus } from './types';

export interface ExtensionDetectionStore {
  statusMap: Record<string, ExtensionStatus>;
  registry: Map<string, ExtensionDefinition>;
  initRegistry: (propDetectors?: ExtensionDefinition[]) => void;
  updateStatus: (name: string, patch: Partial<ExtensionStatus>) => void;
  runCheck: (name: string) => Promise<void>;
  register: (definition: ExtensionDefinition) => void;
}

/** Stable fallback for selectors; avoid new object each snapshot (Zustand `useSyncExternalStore`). */
export const DEFAULT_EXTENSION_STATUS: ExtensionStatus = {
  detected: false,
  loading: true,
  error: null,
};

export function createExtensionDetectionStore(): StoreApi<ExtensionDetectionStore> {
  return createStore<ExtensionDetectionStore>((set, get) => ({
    statusMap: {},
    registry: new Map<string, ExtensionDefinition>(),

    initRegistry: (propDetectors) => {
      const merged = new Map<string, ExtensionDefinition>();
      propDetectors?.forEach((d) => merged.set(d.name.toLowerCase(), d));
      set({ registry: merged });
    },

    updateStatus: (name, patch) => {
      set((state) => ({
        statusMap: {
          ...state.statusMap,
          [name]: {
            ...DEFAULT_EXTENSION_STATUS,
            ...state.statusMap[name],
            ...patch,
          },
        },
      }));
    },

    runCheck: async (name) => {
      const key = name.toLowerCase();
      const { registry, updateStatus } = get();
      const definition = registry.get(key);

      if (!definition) {
        updateStatus(key, {
          loading: false,
          error: new Error(`No detectors registered for extension: "${name}"`),
        });
        return;
      }

      updateStatus(key, { loading: true, error: null });

      try {
        const detected = await runDetectors(definition);
        updateStatus(key, { detected, loading: false });
      } catch (err) {
        updateStatus(key, {
          loading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        });
      }
    },

    register: (definition) => {
      const key = definition.name.toLowerCase();
      set((state) => {
        const registry = new Map(state.registry);
        registry.set(key, definition);
        return { registry };
      });
      get().runCheck(definition.name);
    },
  }));
}

export const extensionDetectionStore = createExtensionDetectionStore();

export const ExtensionDetectionStoreContext =
  createContext<StoreApi<ExtensionDetectionStore> | null>(null);

export function useExtensionDetectionStore(): StoreApi<ExtensionDetectionStore> {
  const store = useContext(ExtensionDetectionStoreContext);
  if (!store) {
    throw new Error(
      'useExtensionDetectionStore must be used within an <ExtensionDetectionProvider>',
    );
  }
  return store;
}
