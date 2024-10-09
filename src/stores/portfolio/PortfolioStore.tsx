import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { PortfolioState } from '@/types/portfolio';
import type {
  ExtendedTokenAmount,
  ExtendedTokenAmountWithChain,
} from '@/utils/getTokens';
import { sumBy } from 'lodash';

// ----------------------------------------------------------------------

type CacheToken = Pick<
  ExtendedTokenAmountWithChain,
  | 'address'
  | 'chainId'
  | 'chainLogoURI'
  | 'chainName'
  | 'cumulatedBalance'
  | 'cumulatedTotalUSD'
  | 'logoURI'
  | 'name'
  | 'priceUSD'
  | 'symbol'
  | 'totalPriceUSD'
> & {
  chains: CacheToken[];
};

function cacheTokenPartialize({
  address,
  chainId,
  chainLogoURI,
  chainName,
  cumulatedBalance,
  cumulatedTotalUSD,
  logoURI,
  name,
  priceUSD,
  symbol,
  totalPriceUSD,
  chains,
}: ExtendedTokenAmountWithChain): CacheToken {
  return {
    address,
    chainId,
    chainLogoURI,
    chainName,
    cumulatedBalance,
    cumulatedTotalUSD,
    logoURI,
    name,
    priceUSD,
    symbol,
    totalPriceUSD,
    chains: chains.map(cacheTokenPartialize),
  };
}

const defaultSettings = {
  lastAddresses: undefined,
  lastTotalValue: null,
  totalValue: null,
  lastDate: null,
  forceRefresh: false,
  cacheTokens: [],
};

/*--  Use Zustand  --*/

export const usePortfolioStore = createWithEqualityFn(
  persist(
    (set, get) => ({
      ...defaultSettings,

      setLast(value: number, addresses: string[]) {
        set({
          lastTotalValue: value,
          lastAddresses: addresses,
          lastDate: Date.now(),
        });
      },
      setForceRefresh(state: boolean) {
        set({
          forceRefresh: state,
        });
      },
      setCacheTokens(state: ExtendedTokenAmount[]) {
        set({
          cacheTokens: state,
          totalValue: sumBy(state, 'cumulatedTotalUSD'),
        });
      },
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
      // TODO: Optimize this typing
      partialize: ({
        cacheTokens,
        ...state
      }: {
        [x: string]: any;
        cacheTokens: ExtendedTokenAmountWithChain[];
      }) => {
        if (cacheTokens?.length > 0) {
          return {
            ...state,
            cacheTokens: cacheTokens.map(cacheTokenPartialize),
          };
        }

        return state;
      },
    },
  ) as unknown as StateCreator<PortfolioState, [], [], PortfolioState>,
  shallow,
);
