import { flatMap, orderBy } from 'lodash';
import type { ExtendedChain, TokensResponse } from '@lifi/sdk';
import type { TransactionsDto } from '@/types/jumper-backend';
import type { BaseToken } from '@/types/tokens';
import { createBaseToken } from '@/types/tokens';
import type {
  TransactionFilterUI,
  TransactionOrder,
  TransactionSortBy,
} from './TransactionFilteringContext';

export const ALL_TRANSACTION_TYPES: TransactionsDto['action'][] = [
  'approve',
  'bid',
  'burn',
  'claim',
  'delegate',
  'deploy',
  'deposit',
  'execute',
  'mint',
  'receive',
  'revoke',
  'revoke_delegation',
  'send',
  'trade',
  'withdraw',
];

const VALID_NAME_RE = /\p{L}|\p{N}/u;

export interface NftTokenOption {
  type: 'nft';
  address: string;
  chainId: number;
}

export const isNftTokenOption = (
  option: TransactionAssetOption,
): option is NftTokenOption => (option as NftTokenOption).type === 'nft';

export type TransactionAssetOption = BaseToken | NftTokenOption;

export const extractSeenChainIds = (
  transactions: TransactionsDto[],
): Set<number> => {
  const seen = new Set<number>();
  for (const tx of transactions) {
    seen.add(tx.chainId);
  }
  return seen;
};

export const prioritizeChains = (
  chains: ExtendedChain[],
  seen: Set<number>,
): ExtendedChain[] =>
  orderBy(chains, [(c) => (seen.has(c.id) ? 0 : 1), (c) => c.name]);

export const extractSeenAssets = (
  transactions: TransactionsDto[],
): { from: Set<string>; to: Set<string> } => {
  const from = new Set<string>();
  const to = new Set<string>();
  for (const tx of transactions) {
    for (const b of tx.fromBalances) {
      if (!b.token) {
        continue;
      }
      if ('symbol' in b.token && b.token.symbol) {
        from.add(b.token.symbol.toLowerCase());
      } else if ('tokenId' in b.token) {
        from.add(b.token.address.toLowerCase());
      }
    }
    for (const b of tx.toBalances) {
      if (!b.token) {
        continue;
      }
      if ('symbol' in b.token && b.token.symbol) {
        to.add(b.token.symbol.toLowerCase());
      } else if ('tokenId' in b.token) {
        to.add(b.token.address.toLowerCase());
      }
    }
  }
  return { from, to };
};

export const extractNftTokenOptions = (
  transactions: TransactionsDto[],
): NftTokenOption[] => {
  const seen = new Set<string>();
  const result: NftTokenOption[] = [];
  for (const tx of transactions) {
    for (const b of [...tx.fromBalances, ...tx.toBalances]) {
      if (!b.token || !('tokenId' in b.token)) {
        continue;
      }
      const nft = b.token;
      const key = `${nft.address.toLowerCase()}:${nft.chainId}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      result.push({
        type: 'nft',
        address: nft.address.toLowerCase(),
        chainId: nft.chainId,
      });
    }
  }
  return result;
};

export const buildBaseAssets = (
  tokens: TokensResponse['tokens'],
): BaseToken[] => {
  const bySymbol = new Map<string, BaseToken>();
  for (const token of flatMap(tokens)) {
    if (!VALID_NAME_RE.test(token.name ?? '') || !token.symbol) {
      continue;
    }
    const key = token.symbol.toLowerCase();
    if (!bySymbol.has(key) || (!bySymbol.get(key)!.logoURI && token.logoURI)) {
      bySymbol.set(key, createBaseToken({ ...token, name: token.name.trim() }));
    }
  }
  return Array.from(bySymbol.values());
};

export const prioritizeAssets = (
  assets: TransactionAssetOption[],
  seen: Set<string>,
): TransactionAssetOption[] =>
  orderBy(assets, [
    (a) =>
      seen.has(isNftTokenOption(a) ? a.address : a.symbol.toLowerCase())
        ? 0
        : 1,
    (a) => (isNftTokenOption(a) ? a.address : a.name),
  ]);

export const buildApiAssets = (
  filter: TransactionFilterUI,
  tokenRegistry: TokensResponse['tokens'],
  rawTransactions: TransactionsDto[],
  chainKeyToId: Map<string, number>,
): string[] | undefined => {
  const selectedAssets = [
    ...(filter.assetsIn ?? []),
    ...(filter.assetsOut ?? []),
  ];
  if (!selectedAssets.length) {
    return undefined;
  }

  const selectedChainIds: Set<number> | null = filter.chains?.length
    ? new Set(
        filter.chains
          .map((k) => chainKeyToId.get(k))
          .filter((id): id is number => id !== undefined),
      )
    : null;

  const result = new Set<string>();

  // Resolve token symbols from the registry
  for (const token of flatMap(tokenRegistry)) {
    if (!token.symbol || !selectedAssets.includes(token.symbol)) {
      continue;
    }
    if (selectedChainIds && !selectedChainIds.has(token.chainId)) {
      continue;
    }
    result.add(`${token.chainId}:${token.address.toLowerCase()}`);
  }

  // Resolve NFT contract addresses from raw transaction data
  for (const tx of rawTransactions) {
    for (const b of [...tx.fromBalances, ...tx.toBalances]) {
      if (!b.token || !('tokenId' in b.token)) {
        continue;
      }
      const nft = b.token;
      const normalizedAddress = nft.address.toLowerCase();
      if (!selectedAssets.includes(normalizedAddress)) {
        continue;
      }
      if (selectedChainIds && !selectedChainIds.has(nft.chainId)) {
        continue;
      }
      result.add(`${nft.chainId}:${normalizedAddress}`);
    }
  }

  return result.size ? [...result] : undefined;
};

const TX_SORT_ITERATEES: Record<
  TransactionSortBy,
  (tx: TransactionsDto) => string | number
> = {
  date: (tx) => tx.time,
  chain: (tx) => tx.chainId,
  action: (tx) => tx.action,
  asset: (tx) => tx.amountUsd ?? 0,
};

export const filterSortTransactions = (
  transactions: TransactionsDto[],
  filter: TransactionFilterUI,
  sortBy: TransactionSortBy,
  order: TransactionOrder,
): TransactionsDto[] => {
  let result = transactions;

  // The backend receives assetsIn ∪ assetsOut as a single undirected `assets` param,
  // so it may return transactions where the asset appears in either direction.
  // These client-side filters enforce the from/to distinction.
  if (filter.assetsIn?.length) {
    result = result.filter((tx) =>
      tx.fromBalances.some((b) => {
        if (!b.token) {
          return false;
        }
        if ('symbol' in b.token && b.token.symbol) {
          return filter.assetsIn!.includes(b.token.symbol);
        }
        if ('tokenId' in b.token) {
          return filter.assetsIn!.includes(b.token.address.toLowerCase());
        }
        return false;
      }),
    );
  }
  if (filter.assetsOut?.length) {
    result = result.filter((tx) =>
      tx.toBalances.some((b) => {
        if (!b.token) {
          return false;
        }
        if ('symbol' in b.token && b.token.symbol) {
          return filter.assetsOut!.includes(b.token.symbol);
        }
        if ('tokenId' in b.token) {
          return filter.assetsOut!.includes(b.token.address.toLowerCase());
        }
        return false;
      }),
    );
  }

  return orderBy(result, [TX_SORT_ITERATEES[sortBy]], [order]);
};
