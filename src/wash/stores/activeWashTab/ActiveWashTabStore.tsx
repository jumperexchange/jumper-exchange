'use client';
import { createWithEqualityFn } from 'zustand/traditional';

interface ActiveWashTabState {
  activeWashTab: number | boolean;
  setActiveWashTab: (tab: number | boolean) => void;
}

export const useActiveWashTabStore = createWithEqualityFn<ActiveWashTabState>(
  (set) => ({
    activeWashTab: 1, //WashTabsMap.WashCollection.index,
    setActiveWashTab: (tab) => set({ activeWashTab: tab }),
  }),
  Object.is,
);
