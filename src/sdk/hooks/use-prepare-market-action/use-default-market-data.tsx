import type { TypedRoycoMarketType } from '../../market';
import { RoycoMarketType } from '../../market';
import type { ReadMarketDataType } from '../use-read-market';
import { useReadMarket } from '../use-read-market';
import { useEnrichedMarkets } from '../use-enriched-markets';

export const useDefaultMarketData = ({
  chain_id,
  market_id,
  market_type,
  enabled = true,
}: {
  chain_id: number;
  market_id: string;
  market_type: TypedRoycoMarketType;
  enabled?: boolean;
}) => {
  // Get base market data (protocol fee and frontend fee + enter/exit market scripts (for recipe markets))
  const propsReadMarket = useReadMarket({
    chain_id,
    market_type,
    market_id,
    enabled,
  });

  // Set base market data
  const baseMarket: ReadMarketDataType | undefined = propsReadMarket.data
    ? propsReadMarket.data
    : undefined;

  // Get enriched market data
  const propsEnrichedMarket = useEnrichedMarkets({
    chain_id,
    market_type:
      market_type === RoycoMarketType.recipe.id
        ? RoycoMarketType.recipe.value
        : RoycoMarketType.vault.value,
    market_id,
    enabled,
  });

  // Set enriched market data
  const enrichedMarket =
    propsEnrichedMarket.data && propsEnrichedMarket.data.length > 0
      ? propsEnrichedMarket.data[0]
      : undefined;

  // Check if loading
  const isLoading = propsReadMarket.isLoading || propsEnrichedMarket.isLoading;

  return {
    baseMarket,
    enrichedMarket,
    isLoading,
  };
};
