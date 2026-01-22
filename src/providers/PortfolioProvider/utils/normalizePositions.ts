import type { DefiPosition, DefiToken } from '@/types/jumper-backend';
import { PortfolioDefiPosition } from '../types/PortfolioDefiPosition';
import {
  PortfolioExtendedToken,
  type PriceLookup,
} from '../types/PortfolioExtendedToken';

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
