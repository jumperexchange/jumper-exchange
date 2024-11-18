import type { BerachainMarketType } from '../const/berachainExampleData';

export const useBerachainMarkets = (data: BerachainMarketType[]) => {
  const markets = data.flatMap((market) => market.protocol.name);

  return markets;
};
