import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { PortfolioState } from '@/types/portfolio';

// ----------------------------------------------------------------------

const defaultSettings = {
  lastAddresses: undefined,
  lastTotalValue: 0,
};

/*--  Use Zustand  --*/

export const usePortfolioStore = createWithEqualityFn(
  persist(
    (set, get) => ({
      ...defaultSettings,

      setLastTotalValue: (portfolioLastValue: number) => {
        set({
          lastTotalValue: portfolioLastValue,
        });
      },
      setLastAddresses: (lastAddresses: string[]) => {
        set({
          lastAddresses: lastAddresses,
        });
      },
    }),
    {
      name: 'jumper-portfolio', // name of the item in the storage (must be unique)
      version: 0,
    },
  ) as unknown as StateCreator<PortfolioState, [], [], PortfolioState>,
  shallow,
);
