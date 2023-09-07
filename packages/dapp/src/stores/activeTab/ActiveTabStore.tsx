import { createWithEqualityFn } from 'zustand/traditional';
import { TabsMap } from '../../const/tabsMap';

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
