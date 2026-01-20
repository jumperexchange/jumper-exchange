import { uniqBy, uniq, flatMap, min, max, minBy, maxBy } from 'lodash';
import type { Chain, Protocol, Token } from '@/types/jumper-backend';
import type { EnrichedPosition } from '../types/positions.types';
import type { EnrichedToken, PortfolioAccount } from '../types/tokens.types';
import type { Account } from '@lifi/wallet-management';

export interface TokensMetadata {
  wallets: PortfolioAccount[];
  chains: Chain[];
  assets: Token[];
  valueRange: { min: number; max: number };
}

export interface PositionsMetadata {
  chains: Chain[];
  protocols: Protocol[];
  types: string[];
  assets: Token[];
  valueRange: { min: number; max: number };
}

/** Extract unique chains from tokens */
export const extractChainsFromTokens = (tokens: EnrichedToken[]): Chain[] => {
  return uniqBy(
    tokens
      .filter((t) => t.chainId)
      .map((t) => ({
        chainId: t.chainId,
        chainKey: t.chainKey ?? t.chainName ?? '',
      })),
    'chainId',
  );
};

/** Extract metadata from tokens */
export const extractTokensMetadata = (
  tokens: EnrichedToken[],
  accounts: Account[],
): TokensMetadata => {
  const wallets = accounts.filter(
    (account) => account.address,
  ) as PortfolioAccount[];
  const chains = extractChainsFromTokens(tokens);

  const assets: Token[] = uniqBy(
    tokens.map((t) => ({
      name: t.name,
      symbol: t.symbol,
      decimals: t.decimals,
      logo: t.logoURI,
      address: t.address,
      chain: {
        chainId: t.chainId,
        chainKey: t.chainKey,
      },
    })),
    (t) => `${t.chain?.chainId}-${t.address}`,
  );

  const values = tokens.map((t) => parseFloat(t.priceUSD) || 0);
  const minValue = values.length > 0 ? (min(values) ?? 0) : 0;
  const maxValue = values.length > 0 ? (max(values) ?? 0) : 0;

  return {
    wallets,
    chains,
    assets,
    valueRange: { min: Math.floor(minValue), max: Math.ceil(maxValue) },
  };
};

/** Extract unique chains from positions */
export const extractChainsFromPositions = (
  positions: EnrichedPosition[],
): Chain[] => {
  const positionsWithChain = positions.filter((p) => p.chain);
  return uniqBy(
    positionsWithChain.map((p) => p.chain!),
    'chainId',
  );
};

/** Extract unique protocols from positions */
export const extractProtocolsFromPositions = (
  positions: EnrichedPosition[],
): Protocol[] => {
  const positionsWithProtocol = positions.filter((p) => p.protocol);
  return uniqBy(
    positionsWithProtocol.map((p) => p.protocol!),
    'name',
  );
};

/** Extract metadata from positions */
export const extractPositionsMetadata = (
  positions: EnrichedPosition[],
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
    allTokens.map((t) => ({
      name: t.name,
      symbol: t.symbol,
      decimals: t.decimals,
      logo: t.logo,
      address: t.address,
      chain: t.chain,
    })),
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
