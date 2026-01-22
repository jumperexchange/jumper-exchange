import {
  compact,
  flatMap,
  groupBy as groupByLodash,
  orderBy,
  values,
} from 'lodash';
import type { DefiPosition, DefiToken } from '@/types/jumper-backend';
import {
  PortfolioDefiPosition,
  PortfolioDeFiPositionsGroup,
  type LpTokenIdentifier,
  type PositionGroupingFn,
  type PositionGroupingKey,
} from '../types/positions';
import { PortfolioExtendedToken, type PriceLookup } from '../types/tokens';

export const extractLpTokens = (
  positions: DefiPosition[],
): LpTokenIdentifier[] => {
  return compact(
    flatMap(positions, (position) =>
      position.lpToken?.address && position.lpToken?.chain.chainId
        ? {
            address: position.lpToken.address,
            chainId: position.lpToken.chain.chainId,
          }
        : null,
    ),
  );
};

const normalizeDefiToken = (
  token: DefiToken,
  getPrice: PriceLookup,
): PortfolioExtendedToken | null => {
  try {
    return PortfolioExtendedToken.fromDefiToken(token, getPrice);
  } catch (error) {
    console.warn(
      `[normalizeDefiToken] Failed to normalize token ${token.symbol}:`,
      error,
    );
    return null;
  }
};

const normalizeDefiTokens = (
  defiTokens: DefiToken[],
  getPrice: PriceLookup,
): PortfolioExtendedToken[] => {
  return defiTokens
    .map((token) => normalizeDefiToken(token, getPrice))
    .filter(Boolean) as PortfolioExtendedToken[];
};

const normalizePosition = (
  position: DefiPosition,
  getPrice: PriceLookup,
): PortfolioDefiPosition | null => {
  try {
    let lpToken: PortfolioExtendedToken | undefined;
    if (position.lpToken) {
      try {
        lpToken = PortfolioExtendedToken.fromJumperToken(
          position.lpToken,
          getPrice,
        );
      } catch (error) {
        console.warn(
          `[normalizePosition] Failed to normalize lpToken for ${position.protocol.name}:`,
          error,
        );
      }
    }

    return new PortfolioDefiPosition(position, {
      lpToken,
      supplyTokens: normalizeDefiTokens(position.supplyTokens ?? [], getPrice),
      borrowTokens: normalizeDefiTokens(position.borrowTokens ?? [], getPrice),
      assetTokens: normalizeDefiTokens(position.assetTokens ?? [], getPrice),
      collateralTokens: normalizeDefiTokens(
        position.collateralTokens ?? [],
        getPrice,
      ),
      rewardTokens: normalizeDefiTokens(position.rewardTokens ?? [], getPrice),
    });
  } catch (error) {
    console.warn(
      `[normalizePosition] Failed to normalize position ${position.protocol.name}:`,
      error,
    );
    return null;
  }
};

export const normalizePositions = (
  positions: DefiPosition[],
  getPrice: PriceLookup,
): PortfolioDefiPosition[] => {
  return positions
    .map((position) => normalizePosition(position, getPrice))
    .filter(Boolean) as PortfolioDefiPosition[];
};

export const groupByProtocol: PositionGroupingFn = (p) => p.protocol.name;

export const groupByProtocolAndChain: PositionGroupingFn = (p) =>
  `${p.protocol.name}-${p.chain.chainKey}`;

export const positionGroupingFns: Record<
  PositionGroupingKey,
  PositionGroupingFn
> = {
  byProtocol: groupByProtocol,
  byProtocolAndChain: groupByProtocolAndChain,
};

export const toPositionsGroup = (
  positions: PortfolioDefiPosition[],
): PortfolioDeFiPositionsGroup | null => {
  if (positions.length === 0) {
    return null;
  }
  return new PortfolioDeFiPositionsGroup(positions, 0);
};

export const groupPositions = (
  positions: PortfolioDefiPosition[],
  groupBy: PositionGroupingKey,
): PortfolioDeFiPositionsGroup[] => {
  const groupingFn = positionGroupingFns[groupBy];
  const grouped = groupByLodash(positions, groupingFn);
  const groups = values(grouped).map(toPositionsGroup);
  return orderBy(compact(groups), (g) => g.amountUSD, 'desc');
};
