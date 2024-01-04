import { TabsMap } from 'src/const';
import { createWithEqualityFn } from 'zustand/traditional';

interface ActiveTabState {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export const useActiveTabStore = createWithEqualityFn<ActiveTabState>(
  (set) => ({
    activeTab: TabsMap.Exchange.index,
    setActiveTab: (tab: number) => set({ activeTab: tab }),
  }),
  Object.is,
);
