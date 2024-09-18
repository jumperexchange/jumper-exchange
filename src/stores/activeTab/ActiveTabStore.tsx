'use client';
import { createWithEqualityFn as create } from 'zustand/traditional';

interface ActiveTabState {
  activeTab: number | boolean;
  setActiveTab: (tab: number | boolean) => void;
}

export const useActiveTabStore = create<ActiveTabState>(
  (set) => ({
    activeTab: 0, //TabsMap.Exchange.index,
    setActiveTab: (tab) => set({ activeTab: tab }),
  }),
  Object.is,
);
