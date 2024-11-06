import type { MarketFilter } from 'src/sdk/queries';
import type { BaseSortingFilter } from 'src/sdk/types';
import { sepolia } from 'viem/chains';
import { create } from 'zustand';
import { SupportedChainlist } from '../sdk/constants';

export type ExploreCustomPoolParam = {
  id: string;
  type: string;
  value: number;
  ref: string | null;
};

interface ExploreState {
  exploreView: string;
  setExploreView: (exploreView: string) => void;
  exploreSortKey: string;
  setExploreSortKey: (exploreSortKey: string) => void;
  exploreFilters: Array<MarketFilter>;
  setExploreFilters: (exploreFilters: Array<MarketFilter>) => void;
  exploreSort: Array<BaseSortingFilter>;
  setExploreSort: (exploreSort: Array<BaseSortingFilter>) => void;
  explorePoolSelected: string | null;
  setExplorePoolSelected: (explorePoolSelected: string | null) => void;
  exploreSearch: string;
  setExploreSearch: (exploreSearch: string) => void;
  explorePageIndex: number;
  setExplorePageIndex: (explorePageIndex: number) => void;
  exploreColumnVisibility: {
    [key: string]: boolean;
  };
  setExploreColumnVisibility: (exploreColumnVisibility: {
    [key: string]: boolean;
  }) => void;
  exploreColumnNames: {
    [key: string]: string;
  };
  exploreCustomPoolParams: Array<ExploreCustomPoolParam>;
  setExploreCustomPoolParams: (
    exploreCustomPoolParams: Array<ExploreCustomPoolParam>,
  ) => void;
}

export const exploreColumnNames = {
  name: 'Title',
  input_token_id: 'Asset',
  chain_id: 'Chain',
  market_type: 'Type',
  total_incentive_amounts_usd: 'Incentives',
  locked_quantity_usd: 'TVL',
  annual_change_ratio: 'Yield',
  chain: 'Chain',
};

export const useExplore = create<ExploreState>((set) => ({
  exploreView: 'grid' as string,
  setExploreView: (exploreView: string) => set({ exploreView }),
  exploreSortKey: 'total_incentive_amounts_usd' as string,
  setExploreSortKey: (exploreSortKey: string) => set({ exploreSortKey }),
  exploreFilters: [
    /**
     * @todo Remove this when we go live
     * @tag remove-when-live
     *
     * @context
     * ...(process.env.NEXT_PUBLIC_FRONTEND_TYPE !== "BERACHAIN" ? [ ... ] : []),
     */
    ...(process.env.NEXT_PUBLIC_FRONTEND_TYPE !== 'TESTNET'
      ? [
          {
            id: 'chain_id',
            value: sepolia.id,
            condition: 'NOT',
          },
        ]
      : []),
    // @note: we have a filter in .env, we want testnet to have all chains
    // ...SupportedChainlist.filter((chain) => !chain.testnet).map((chain) => ({
    //   id: "chain_id",
    //   value: chain.id,
    // })),
  ] as Array<MarketFilter>,
  setExploreFilters: (exploreFilters: Array<MarketFilter>) =>
    set({ exploreFilters }),
  exploreSort: [
    {
      id: 'locked_quantity_usd',
      desc: true,
    },
  ],
  setExploreSort: (exploreSort: Array<BaseSortingFilter>) =>
    set({ exploreSort }),
  explorePoolSelected: null,
  setExplorePoolSelected: (explorePoolSelected: string | null) =>
    set({ explorePoolSelected }),
  exploreSearch: '',
  setExploreSearch: (exploreSearch: string) => set({ exploreSearch }),
  explorePageIndex: 0,
  setExplorePageIndex: (explorePageIndex: number) => set({ explorePageIndex }),
  exploreColumnVisibility: {
    name: true,
    input_token_id: true,
    market_type: true,
    locked_quantity_usd: true,
    total_incentive_amounts_usd: true,
    annual_change_ratio: true,
    chain_id: true,
  },
  exploreColumnNames: exploreColumnNames,
  setExploreColumnVisibility: (exploreColumnVisibility) =>
    set({ exploreColumnVisibility }),
  exploreCustomPoolParams: [],
  setExploreCustomPoolParams: (exploreCustomPoolParams) =>
    set({ exploreCustomPoolParams }),
}));
