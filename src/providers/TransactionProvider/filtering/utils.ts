import { map, orderBy } from 'lodash';
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
): Set<number> => new Set(map(transactions, 'chainId'));

export const prioritizeChains = (
  chains: ExtendedChain[],
  seen: Set<number>,
): ExtendedChain[] => orderBy(chains, [(c) => c.name.toLowerCase()]);

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
    for (const balances of [tx.fromBalances, tx.toBalances]) {
      for (const b of balances) {
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
  }
  return result;
};

// Single pass over the token registry — builds all structures without
// creating an intermediate flattened array.
export const buildTokenRegistryData = (
  tokens: TokensResponse['tokens'],
): {
  baseAssets: BaseToken[];
  symbolsByChain: Map<number, Set<string>>;
  tokensByChain: Map<number, BaseToken[]>;
} => {
  const bySymbol = new Map<string, BaseToken>();
  const byChain = new Map<number, Set<string>>();
  const tokensByChain = new Map<number, BaseToken[]>();

  for (const chainTokens of Object.values(tokens)) {
    for (const token of chainTokens) {
      if (!token.symbol) {
        continue;
      }
      const symbolLower = token.symbol.toLowerCase();

      let chainSet = byChain.get(token.chainId);
      if (!chainSet) {
        chainSet = new Set();
        byChain.set(token.chainId, chainSet);
      }
      chainSet.add(symbolLower);

      if (!VALID_NAME_RE.test(token.name ?? '')) {
        continue;
      }

      const baseToken = createBaseToken({ ...token, name: token.name.trim() });

      if (
        !bySymbol.has(symbolLower) ||
        (!bySymbol.get(symbolLower)!.logoURI && token.logoURI)
      ) {
        bySymbol.set(symbolLower, baseToken);
      }

      let chainArr = tokensByChain.get(token.chainId);
      if (!chainArr) {
        chainArr = [];
        tokensByChain.set(token.chainId, chainArr);
      }
      chainArr.push(baseToken);
    }
  }

  return {
    baseAssets: Array.from(bySymbol.values()),
    symbolsByChain: byChain,
    tokensByChain,
  };
};

const assetKey = (a: TransactionAssetOption): string =>
  isNftTokenOption(a) ? a.address : a.symbol.toLowerCase();

export const prioritizeAssets = (
  assets: TransactionAssetOption[],
  seen: Set<string>,
  walletHeld?: Set<string>,
): TransactionAssetOption[] =>
  orderBy(assets, [
    (a) => (walletHeld?.has(assetKey(a)) ? 0 : 1),
    (a) => (seen.has(assetKey(a)) ? 0 : 1),
    (a) => (isNftTokenOption(a) ? a.address : a.name),
  ]);

export const buildApiAssets = (
  filter: TransactionFilterUI,
): string[] | undefined => (filter.assets?.length ? filter.assets : undefined);

// The transactions endpoint serves either `chains` or `assets`, never both.
// URL params are hand-editable, so enforce the XOR here; assets win as the
// more specific intent.
export const sanitizeTransactionFilterXor = (
  filter: TransactionFilterUI,
): TransactionFilterUI => {
  if (filter.assets?.length && filter.chains?.length) {
    const { chains, ...rest } = filter;
    return rest;
  }
  return filter;
};

const TX_SORT_ITERATEES: Record<
  TransactionSortBy,
  (tx: TransactionsDto) => string | number
> = {
  date: (tx) => tx.time,
  chain: (tx) => tx.chainId,
  action: (tx) => tx.action,
};

export const filterSortTransactions = (
  transactions: TransactionsDto[],
  filter: TransactionFilterUI,
  sortBy: TransactionSortBy,
  order: TransactionOrder,
): TransactionsDto[] => {
  return orderBy(transactions, [TX_SORT_ITERATEES[sortBy]], [order]);
};
