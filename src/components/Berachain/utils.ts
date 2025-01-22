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
