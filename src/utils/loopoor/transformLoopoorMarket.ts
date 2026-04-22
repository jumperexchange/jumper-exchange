import type {
  EarnOpportunityWithLatestAnalytics,
  LoopoorMarket,
  Protocol,
} from '@/types/jumper-backend';
import { formatUnits } from 'viem';

// Morpho Blue encodes lltv as a WAD (1e18-scaled integer), not in token decimals
const MORPHO_WAD_DECIMALS = 18;

export function loopoorApyToPercent(apyFraction: number): number {
  return apyFraction * 100;
}

export function loopoorLltvToFraction(
  lltvRaw: string,
  decimals?: number,
): number {
  return parseFloat(
    formatUnits(BigInt(lltvRaw), decimals ?? MORPHO_WAD_DECIMALS),
  );
}

/**
 * Transforms a LoopoorMarket API response into an EarnOpportunityWithLatestAnalytics
 * shape so it can be consumed by portfolio borrow components.
 *
 * Mapping:
 *   collateralToken → lpToken
 *   loanToken       → asset
 *   state.supplyApy → latest.apy (converted fraction → %)
 */
export function transformLoopoorMarketToOpportunity(
  market: LoopoorMarket,
  chainKey: string,
  protocol?: Protocol,
): EarnOpportunityWithLatestAnalytics {
  const chain = { chainId: market.chainId, chainKey };

  const name =
    market.label ??
    `${market.collateralToken?.symbol}/${market.loanToken?.symbol} Loop`;

  const supplyApyPercent = loopoorApyToPercent(market.state?.supplyApy ?? 0);

  return {
    name,
    slug: market.marketId,
    description: '',
    tags: ['Borrow', 'Leverage'],
    featured: false,
    forYou: false,
    isRedeemable: false,
    rewards: [],
    protocol: protocol ?? { name: '' },
    asset: {
      name: market.loanToken?.symbol,
      symbol: market.loanToken?.symbol,
      decimals: market.loanToken.decimals,
      address: market.loanToken.address,
      chain,
    },
    lpToken: {
      name: market.collateralToken?.symbol,
      symbol: market.collateralToken?.symbol,
      decimals: market.collateralToken.decimals,
      address: market.collateralToken.address,
      chain,
    },
    latest: {
      date: new Date().toISOString(),
      tvlUsd: formatUnits(
        BigInt(market.state.supplyAssets),
        market.loanToken?.decimals,
      ),
      tvlNative: formatUnits(
        BigInt(market.state.collateralAssets),
        market.collateralToken?.decimals,
      ),
      apy: {
        base: supplyApyPercent,
        reward: 0,
        intrinsic: 0,
        total: supplyApyPercent,
      },
    },
    interactionFlags: {
      canBorrow: true,
      canDeposit: false,
      canWithdraw: false,
      canRewardClaim: false,
      canRewardCompound: false,
      canRepay: false,
    },
  };
}
