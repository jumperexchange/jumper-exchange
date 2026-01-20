import { map, sumBy } from 'lodash';
import { formatTokenAmount, formatTokenPrice } from '@lifi/widget';
import type { DefiPosition, DefiToken } from '@/types/jumper-backend';
import type { GetTokenPrice } from '../datasources/prices.datasource';
import type { EnrichedPosition } from '../types/positions.types';

/**
 * Augment a DefiToken with fresh price data from the price lookup.
 */
const augmentDefiToken = (
  token: DefiToken,
  getTokenPrice: GetTokenPrice,
): DefiToken => {
  const chainId = token.chain?.chainId;
  if (!chainId) {
    return token;
  }

  const freshPrice = getTokenPrice(chainId, token.address);
  if (freshPrice === undefined) {
    return token;
  }

  const amount = formatTokenAmount(BigInt(token.amount), token.decimals);

  const amountUSD = formatTokenPrice(
    BigInt(token.amount),
    `${freshPrice}`,
    token.decimals,
  );

  return {
    ...token,
    amount,
    priceUSD: freshPrice,
    amountUSD,
  };
};

/**
 * Augment an array of DefiTokens with fresh prices.
 */
const augmentDefiTokens = (
  tokens: DefiToken[],
  getTokenPrice: GetTokenPrice,
): DefiToken[] => {
  return map(tokens, (token) => augmentDefiToken(token, getTokenPrice));
};

/**
 * Augment a single position with fresh price data for all its tokens.
 * Recalculates assetUsd, debtUsd, and netUsd based on fresh prices.
 */
export const augmentPosition = (
  position: DefiPosition,
  getTokenPrice: GetTokenPrice,
): EnrichedPosition => {
  const supplyTokens = augmentDefiTokens(position.supplyTokens, getTokenPrice);
  const borrowTokens = augmentDefiTokens(position.borrowTokens, getTokenPrice);
  const assetTokens = augmentDefiTokens(position.assetTokens, getTokenPrice);
  const collateralTokens = augmentDefiTokens(
    position.collateralTokens,
    getTokenPrice,
  );
  const rewardTokens = augmentDefiTokens(position.rewardTokens, getTokenPrice);

  const assetUsd =
    sumBy(supplyTokens, 'amountUSD') +
    sumBy(assetTokens, 'amountUSD') +
    sumBy(rewardTokens, 'amountUSD') +
    sumBy(collateralTokens, 'amountUSD');

  const debtUsd = sumBy(borrowTokens, 'amountUSD');
  const netUsd = assetUsd - debtUsd;

  return {
    ...position,
    supplyTokens,
    borrowTokens,
    assetTokens,
    collateralTokens,
    rewardTokens,
    assetUsd,
    debtUsd,
    netUsd,
    hasFreshPrices: true,
  };
};

/**
 * Augment multiple positions with fresh price data.
 */
export const augmentPositions = (
  positions: DefiPosition[],
  getTokenPrice: GetTokenPrice,
): EnrichedPosition[] => {
  return map(positions, (position) => augmentPosition(position, getTokenPrice));
};
