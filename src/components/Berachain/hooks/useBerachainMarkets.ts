import type { BerachainMarket } from './useBerachainMarket';

export const useBerachainMarkets = (data: BerachainMarket[]) => {
  const markets = data.flatMap((market) => market.protocol.name);

  return markets;
};
