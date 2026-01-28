import { persist, createJSONStorage } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { TokenBalance } from '@/types/tokens';
import type {
  ChainDefiPosition,
  AppDefiPosition,
} from '@/types/jumper-backend';
import superjson from 'superjson';
import type { DefiPosition } from '@/utils/positions/type-guards';
import { isChainDefiPosition } from '@/utils/positions/type-guards';

const getLocalStorage = () =>
  typeof window === 'undefined' ? undefined : localStorage;

/**
 * Helper to ensure we always work with a Map
 */
const getOrCreateMap = <T>(
  data: Map<string, T> | { [key: string]: T },
): Map<string, T> => {
  return new Map(data instanceof Map ? data : Object.entries(data));
};

/**
 * Position key for identifying a specific position
 */
export interface PositionKey {
  chainId: number;
  lpTokenAddress: string;
}

/**
 * Cache state interface
 */
export interface PortfolioCacheState {
  /** Cached balances by wallet address */
  balances: Map<string, TokenBalance[]>;
  /** Cached positions by wallet address */
  positions: Map<string, DefiPosition[]>;
  /** Force refresh flags by wallet address */
  forceRefresh: Map<string, boolean>;
  /** Version counter to trigger re-renders when positions are patched */
  positionPatchVersion: number;
}

/**
 * Cache actions interface
 */
export interface PortfolioCacheActions {
  /** Get cached tokens for an address */
  getBalances: (address: string) => TokenBalance[];
  /** Set cached tokens for an address */
  setBalances: (address: string, balances: TokenBalance[]) => void;
  /** Get cached positions for an address */
  getPositions: (address: string) => DefiPosition[];
  /** Set cached positions for an address */
  setPositions: (address: string, positions: DefiPosition[]) => void;
  /** Patch a specific position's LP token amount */
  patchPositionAmount: (
    walletAddress: string,
    positionKey: PositionKey,
    newAmount: string,
  ) => void;
  /** Check if address needs refresh */
  needsRefresh: (address: string) => boolean;
  /** Set force refresh flag */
  setNeedsRefresh: (address: string, shouldRefresh: boolean) => void;
  /** Clear cache for a single address */
  clearCacheForAddress: (address: string) => void;
  /** Clear all cache */
  clearAll: () => void;
}

export type PortfolioCacheStore = PortfolioCacheState & PortfolioCacheActions;

const createDefaultCacheState = (): PortfolioCacheState => ({
  balances: new Map<string, TokenBalance[]>(),
  positions: new Map<string, DefiPosition[]>(),
  forceRefresh: new Map<string, boolean>(),
  positionPatchVersion: 0,
});

/**
 * Portfolio cache store - handles local persistence of portfolio data
 */
export const usePortfolioCacheStore = createWithEqualityFn(
  persist<PortfolioCacheStore>(
    (set, get) => ({
      ...createDefaultCacheState(),

      getBalances: (address: string) => {
        return get().balances.get(address) ?? [];
      },

      setBalances: (address: string, balances: TokenBalance[]) => {
        const currentBalances = getOrCreateMap(get().balances);
        currentBalances.set(address, balances);
        set({ balances: currentBalances });
      },

      getPositions: (address: string) => {
        return get().positions.get(address) ?? [];
      },

      setPositions: (address: string, positions: DefiPosition[]) => {
        const currentPositions = getOrCreateMap(get().positions);
        currentPositions.set(address, positions);
        set({ positions: currentPositions });
      },

      patchPositionAmount: (
        walletAddress: string,
        positionKey: PositionKey,
        newAmount: string,
      ) => {
        const currentPositions = getOrCreateMap(get().positions);
        const walletPositions = currentPositions.get(walletAddress);

        if (!walletPositions) {
          return;
        }

        const updatedPositions = walletPositions.map((position) => {
          const lpToken = isChainDefiPosition(position)
            ? position.lpToken
            : undefined;
          const lpTokenAddress = lpToken?.address?.toLowerCase();
          const lpTokenChainId = lpToken?.chain?.chainId;

          if (
            lpTokenAddress === positionKey.lpTokenAddress.toLowerCase() &&
            lpTokenChainId === positionKey.chainId
          ) {
            return {
              ...position,
              lpToken: lpToken
                ? {
                    ...lpToken,
                    amount: newAmount,
                  }
                : undefined,
            };
          }

          return position;
        });

        currentPositions.set(walletAddress, updatedPositions);
        set({
          positions: currentPositions,
          positionPatchVersion: get().positionPatchVersion + 1,
        });
      },

      needsRefresh: (address: string) => {
        return get().forceRefresh.get(address) ?? false;
      },

      setNeedsRefresh: (address: string, shouldRefresh: boolean) => {
        const forceRefresh = getOrCreateMap(get().forceRefresh);
        if (shouldRefresh) {
          forceRefresh.set(address, true);
        } else {
          forceRefresh.delete(address);
        }
        set({ forceRefresh });
      },

      clearCacheForAddress: (address: string) => {
        const balances = getOrCreateMap(get().balances);
        const positions = getOrCreateMap(get().positions);
        const forceRefresh = getOrCreateMap(get().forceRefresh);

        balances.delete(address);
        positions.delete(address);
        forceRefresh.delete(address);

        set({ balances, positions, forceRefresh });
      },

      clearAll: () => {
        set(createDefaultCacheState());
      },
    }),
    {
      name: 'jumper-portfolio-cache',
      version: 1,
      storage: {
        getItem: (name) => {
          const str = getLocalStorage()?.getItem(name);
          return str ? superjson.parse(str) : null;
        },
        setItem: (name, value) => {
          getLocalStorage()?.setItem(name, superjson.stringify(value));
        },
        removeItem: (name) => {
          getLocalStorage()?.removeItem(name);
        },
      },
      partialize: (state: PortfolioCacheStore) => {
        const { balances, positions, forceRefresh } = state;

        return {
          balances: Object.fromEntries(balances.entries()),
          positions: Object.fromEntries(positions.entries()),
          forceRefresh: Object.fromEntries(forceRefresh.entries()),
        } as unknown as PortfolioCacheStore;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        state.balances = new Map(Object.entries(state.balances || {}));
        state.positions = new Map(Object.entries(state.positions || {}));
        state.forceRefresh = new Map(Object.entries(state.forceRefresh || {}));
      },
    },
  ),
  shallow,
);
