import type { App, AppToken, Chain, DefiToken } from '@/types/jumper-backend';
import type {
  Balance,
  ExtendedToken,
  PortfolioBalance,
  PositionToken,
} from '@/types/tokens';
import { createPositionBalance, type WalletToken } from '@/types/tokens';
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
  BalancesMetadata,
  PositionsMetadata,
} from './types';
import type { ExtendedChain } from '@lifi/sdk';
import { uniqBy } from 'lodash';
import { AppPaths } from '@/const/urls';

type GetPrice = (chainId: number, address: string) => number | undefined;

/**
 * Convert wallet balances (from LiFi) to portfolio balances with USD value.
 */
export const toWalletPortfolioBalances = (
  balances: Balance<ExtendedToken>[],
  chains: ExtendedChain[],
): PortfolioBalance<WalletToken>[] => {
  return balances.map((balance) => {
    const amount = formatUnits(balance.amount, balance.token.decimals);
    const amountUSD = Number(amount) * Number(balance.token.priceUSD);
    const chain = chains.find((c) => c.id === balance.token.chainId);
    return {
      ...balance,
      amountUSD,
      token: {
        ...balance.token,
        chainKey: chain?.key ?? '',
        type: 'wallet',
      },
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
): PortfolioBalance<PositionToken> => {
  let freshPriceUSD: number | undefined;
  if (getPrice && 'chain' in token) {
    freshPriceUSD = getPrice(token.chain.chainId, token.address);
  }

  if (freshPriceUSD === undefined) {
    freshPriceUSD = token.priceUSD;
  }

  return createPositionBalance(token, freshPriceUSD);
};

/**
 * Convert an array of position tokens to PositionBalance array.
 */
export const toPositionBalances = (
  tokens: DefiToken[] | AppToken[],
  getPrice?: GetPrice,
): PortfolioBalance<PositionToken>[] => {
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
  balances: PortfolioBalance<WalletToken>[],
  lpTokens: PortfolioBalance<PositionToken>[],
): PortfolioBalance<WalletToken>[] => {
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
  balancesByAddress: Record<
    string,
    Record<string, PortfolioBalance<WalletToken>[]>
  >,
): BalancesMetadata => {
  const wallets = Object.keys(balancesByAddress);
  const allBalances = flatMap(Object.values(balancesByAddress), (grouped) =>
    flatMap(Object.values(grouped)),
  );

  const chains = uniq(compact(map(allBalances, (b) => b.token.chainId)));
  const assets = uniqBy(
    compact(map(allBalances, (b) => b.token)),
    (asset) => asset.symbol,
  );

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
  const chainPositions = positions.filter(isChainPortfolioPosition);

  const chains = uniq(chainPositions.map((position) => position.chain.chainId));

  const protocols = uniqBy(
    compact(map(positions, (p) => p.protocol)),
    (protocol) => protocol.name,
  );
  const types = uniq(compact(map(positions, (p) => p.type)));

  const allAssetTokens = flatMap(positions, (p) => [
    ...p.assetTokens,
    ...p.supplyTokens,
    ...p.collateralTokens,
  ]);
  const assets = uniqBy(
    compact(map(allAssetTokens, (t) => t.token)),
    (asset) => asset.name,
  );

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

export const balanceAccessors = {
  chainId: (b: PortfolioBalance<WalletToken>) => b.token.chainId,
  chainKey: (b: PortfolioBalance<WalletToken>) => b.token.chainKey,
  symbol: (b: PortfolioBalance<WalletToken>) => b.token.symbol,
  address: (b: PortfolioBalance<WalletToken>) => b.token.address,
  name: (b: PortfolioBalance<WalletToken>) => b.token.name,
  amountUSD: (b: PortfolioBalance<WalletToken>) => b.amountUSD,
  priceUSD: (b: PortfolioBalance<WalletToken>) => Number(b.token.priceUSD),
};

export const positionBalanceAccessors = {
  chainId: (b: PortfolioBalance<PositionToken>) => b.token.chainId,
  symbol: (b: PortfolioBalance<PositionToken>) => b.token.symbol,
  address: (b: PortfolioBalance<PositionToken>) => b.token.address,
  name: (b: PortfolioBalance<PositionToken>) => b.token.name,
  amountUSD: (b: PortfolioBalance<PositionToken>) => b.amountUSD,
  chain: (b: PortfolioBalance<PositionToken>) => b.token.chain,
  app: (b: PortfolioBalance<PositionToken>) => b.token.app,
};

export const positionAccessors = {
  protocol: (p: PortfolioPosition) => p.protocol.name,
  protocolLogo: (p: PortfolioPosition) => p.protocol.logo,
  type: (p: PortfolioPosition) => p.type,
  name: (p: PortfolioPosition) => p.name,
  netUsd: (p: PortfolioPosition) => p.netUsd,
  assetUsd: (p: PortfolioPosition) => p.assetUsd,
  debtUsd: (p: PortfolioPosition) => p.debtUsd,
  source: (p: PortfolioPosition) => p.source,
  chainId: (p: PortfolioPosition): number | undefined =>
    isChainPortfolioPosition(p) ? p.chain.chainId : undefined,
  chainKey: (p: PortfolioPosition): string | undefined =>
    isChainPortfolioPosition(p) ? p.chain.chainKey : undefined,
  chain: (p: PortfolioPosition): Chain | undefined =>
    isChainPortfolioPosition(p) ? p.chain : undefined,
  appKey: (p: PortfolioPosition): string | undefined =>
    isAppPortfolioPosition(p) ? p.app.key : undefined,
  app: (p: PortfolioPosition): App | undefined =>
    isAppPortfolioPosition(p) ? p.app : undefined,
  protocolAndChain: (p: PortfolioPosition): string => {
    if (isChainPortfolioPosition(p)) {
      return `${p.protocol.name}-${p.chain.chainId}`;
    }
    if (isAppPortfolioPosition(p)) {
      return `${p.protocol.name}-app-${p.app.key}`;
    }
    return `${p.protocol.name}-unknown`;
  },
};

export const isCurrentPageUsingPositionData = (pathname: string) =>
  [AppPaths.Portfolio].some(
    (allowedPath) =>
      pathname === allowedPath || pathname.startsWith(allowedPath + '/'),
  );
