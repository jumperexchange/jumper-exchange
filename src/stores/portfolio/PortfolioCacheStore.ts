import { persist, createJSONStorage } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { LiFiCommonToken } from '@/providers/PortfolioProvider/datasources/tokens.datasource';
import type { DefiPosition } from '@/types/jumper-backend';

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
  /** Cached tokens by wallet address */
  tokens: Map<string, LiFiCommonToken[]>;
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
  getTokens: (address: string) => LiFiCommonToken[];
  /** Set cached tokens for an address */
  setTokens: (address: string, tokens: LiFiCommonToken[]) => void;
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

const DEFAULT_CACHE_STATE: PortfolioCacheState = {
  tokens: new Map<string, LiFiCommonToken[]>(),
  positions: new Map<string, DefiPosition[]>(),
  forceRefresh: new Map<string, boolean>(),
  positionPatchVersion: 0,
};

/**
 * Portfolio cache store - handles local persistence of portfolio data
 */
export const usePortfolioCacheStore = createWithEqualityFn(
  persist<PortfolioCacheStore>(
    (set, get) => ({
      ...DEFAULT_CACHE_STATE,

      getTokens: (address: string) => {
        return get().tokens.get(address) ?? [];
      },

      setTokens: (address: string, tokens: LiFiCommonToken[]) => {
        const currentTokens = getOrCreateMap(get().tokens);
        currentTokens.set(address, tokens);
        set({ tokens: currentTokens });
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
          const lpTokenAddress = position.lpToken?.address?.toLowerCase();
          const lpTokenChainId = position.lpToken?.chain?.chainId;

          if (
            lpTokenAddress === positionKey.lpTokenAddress.toLowerCase() &&
            lpTokenChainId === positionKey.chainId
          ) {
            return {
              ...position,
              lpToken: position.lpToken
                ? {
                    ...position.lpToken,
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
        const tokens = getOrCreateMap(get().tokens);
        const positions = getOrCreateMap(get().positions);
        const forceRefresh = getOrCreateMap(get().forceRefresh);

        tokens.delete(address);
        positions.delete(address);
        forceRefresh.delete(address);

        set({ tokens, positions, forceRefresh });
      },

      clearAll: () => {
        set(DEFAULT_CACHE_STATE);
      },
    }),
    {
      name: 'jumper-portfolio-cache',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state: PortfolioCacheStore) => {
        const { tokens, positions, forceRefresh } = state;

        return {
          tokens: Object.fromEntries(tokens.entries()),
          positions: Object.fromEntries(positions.entries()),
          forceRefresh: Object.fromEntries(forceRefresh.entries()),
        } as unknown as PortfolioCacheStore;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        state.tokens = new Map(Object.entries(state.tokens || {}));
        state.positions = new Map(Object.entries(state.positions || {}));
        state.forceRefresh = new Map(Object.entries(state.forceRefresh || {}));
      },
    },
  ),
  shallow,
);
