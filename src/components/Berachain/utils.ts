import type { EnrichedMarketDataType } from 'royco/queries';
import type { Quest } from '@/types/loyaltyPass';

export function calculateTVLGoal(market: EnrichedMarketDataType) {
  return (
    (1 -
      (market.quantity_ip_usd ?? 0) /
        ((market.quantity_ip_usd ?? 0) + (market.locked_quantity_usd ?? 0))) *
    100
  );
}

export function getFullTitle(
  roycoData: EnrichedMarketDataType,
  strapiData?: Quest,
) {
  return `${strapiData?.attributes.Title} ${roycoData?.input_token_data?.symbol} Market`;
}

export function includesCaseInsensitive(str: string, searchString: string) {
  return new RegExp(searchString, 'i').test(str);
}

export function titleSlicer(str: string, maxLength: number = 7) {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
}

export function divideBy(num: number, by: number = 100) {
  return num / by;
}

export function aprCalculation(
  lockedQuantityUsd?: number | null,
  totalTVL?: number,
) {
  const BOYCO_TOTAL = 0.02 * 2000000000;
  const TVL_MARKET_SHARE = (lockedQuantityUsd ?? 0) / (totalTVL ?? 1);
  const TOTAL_REWARDS = TVL_MARKET_SHARE * BOYCO_TOTAL;
  const LOCKUP_IN_DAYS = 70;
  const APR =
    ((TOTAL_REWARDS * (365 / LOCKUP_IN_DAYS)) / (lockedQuantityUsd ?? 0)) * 100;

  return APR;
}
