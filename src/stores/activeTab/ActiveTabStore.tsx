'use client';
import { createWithEqualityFn } from 'zustand/traditional';

interface ActiveTabState {
  activeTab: number | boolean;
  setActiveTab: (tab: number | boolean) => void;
}

export const useActiveTabStore = createWithEqualityFn<ActiveTabState>(
  (set) => ({
    activeTab: 0, //TabsMap.Exchange.index,
    setActiveTab: (tab) => set({ activeTab: tab }),
  }),
  Object.is,
);
