import type { App, AppToken, Chain, DefiToken } from '@/types/jumper-backend';
import { createPortfolioBalance, type TokenBalance } from '@/types/tokens';
import { formatUnits } from 'viem';
import type { DefiPosition } from '@/utils/positions/type-guards';
import { isChainDefiPosition } from '@/utils/positions/type-guards';
import uniq from 'lodash/uniq';
import compact from 'lodash/compact';
import map from 'lodash/map';
import flatMap from 'lodash/flatMap';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import type {
  AppPortfolioPosition,
  ChainPortfolioPosition,
  PortfolioPosition,
  PositionBalance,
  WalletPortfolioBalance,
  BalancesMetadata,
  PositionsMetadata,
} from './types';

type GetPrice = (chainId: number, address: string) => number | undefined;

/**
 * Convert wallet balances (from LiFi) to portfolio balances with USD value.
 */
export const toWalletPortfolioBalances = (
  balances: TokenBalance[],
): WalletPortfolioBalance[] => {
  return balances.map((balance) => {
    const amount = formatUnits(balance.amount, balance.token.decimals);
    const amountUSD = Number(amount) * Number(balance.token.priceUSD);
    return {
      ...balance,
      amountUSD,
    };
  });
};

/**
 * Convert a position token (DefiToken or AppToken) to a PositionBalance.
 * Uses fresh price from getPrice if available, otherwise falls back to token's price.
 */
export const toPositionBalance = (
  token: DefiToken | AppToken,
  getPrice?: GetPrice,
): PositionBalance => {
  // Try to get fresh price for chain-based tokens
  let freshPriceUSD: number | undefined = token.priceUSD;
  if (getPrice && 'chain' in token) {
    freshPriceUSD = getPrice(token.chain.chainId, token.address);
  }

  return createPortfolioBalance(token, freshPriceUSD);
};

/**
 * Convert an array of position tokens to PositionBalance array.
 */
export const toPositionBalances = (
  tokens: DefiToken[] | AppToken[],
  getPrice?: GetPrice,
): PositionBalance[] => {
  return tokens.map((token) => toPositionBalance(token, getPrice));
};

/**
 * Convert a DefiPosition to a PortfolioPosition with all token arrays
 * converted to PositionBalance format.
 */
export const toPortfolioPosition = (
  position: DefiPosition,
  getPrice?: GetPrice,
): PortfolioPosition => {
  const tokens = isChainDefiPosition(position)
    ? {
        supplyTokens: toPositionBalances(position.supplyTokens, getPrice),
        borrowTokens: toPositionBalances(position.borrowTokens, getPrice),
        assetTokens: toPositionBalances(position.assetTokens, getPrice),
        collateralTokens: toPositionBalances(
          position.collateralTokens,
          getPrice,
        ),
        rewardTokens: toPositionBalances(position.rewardTokens, getPrice),
        lpToken: position.lpToken
          ? toPositionBalance(
              {
                ...position.lpToken,
                amount: '0',
                amountUSD: 0,
                priceUSD: 0,
                chainType: '-',
              },
              getPrice,
            )
          : undefined,
      }
    : {
        supplyTokens: toPositionBalances(position.supplyTokens, getPrice),
        borrowTokens: toPositionBalances(position.borrowTokens, getPrice),
        assetTokens: toPositionBalances(position.assetTokens, getPrice),
        collateralTokens: toPositionBalances(
          position.collateralTokens,
          getPrice,
        ),
        rewardTokens: toPositionBalances(position.rewardTokens, getPrice),
        lpToken: undefined,
      };

  return {
    ...position,
    ...tokens,
  };
};

/**
 * Convert an array of DefiPositions to PortfolioPositions.
 */
export const toPortfolioPositions = (
  positions: DefiPosition[],
  getPrice?: GetPrice,
): PortfolioPosition[] => {
  return positions.map((position) => toPortfolioPosition(position, getPrice));
};

export const dedupTokensFromLpPositions = (
  balances: WalletPortfolioBalance[],
  lpTokens: PositionBalance[],
): WalletPortfolioBalance[] => {
  return balances.filter(
    (balance) =>
      !lpTokens.some(
        (lpToken) =>
          lpToken.token.address === balance.token.address &&
          lpToken.token.chain?.chainId === balance.token.chainId,
      ),
  );
};

export const calcPercentage = (value: number, total: number): number =>
  total > 0 ? (value / total) * 100 : 0;

// ============================================================================
// Metadata Extraction Helpers
// ============================================================================

export const extractBalancesMetadata = (
  balancesByAddress: Record<string, Record<string, WalletPortfolioBalance[]>>,
): BalancesMetadata => {
  const wallets = Object.keys(balancesByAddress);
  const allBalances = flatMap(
    Object.values(balancesByAddress),
    (grouped) => flatMap(Object.values(grouped)),
  );

  const chains = uniq(compact(map(allBalances, (b) => b.token.chainId)));
  const assets = uniq(compact(map(allBalances, (b) => b.token.symbol)));

  const minBalance = minBy(allBalances, 'amountUSD');
  const maxBalance = maxBy(allBalances, 'amountUSD');

  return {
    wallets,
    chains,
    assets,
    valueRange: {
      min: minBalance?.amountUSD ?? 0,
      max: maxBalance?.amountUSD ?? 0,
    },
  };
};

export const extractPositionsMetadata = (
  positions: PortfolioPosition[],
): PositionsMetadata => {
  const chains = uniq(
    compact(
      map(positions, (p) =>
        isChainPortfolioPosition(p) ? p.chain.chainId : undefined,
      ),
    ),
  );

  const protocols = uniq(compact(map(positions, (p) => p.protocol.name)));
  const types = uniq(compact(map(positions, (p) => p.type)));

  const allAssetTokens = flatMap(positions, (p) => [
    ...p.assetTokens,
    ...p.supplyTokens,
    ...p.collateralTokens,
  ]);
  const assets = uniq(compact(map(allAssetTokens, (t) => t.token.symbol)));

  const minPosition = minBy(positions, 'netUsd');
  const maxPosition = maxBy(positions, 'netUsd');

  return {
    chains,
    protocols,
    types,
    assets,
    valueRange: {
      min: minPosition?.netUsd ?? 0,
      max: maxPosition?.netUsd ?? 0,
    },
  };
};

// ============================================================================
// Property Accessors - for use with lodash groupBy, sortBy, keyBy, etc.
// ============================================================================

// Type guards for PortfolioPosition
export const isChainPortfolioPosition = (
  p: PortfolioPosition,
): p is ChainPortfolioPosition => p.source === 'chain';

export const isAppPortfolioPosition = (
  p: PortfolioPosition,
): p is AppPortfolioPosition => p.source === 'app';

// --- WalletPortfolioBalance Accessors ---

export const BalanceAccessorKeys = {
  chainId: 'chainId',
  symbol: 'symbol',
  address: 'address',
  name: 'name',
  amountUSD: 'amountUSD',
  priceUSD: 'priceUSD',
} as const;

export type BalanceAccessorKey =
  (typeof BalanceAccessorKeys)[keyof typeof BalanceAccessorKeys];

export type BalanceAccessors = Record<
  BalanceAccessorKey,
  (b: WalletPortfolioBalance) => string | number | undefined
>;

export const balanceAccessors: BalanceAccessors = {
  [BalanceAccessorKeys.chainId]: (b) => b.token.chainId,
  [BalanceAccessorKeys.symbol]: (b) => b.token.symbol,
  [BalanceAccessorKeys.address]: (b) => b.token.address,
  [BalanceAccessorKeys.name]: (b) => b.token.name,
  [BalanceAccessorKeys.amountUSD]: (b) => b.amountUSD,
  [BalanceAccessorKeys.priceUSD]: (b) => Number(b.token.priceUSD),
};

// --- PositionBalance Accessors ---

export const PositionBalanceAccessorKeys = {
  chainId: 'chainId',
  symbol: 'symbol',
  address: 'address',
  name: 'name',
  amountUSD: 'amountUSD',
  chain: 'chain',
  app: 'app',
} as const;

export type PositionBalanceAccessorKey =
  (typeof PositionBalanceAccessorKeys)[keyof typeof PositionBalanceAccessorKeys];

export const positionBalanceAccessors = {
  [PositionBalanceAccessorKeys.chainId]: (b: PositionBalance) =>
    b.token.chainId,
  [PositionBalanceAccessorKeys.symbol]: (b: PositionBalance) => b.token.symbol,
  [PositionBalanceAccessorKeys.address]: (b: PositionBalance) =>
    b.token.address,
  [PositionBalanceAccessorKeys.name]: (b: PositionBalance) => b.token.name,
  [PositionBalanceAccessorKeys.amountUSD]: (b: PositionBalance) => b.amountUSD,
  [PositionBalanceAccessorKeys.chain]: (b: PositionBalance) => b.token.chain,
  [PositionBalanceAccessorKeys.app]: (b: PositionBalance) => b.token.app,
};

// --- PortfolioPosition Accessors ---

export const PositionAccessorKeys = {
  protocol: 'protocol',
  protocolLogo: 'protocolLogo',
  type: 'type',
  name: 'name',
  netUsd: 'netUsd',
  assetUsd: 'assetUsd',
  debtUsd: 'debtUsd',
  chainId: 'chainId',
  chain: 'chain',
  appKey: 'appKey',
  app: 'app',
  source: 'source',
  protocolAndChain: 'protocolAndChain',
} as const;

export type PositionAccessorKey =
  (typeof PositionAccessorKeys)[keyof typeof PositionAccessorKeys];

export const positionAccessors = {
  [PositionAccessorKeys.protocol]: (p: PortfolioPosition) => p.protocol.name,
  [PositionAccessorKeys.protocolLogo]: (p: PortfolioPosition) =>
    p.protocol.logo,
  [PositionAccessorKeys.type]: (p: PortfolioPosition) => p.type,
  [PositionAccessorKeys.name]: (p: PortfolioPosition) => p.name,
  [PositionAccessorKeys.netUsd]: (p: PortfolioPosition) => p.netUsd,
  [PositionAccessorKeys.assetUsd]: (p: PortfolioPosition) => p.assetUsd,
  [PositionAccessorKeys.debtUsd]: (p: PortfolioPosition) => p.debtUsd,
  [PositionAccessorKeys.source]: (p: PortfolioPosition) => p.source,
  [PositionAccessorKeys.chainId]: (p: PortfolioPosition): number | undefined =>
    isChainPortfolioPosition(p) ? p.chain.chainId : undefined,
  [PositionAccessorKeys.chain]: (p: PortfolioPosition): Chain | undefined =>
    isChainPortfolioPosition(p) ? p.chain : undefined,
  [PositionAccessorKeys.appKey]: (p: PortfolioPosition): string | undefined =>
    isAppPortfolioPosition(p) ? p.app.key : undefined,
  [PositionAccessorKeys.app]: (p: PortfolioPosition): App | undefined =>
    isAppPortfolioPosition(p) ? p.app : undefined,
  [PositionAccessorKeys.protocolAndChain]: (p: PortfolioPosition): string => {
    if (isChainPortfolioPosition(p)) {
      return `${p.protocol.name}-${p.chain.chainId}`;
    }
    if (isAppPortfolioPosition(p)) {
      return `${p.protocol.name}-app-${p.app.key}`;
    }
    return `${p.protocol.name}-unknown`;
  },
};
