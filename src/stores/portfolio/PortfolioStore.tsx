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

export function getOrCreateMap<T>(
  data: Map<string, T> | { [key: string]: T },
): Map<string, T> {
  return new Map(data instanceof Map ? data : Object.entries(data));
}

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
  lastTotalValue: new Map<string, number>(),
  lastDate: new Map<string, number>(),
  forceRefresh: new Map<string, boolean>(),
  cacheTokens: new Map<string, CacheToken[]>(),
};

/*--  Use Zustand  --*/
export const usePortfolioStore = createWithEqualityFn(
  persist<PortfolioState>(
    (set, get) => ({
      ...defaultSettings,

      setLast(address: string, value: number, date: number) {
        const lastTotalValue = getOrCreateMap(get().lastTotalValue);
        const lastDate = getOrCreateMap(get().lastDate);
        lastTotalValue.set(address, value);
        lastDate.set(address, date);
        set({
          lastTotalValue,
          lastDate,
        });
      },
      getLast(address: string) {
        const lastTotalValue = get().lastTotalValue;
        const lastDate = get().lastDate;
        return {
          value: lastTotalValue.get(address) ?? 0,
          date: lastDate.get(address) ?? 0,
        };
      },
      setForceRefresh(address: string, state: boolean) {
        const forceRefresh = getOrCreateMap(get().forceRefresh);
        if (state) {
          forceRefresh.set(address, true);
        } else {
          forceRefresh.delete(address);
        }
        set({
          forceRefresh,
        });
      },
      deleteCacheTokenAddress(address: string) {
        const cacheTokens = getOrCreateMap(get().cacheTokens);
        const lastTotalValue = getOrCreateMap(get().lastTotalValue);
        const lastDate = getOrCreateMap(get().lastDate);
        const forceRefresh = getOrCreateMap(get().forceRefresh);

        cacheTokens.delete(address);
        lastTotalValue.delete(address);
        lastDate.delete(address);
        forceRefresh.delete(address);

        set({
          cacheTokens,
          lastTotalValue,
          lastDate,
          forceRefresh,
        });
      },
      getFormattedCacheTokens(accounts?: Account[]) {
        const cacheTokens = get().cacheTokens;
        let accountsValues = Array.from(cacheTokens.values());

        if (accounts) {
          accountsValues = accounts
            .filter((account) => account.isConnected && account?.address)
            .map((account) => account.address!)
            .map((account) => cacheTokens.get(account) ?? []);
        }

        const totalValue = accountsValues
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
    }),
    {
      name: 'jumper-portfolio', // name of the item in the storage (must be unique)
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: async (state: any, version: number) => {
        if (version === 0) {
          return {
            cacheTokens: new Map<string, CacheToken[]>(),
            lastTotalValue: new Map<string, number>(),
            lastDate: new Map<string, number>(),
            forceRefresh: new Map<string, boolean>(),
          };
        }

        return state;
      },
      partialize: (state: PortfolioState) => {
        const { cacheTokens, lastTotalValue, lastDate, forceRefresh } = state;
        const serialized: any = {};

        serialized.cacheTokens = Array.from(cacheTokens.entries()).reduce(
          (acc, [account, tokens]) => {
            acc[account] = tokens;
            return acc;
          },
          {} as Record<string, CacheToken[]>,
        );

        serialized.lastTotalValue = Array.from(lastTotalValue.entries()).reduce(
          (acc, [address, value]) => {
            acc[address] = value;
            return acc;
          },
          {} as Record<string, number>,
        );

        serialized.lastDate = Array.from(lastDate.entries()).reduce(
          (acc, [address, date]) => {
            acc[address] = date;
            return acc;
          },
          {} as Record<string, number>,
        );

        serialized.forceRefresh = Array.from(forceRefresh.entries()).reduce(
          (acc, [address, value]) => {
            acc[address] = value;
            return acc;
          },
          {} as Record<string, boolean>,
        );

        return serialized;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.cacheTokens = new Map(Object.entries(state.cacheTokens || {}));
        state.lastTotalValue = new Map(
          Object.entries(state.lastTotalValue || {}),
        );
        state.lastDate = new Map(Object.entries(state.lastDate || {}));
        state.forceRefresh = new Map(Object.entries(state.forceRefresh || {}));
      },
    },
  ),
  shallow,
);
