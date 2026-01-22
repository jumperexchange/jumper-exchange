import { uniqBy, uniq, flatMap, min, max, minBy, maxBy } from 'lodash';
import type { Chain, Protocol, Token } from '@/types/jumper-backend';
import type { Account } from '@lifi/wallet-management';
import type { PortfolioAccount } from '../types/common';
import type { PortfolioExtendedToken } from '../types/tokens';
import type { PortfolioDefiPosition } from '../types/positions';
import type { TokensMetadata, PositionsMetadata } from '../types/metadata';

export const toAssetToken = (token: PortfolioExtendedToken): Token => ({
  name: token.name,
  symbol: token.symbol,
  decimals: token.decimals,
  logo: token.logoURI,
  address: token.address,
  chain: {
    chainId: token.chainId,
    chainKey: token.chainKey,
  },
});

export const extractChainsFromTokens = (
  tokens: PortfolioExtendedToken[],
): Chain[] => {
  return uniqBy(
    tokens
      .filter((t) => t.chainId)
      .map((t) => ({
        chainId: t.chainId,
        chainKey: t.chainKey,
      })),
    'chainId',
  );
};

export const extractTokensMetadata = (
  tokens: PortfolioExtendedToken[],
  accounts: Account[],
): TokensMetadata => {
  const wallets = accounts.filter(
    (account) => account.address,
  ) as PortfolioAccount[];
  const chains = extractChainsFromTokens(tokens);

  const assets: Token[] = uniqBy(
    tokens.map(toAssetToken),
    (t) => `${t.chain?.chainId}-${t.address}`,
  );

  const values = tokens.map((t) => t.amountUSD || 0);
  const minValue = values.length > 0 ? (min(values) ?? 0) : 0;
  const maxValue = values.length > 0 ? (max(values) ?? 0) : 0;

  return {
    wallets,
    chains,
    assets,
    valueRange: { min: Math.floor(minValue), max: Math.ceil(maxValue) },
  };
};

export const extractChainsFromPositions = (
  positions: PortfolioDefiPosition[],
): Chain[] => {
  const positionsWithChain = positions.filter((p) => p.chain);
  return uniqBy(
    positionsWithChain.map((p) => p.chain!),
    'chainId',
  );
};

export const extractProtocolsFromPositions = (
  positions: PortfolioDefiPosition[],
): Protocol[] => {
  const positionsWithProtocol = positions.filter((p) => p.protocol);
  return uniqBy(
    positionsWithProtocol.map((p) => p.protocol!),
    'name',
  );
};

export const extractPositionsMetadata = (
  positions: PortfolioDefiPosition[],
): PositionsMetadata => {
  const chains = extractChainsFromPositions(positions);
  const protocols = extractProtocolsFromPositions(positions);
  const types = uniq(
    positions.map((p) => p.type).filter((t): t is string => !!t),
  );

  const allTokens = flatMap(positions, (p) => [
    ...(p.supplyTokens ?? []),
    ...(p.borrowTokens ?? []),
    ...(p.assetTokens ?? []),
    ...(p.collateralTokens ?? []),
    ...(p.rewardTokens ?? []),
  ]);

  const assets: Token[] = uniqBy(
    allTokens.map(toAssetToken),
    (t) => `${t.chain?.chainId}-${t.address}`,
  );

  const minPosition = minBy(positions, (p) => p.netUsd ?? 0);
  const maxPosition = maxBy(positions, (p) => p.netUsd ?? 0);

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
