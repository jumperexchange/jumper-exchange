import { create } from 'zustand';

interface ContributionStore {
  contributed: boolean;
  setContributed: (contributed: boolean) => void;
  contributionDisplayed: boolean;
  setContributionDisplayed: (contributionDisplayed: boolean) => void;
}

export const useContributionStore = create<ContributionStore>()((set) => ({
  contributed: false,
  setContributed: (contributed) => set({ contributed }),
  contributionDisplayed: false,
  setContributionDisplayed: (contributionDisplayed) =>
    set({ contributionDisplayed }),
}));
