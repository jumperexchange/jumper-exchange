import type { EnrichedMarketDataType } from 'royco/queries';

export function calculateTVLGoal(market: EnrichedMarketDataType) {
  return (
    (1 -
      (market.quantity_ip_usd ?? 0) /
        ((market.quantity_ip_usd ?? 0) + (market.locked_quantity_usd ?? 0))) *
    100
  );
}
