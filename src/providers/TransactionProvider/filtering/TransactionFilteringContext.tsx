'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import type { ExtendedChain } from '@lifi/sdk';
import type { BaseToken } from '@/types/tokens';
import { useAccount } from '@jumperexchange/wallet-management';
import { TransactionProvider } from '../TransactionProvider';
import { useTransactions } from '../TransactionContext';
import type { TransactionsDto } from '@/types/jumper-backend';
import { useAccountGroupsByChainType } from '@/hooks/accounts/useAccountGroupsByChainType';
import {
  ALL_TRANSACTION_TYPES,
  buildApiAssets,
  buildTokenRegistryData,
  extractNftTokenOptions,
  extractSeenAssets,
  extractSeenChainIds,
  filterSortTransactions,
  prioritizeAssets,
  prioritizeChains,
  sanitizeTransactionFilterXor,
} from './utils';
import type { TransactionAssetOption } from './utils';
import { usePortfolioCacheStore } from '@/stores/portfolio/PortfolioCacheStore';
import {
  getTransactionFilterMaxDate,
  TRANSACTION_FILTER_MIN_DATE,
  TRANSACTION_FILTER_SHOW_NFT_OPTIONS,
} from './constants';
import { useChains } from '@/hooks/useChains';
import { useTokens } from '@/hooks/useTokens';

export interface TransactionFilterUI {
  wallet?: string;
  chains?: string[];
  assets?: string[];
  types?: TransactionsDto['action'][];
  minDate?: string | null;
  maxDate?: string | null;
}

export type TransactionSortBy = 'date' | 'chain' | 'action';
export type TransactionOrder = 'asc' | 'desc';

export interface TransactionFilterMetadata {
  allTypes: TransactionsDto['action'][];
  allChains: ExtendedChain[];
  allAssets: TransactionAssetOption[];
  tokensByChain: Map<number, BaseToken[]>;
  allWallets: string[];
  allDateRange: {
    min: Date;
    max: Date;
  };
}

interface TransactionFilteringContextType {
  filter: TransactionFilterUI;
  updateFilter: (patch: Partial<TransactionFilterUI>) => void;
  clearFilters: () => void;
  sortBy: TransactionSortBy;
  order: TransactionOrder;
  setSortBy: (sortBy: TransactionSortBy) => void;
  transactions: TransactionsDto[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  metadata: TransactionFilterMetadata;
  setIsActive: (active: boolean) => void;
}

const transactionSearchParamsParsers = {
  txWallet: parseAsString,
  txChains: parseAsArrayOf(parseAsString),
  txAssets: parseAsArrayOf(parseAsString),
  txTypes: parseAsArrayOf(parseAsString),
  txMinDate: parseAsString,
  txMaxDate: parseAsString,
  txSortBy: parseAsStringEnum<TransactionSortBy>([
    'date',
    'chain',
    'action',
  ]).withDefault('date'),
  txOrder: parseAsStringEnum<TransactionOrder>(['asc', 'desc']).withDefault(
    'desc',
  ),
};

const defaultMetadata: TransactionFilterMetadata = {
  allTypes: [],
  allChains: [],
  allAssets: [],
  tokensByChain: new Map(),
  allWallets: [],
  allDateRange: {
    min: TRANSACTION_FILTER_MIN_DATE,
    max: getTransactionFilterMaxDate(),
  },
};

export const TransactionFilteringContext =
  createContext<TransactionFilteringContextType>({
    filter: {},
    updateFilter: () => {},
    clearFilters: () => {},
    sortBy: 'date',
    order: 'desc',
    setSortBy: () => {},
    transactions: [],
    hasNextPage: false,
    hasPreviousPage: false,
    goToNextPage: () => {},
    goToPreviousPage: () => {},
    isLoading: false,
    error: null,
    refetch: () => {},
    metadata: defaultMetadata,
    setIsActive: () => {},
  });

export const TransactionFilteringProvider = ({
  children,
}: PropsWithChildren) => {
  const { account, accounts } = useAccount();
  const [isActive, setIsActive] = useState(false);
  const accountGroups = useAccountGroupsByChainType(accounts);
  const [searchParams, setSearchParams] = useQueryStates(
    transactionSearchParamsParsers,
    { history: 'replace' },
  );

  const connectedWallets = useMemo(
    () =>
      [...new Set(accountGroups.flatMap(({ addresses }) => addresses))].sort(),
    [accountGroups],
  );

  const filter = useMemo((): TransactionFilterUI => {
    const wallet =
      searchParams.txWallet && connectedWallets.includes(searchParams.txWallet)
        ? searchParams.txWallet
        : account.address;

    const f: TransactionFilterUI = {};
    if (wallet) {
      f.wallet = wallet;
    }
    if (searchParams.txChains?.length) {
      f.chains = searchParams.txChains;
    }
    if (searchParams.txAssets?.length) {
      f.assets = searchParams.txAssets;
    }
    if (searchParams.txTypes?.length) {
      f.types = searchParams.txTypes as TransactionsDto['action'][];
    }
    if (searchParams.txMinDate) {
      f.minDate = searchParams.txMinDate;
    }
    if (searchParams.txMaxDate) {
      f.maxDate = searchParams.txMaxDate;
    }
    return sanitizeTransactionFilterXor(f);
  }, [searchParams, connectedWallets, account.address]);

  const sortBy = searchParams.txSortBy;
  const order = searchParams.txOrder;

  const updateFilter = useCallback(
    (patch: Partial<TransactionFilterUI>) => {
      setSearchParams({
        txWallet:
          patch.wallet !== undefined
            ? (patch.wallet ?? null)
            : searchParams.txWallet,
        txChains:
          'chains' in patch
            ? patch.chains?.length
              ? patch.chains
              : null
            : searchParams.txChains,
        txAssets:
          patch.assets !== undefined
            ? (patch.assets ?? null)
            : searchParams.txAssets,
        txTypes:
          patch.types !== undefined
            ? (patch.types ?? null)
            : searchParams.txTypes,
        txMinDate:
          patch.minDate !== undefined
            ? (patch.minDate ?? null)
            : searchParams.txMinDate,
        txMaxDate:
          patch.maxDate !== undefined
            ? (patch.maxDate ?? null)
            : searchParams.txMaxDate,
      });
    },
    [searchParams, setSearchParams],
  );

  const setSortBy = useCallback(
    (newSortBy: TransactionSortBy) => {
      setSearchParams({ txSortBy: newSortBy });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({
      txWallet: null,
      txChains: null,
      txAssets: null,
      txTypes: null,
      txMinDate: null,
      txMaxDate: null,
    });
  }, [setSearchParams]);

  const { tokens } = useTokens();

  const assets = useMemo(() => buildApiAssets(filter), [filter]);

  const chainIds = useMemo(
    () =>
      filter.chains?.length
        ? filter.chains.map(Number).filter(Boolean)
        : undefined,
    [filter.chains],
  );

  return (
    <TransactionProvider
      walletAddress={filter.wallet}
      minDate={filter.minDate}
      maxDate={filter.maxDate}
      chainIds={chainIds}
      types={filter.types?.length ? filter.types : undefined}
      assets={assets}
      enabled={isActive}
    >
      <TransactionFilteringInner
        filter={filter}
        connectedWallets={connectedWallets}
        sortBy={sortBy}
        order={order}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        setSortBy={setSortBy}
        setIsActive={setIsActive}
        tokens={tokens}
      >
        {children}
      </TransactionFilteringInner>
    </TransactionProvider>
  );
};

interface TransactionFilteringInnerProps extends PropsWithChildren {
  filter: TransactionFilterUI;
  connectedWallets: string[];
  sortBy: TransactionSortBy;
  order: TransactionOrder;
  updateFilter: (patch: Partial<TransactionFilterUI>) => void;
  clearFilters: () => void;
  setSortBy: (sortBy: TransactionSortBy) => void;
  setIsActive: (active: boolean) => void;
  tokens: ReturnType<typeof useTokens>['tokens'];
}

const TransactionFilteringInner = ({
  children,
  filter,
  connectedWallets,
  sortBy,
  order,
  updateFilter,
  clearFilters,
  setSortBy,
  setIsActive,
  tokens,
}: TransactionFilteringInnerProps) => {
  const {
    transactions: rawTransactions,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    error,
    refetch,
  } = useTransactions();

  const { from: seenFrom, to: seenTo } = useMemo(
    () => extractSeenAssets(rawTransactions),
    [rawTransactions],
  );

  const seenAll = useMemo(() => {
    const merged = new Set<string>();
    seenFrom.forEach((s) => merged.add(s));
    seenTo.forEach((s) => merged.add(s));
    return merged;
  }, [seenFrom, seenTo]);

  const seenChainIds = useMemo(
    () => extractSeenChainIds(rawTransactions),
    [rawTransactions],
  );

  const { chains } = useChains();

  const allChains = useMemo(
    () => prioritizeChains(chains, seenChainIds),
    [chains, seenChainIds],
  );

  const { baseAssets, tokensByChain } = useMemo(
    () =>
      tokens
        ? buildTokenRegistryData(tokens)
        : {
            baseAssets: [],
            symbolsByChain: new Map<number, Set<string>>(),
            tokensByChain: new Map<number, BaseToken[]>(),
          },
    [tokens],
  );

  const nftOptions = useMemo(
    () =>
      TRANSACTION_FILTER_SHOW_NFT_OPTIONS
        ? extractNftTokenOptions(rawTransactions)
        : [],
    [rawTransactions],
  );

  const portfolioCache = usePortfolioCacheStore();
  const walletSymbols = useMemo(() => {
    if (!filter.wallet) {
      return new Set<string>();
    }
    const balances = portfolioCache.balances.get(filter.wallet) ?? [];
    return new Set(balances.map((b) => b.token.symbol.toLowerCase()));
  }, [filter.wallet, portfolioCache.balances]);

  const allAssets = useMemo(
    () =>
      prioritizeAssets([...baseAssets, ...nftOptions], seenAll, walletSymbols),
    [baseAssets, nftOptions, seenAll, walletSymbols],
  );

  const metadata = useMemo(
    (): TransactionFilterMetadata => ({
      allTypes: ALL_TRANSACTION_TYPES,
      allChains,
      allAssets,
      tokensByChain,
      allWallets: connectedWallets,
      allDateRange: {
        min: TRANSACTION_FILTER_MIN_DATE,
        max: getTransactionFilterMaxDate(),
      },
    }),
    [allChains, allAssets, tokensByChain, connectedWallets],
  );

  const transactions = useMemo(
    () => filterSortTransactions(rawTransactions, filter, sortBy, order),
    [rawTransactions, filter, sortBy, order],
  );

  const value = useMemo(
    () => ({
      filter,
      updateFilter,
      clearFilters,
      sortBy,
      order,
      setSortBy,
      transactions,
      hasNextPage,
      hasPreviousPage,
      goToNextPage,
      goToPreviousPage,
      isLoading,
      error,
      refetch,
      metadata,
      setIsActive,
    }),
    [
      filter,
      updateFilter,
      clearFilters,
      sortBy,
      order,
      setSortBy,
      transactions,
      hasNextPage,
      hasPreviousPage,
      goToNextPage,
      goToPreviousPage,
      isLoading,
      error,
      refetch,
      metadata,
      setIsActive,
    ],
  );

  return (
    <TransactionFilteringContext.Provider value={value}>
      {children}
    </TransactionFilteringContext.Provider>
  );
};

export const useTransactionFiltering = (): TransactionFilteringContextType =>
  useContext(TransactionFilteringContext);
