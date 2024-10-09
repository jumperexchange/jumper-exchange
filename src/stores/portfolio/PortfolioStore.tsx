import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { CacheToken, PortfolioState } from '@/types/portfolio';
import type {
  ExtendedTokenAmount,
  ExtendedTokenAmountWithChain,
} from '@/utils/getTokens';
import { sortBy, sum, sumBy } from 'lodash';
import { createJSONStorage } from 'zustand/middleware';

// ----------------------------------------------------------------------

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
  lastDate: null,
  forceRefresh: false,
  cacheTokens: new Map(),
};

export function getOrCreateMap<T>(
  data: Map<string, T> | { [key: string]: T },
): Map<string, T> {
  return data instanceof Map ? data : new Map(Object.entries(data));
}

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
      deleteCacheTokenAddress(account: string) {
        const cacheTokens = getOrCreateMap(get().cacheTokens);
        cacheTokens.delete(account);

        set({
          cacheTokens,
        });
      },
      getFormattedCacheTokens() {
        const cacheTokens = getOrCreateMap(get().cacheTokens);
        const accountsValues = Array.from(cacheTokens.values());
        console.log(
          'before summing',
          accountsValues,
          cacheTokens,
          get().cacheTokens,
        );
        let totalValue = sum(
          accountsValues.map((account) => {
            return sumBy(account, 'cumulatedTotalUSD');
          }),
        );

        return {
          totalValue,
          cache: sortBy(accountsValues.flat(), 'cumulatedTotalUSD').reverse(),
        };
      },
      setCacheTokens(account: string, tokens: ExtendedTokenAmount[]) {
        const cacheTokens = getOrCreateMap(get().cacheTokens);
        cacheTokens.set(account, tokens.map(cacheTokenPartialize));

        set({
          cacheTokens,
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
      storage: createJSONStorage(() => localStorage),
      partialize: (state: PortfolioState) => {
        const { cacheTokens, ...rest } = state;
        if (cacheTokens.size > 0) {
          return {
            ...rest,
            cacheTokens: Array.from(cacheTokens.entries()).reduce(
              (acc, [account, tokens]) => {
                acc[account] = tokens;
                return acc;
              },
              {} as { [key: string]: CacheToken[] },
            ),
          };
        }
        return rest;
      },
    },
  ) as unknown as StateCreator<PortfolioState, [], [], PortfolioState>,
  shallow,
);
