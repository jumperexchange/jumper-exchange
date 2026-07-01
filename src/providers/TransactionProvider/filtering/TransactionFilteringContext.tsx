'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import { useAccount } from '@lifi/wallet-management';
import { TransactionProvider } from '../TransactionProvider';
import { useTransactions } from '../TransactionContext';
import type { TransactionsDto } from '@/types/jumper-backend';
import { useAccountGroupsByChainType } from '@/hooks/accounts/useAccountGroupsByChainType';
import {
  ALL_TRANSACTION_TYPES,
  buildApiAssets,
  buildBaseAssets,
  extractNftTokenOptions,
  extractSeenAssets,
  extractSeenChainIds,
  filterSortTransactions,
  prioritizeAssets,
  prioritizeChains,
} from './utils';
import type { TransactionAssetOption } from './utils';
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
  assetsIn?: string[];
  assetsOut?: string[];
  types?: TransactionsDto['action'][];
  minDate?: string | null;
  maxDate?: string | null;
}

export type TransactionSortBy = 'date' | 'chain' | 'action';
export type TransactionOrder = 'asc' | 'desc';

export interface TransactionFilterMetadata {
  allTypes: TransactionsDto['action'][];
  allChains: ExtendedChain[];
  allAssetsIn: TransactionAssetOption[];
  allAssetsOut: TransactionAssetOption[];
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
  metadata: TransactionFilterMetadata;
  setIsActive: (active: boolean) => void;
}

const transactionSearchParamsParsers = {
  txWallet: parseAsString,
  txChains: parseAsArrayOf(parseAsString),
  txAssetsIn: parseAsArrayOf(parseAsString),
  txAssetsOut: parseAsArrayOf(parseAsString),
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
  allAssetsIn: [],
  allAssetsOut: [],
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
    if (searchParams.txAssetsIn?.length) {
      f.assetsIn = searchParams.txAssetsIn;
    }
    if (searchParams.txAssetsOut?.length) {
      f.assetsOut = searchParams.txAssetsOut;
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
    return f;
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
          patch.chains !== undefined
            ? (patch.chains ?? null)
            : searchParams.txChains,
        txAssetsIn:
          patch.assetsIn !== undefined
            ? (patch.assetsIn ?? null)
            : searchParams.txAssetsIn,
        txAssetsOut:
          patch.assetsOut !== undefined
            ? (patch.assetsOut ?? null)
            : searchParams.txAssetsOut,
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
      txAssetsIn: null,
      txAssetsOut: null,
      txTypes: null,
      txMinDate: null,
      txMaxDate: null,
    });
  }, [setSearchParams]);

  const { chains } = useChains();
  const { tokens } = useTokens();

  const chainKeyToId = useMemo(
    () => new Map<string, number>(chains.map((c) => [c.key as string, c.id])),
    [chains],
  );

  // Cache of raw transactions used for NFT address resolution.
  // Only updated when no asset filter is active to ensure all asset options remain resolvable.
  const [cachedRawTransactions, setCachedRawTransactions] = useState<
    TransactionsDto[]
  >([]);

  const assets = useMemo(
    () =>
      tokens
        ? buildApiAssets(filter, tokens, cachedRawTransactions, chainKeyToId)
        : undefined,
    [filter, tokens, cachedRawTransactions, chainKeyToId],
  );

  const handleRawTransactionsUpdate = useCallback(
    (txs: TransactionsDto[], hasAssetFilter: boolean) => {
      if (!hasAssetFilter) {
        setCachedRawTransactions(txs);
      }
    },
    [],
  );

  const chainIds = useMemo(
    () =>
      filter.chains?.length
        ? filter.chains
            .map((k) => chainKeyToId.get(k))
            .filter((id): id is number => id !== undefined)
        : undefined,
    [filter.chains, chainKeyToId],
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
        chainKeyToId={chainKeyToId}
        tokens={tokens}
        onRawTransactionsUpdate={handleRawTransactionsUpdate}
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
  chainKeyToId: Map<string, number>;
  tokens: ReturnType<typeof useTokens>['tokens'];
  onRawTransactionsUpdate: (
    txs: TransactionsDto[],
    hasAssetFilter: boolean,
  ) => void;
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
  chainKeyToId,
  tokens,
  onRawTransactionsUpdate,
}: TransactionFilteringInnerProps) => {
  const {
    transactions: rawTransactions,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    isLoading,
  } = useTransactions();

  const hasAssetFilter = !!(
    filter.assetsIn?.length || filter.assetsOut?.length
  );

  useEffect(() => {
    onRawTransactionsUpdate(rawTransactions, hasAssetFilter);
  }, [rawTransactions, hasAssetFilter, onRawTransactionsUpdate]);

  const { from: seenFrom, to: seenTo } = useMemo(
    () => extractSeenAssets(rawTransactions),
    [rawTransactions],
  );

  const seenChainIds = useMemo(
    () => extractSeenChainIds(rawTransactions),
    [rawTransactions],
  );

  const { chains } = useChains();

  const allChains = useMemo(
    () => prioritizeChains(chains, seenChainIds),
    [chains, seenChainIds],
  );

  const baseAssets = useMemo(
    () => (tokens ? buildBaseAssets(tokens) : []),
    [tokens],
  );

  const nftOptions = useMemo(
    () =>
      TRANSACTION_FILTER_SHOW_NFT_OPTIONS
        ? extractNftTokenOptions(rawTransactions)
        : [],
    [rawTransactions],
  );

  const selectedChainIds = useMemo((): Set<number> | null => {
    if (!filter.chains?.length) {
      return null;
    }
    return new Set(
      filter.chains
        .map((k) => chainKeyToId.get(k))
        .filter((id): id is number => id !== undefined),
    );
  }, [filter.chains, chainKeyToId]);

  const filteredBaseAssets = useMemo(
    () =>
      selectedChainIds
        ? baseAssets.filter((t) => selectedChainIds.has(t.chainId))
        : baseAssets,
    [baseAssets, selectedChainIds],
  );

  const filteredNfts = useMemo(
    () =>
      selectedChainIds
        ? nftOptions.filter((n) => selectedChainIds.has(n.chainId))
        : nftOptions,
    [nftOptions, selectedChainIds],
  );

  const allAssetsIn = useMemo(
    () => prioritizeAssets([...filteredBaseAssets, ...filteredNfts], seenFrom),
    [filteredBaseAssets, filteredNfts, seenFrom],
  );

  const allAssetsOut = useMemo(
    () => prioritizeAssets([...filteredBaseAssets, ...filteredNfts], seenTo),
    [filteredBaseAssets, filteredNfts, seenTo],
  );

  const metadata = useMemo(
    (): TransactionFilterMetadata => ({
      allTypes: ALL_TRANSACTION_TYPES,
      allChains,
      allAssetsIn,
      allAssetsOut,
      allWallets: connectedWallets,
      allDateRange: {
        min: TRANSACTION_FILTER_MIN_DATE,
        max: getTransactionFilterMaxDate(),
      },
    }),
    [allChains, allAssetsIn, allAssetsOut, connectedWallets],
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
