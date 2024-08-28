import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { PortfolioState } from '@/types/portfolio';

// ----------------------------------------------------------------------

const defaultSettings = {
  lastAddress: undefined,
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
      setLastAddress: (lastAddress: string) => {
        set({
          lastAddress: lastAddress,
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
