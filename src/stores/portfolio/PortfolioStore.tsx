import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { CacheToken, PortfolioState } from '@/types/portfolio';
import type {
  ExtendedTokenAmount,
  ExtendedTokenAmountWithChain,
} from '@/utils/getTokens';
import { createJSONStorage } from 'zustand/middleware';
import type { Account } from '@lifi/wallet-management';

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

// Always return a new map to avoid mutation
export function getOrCreateMap<T>(
  data: Map<string, T> | { [key: string]: T },
): Map<string, T> {
  return new Map(data instanceof Map ? data : Object.entries(data));
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
      getFormattedCacheTokens(accounts?: Account[]) {
        const cacheTokens = getOrCreateMap(get().cacheTokens);
        let accountsValues = Array.from(cacheTokens.values());

        if (accounts) {
          accountsValues = accounts
            .filter((account) => account.isConnected && account?.address)
            .map((account) => account.address!)
            .map((account) => cacheTokens.get(account) ?? []);
        }

        let totalValue = accountsValues
          .map((account) => {
            return account.reduce((sum, item) => {
              return sum + (item.cumulatedTotalUSD ?? 0);
            }, 0);
          })
          .reduce((sum, value) => {
            return sum + value;
          }, 0);

        return {
          totalValue,
          cache: accountsValues.flat().sort((a, b) => {
            return (b.cumulatedTotalUSD ?? 0) - (a.cumulatedTotalUSD ?? 0);
          }),
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
