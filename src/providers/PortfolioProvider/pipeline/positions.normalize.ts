import type { DefiPosition, DefiToken } from '@/types/jumper-backend';
import type { PortfolioDefiPosition } from '../types/positions.types';
import {
  PortfolioExtendedToken,
  type PriceLookup,
} from '../classes/PortfolioExtendedToken';

const normalizeDefiTokens = (
  defiTokens: DefiToken[],
  getPrice: PriceLookup,
): PortfolioExtendedToken[] => {
  return defiTokens.map((token) =>
    PortfolioExtendedToken.fromDefiToken(token, getPrice),
  );
};

export const normalizePositions = (
  positions: DefiPosition[],
  getPrice: PriceLookup,
): PortfolioDefiPosition[] => {
  return positions.map((position) => ({
    ...position,
    lpToken: position.lpToken
      ? PortfolioExtendedToken.fromJumperToken(position.lpToken, getPrice)
      : undefined,
    supplyTokens: normalizeDefiTokens(position.supplyTokens ?? [], getPrice),
    borrowTokens: normalizeDefiTokens(position.borrowTokens ?? [], getPrice),
    assetTokens: normalizeDefiTokens(position.assetTokens ?? [], getPrice),
    collateralTokens: normalizeDefiTokens(
      position.collateralTokens ?? [],
      getPrice,
    ),
    rewardTokens: normalizeDefiTokens(position.rewardTokens ?? [], getPrice),
  }));
};
