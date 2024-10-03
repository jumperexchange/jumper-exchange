import type { Route } from '@lifi/sdk';
import { formatTokenAmount, formatTokenPrice } from './format';

export const calcPriceImpact = (route: Route) => {
  const fromTokenAmount = formatTokenAmount(
    BigInt(route.fromAmount),
    route.fromToken.decimals,
  );
  const fromTokenPrice = formatTokenPrice(
    fromTokenAmount,
    route.fromToken.priceUSD,
  );
  const toTokenAmount = formatTokenAmount(
    BigInt(route.toAmount),
    route.toToken.decimals,
  );
  const toTokenPrice =
    formatTokenPrice(toTokenAmount, route.toToken.priceUSD) || 0.01;

  const priceImpact = (toTokenPrice / fromTokenPrice - 1).toFixed(6);

  return Number(priceImpact);
};
