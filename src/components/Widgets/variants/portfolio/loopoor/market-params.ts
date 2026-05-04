import type { LoopoorMarket } from '@/types/jumper-backend';
import type { Address } from 'viem';

// Matches the Morpho Blue `MarketParams` struct shape.
export type MorphoMarketParams = {
  loanToken: Address;
  collateralToken: Address;
  oracle: Address;
  irm: Address;
  lltv: bigint;
};

export function toMorphoMarketParams(
  market: LoopoorMarket,
): MorphoMarketParams {
  return {
    loanToken: market.loanToken.address as Address,
    collateralToken: market.collateralToken.address as Address,
    oracle: market.oracle as Address,
    irm: market.irm as Address,
    lltv: BigInt(market.lltv),
  };
}
