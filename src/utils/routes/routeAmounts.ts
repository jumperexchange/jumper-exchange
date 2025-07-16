import type { LiFiStepExtended, Route, RouteExtended } from '@lifi/sdk';
import { formatUnits } from 'viem';
import { formatTokenAmount, formatTokenPrice } from '../format';

const getLastStep = (route: Route | RouteExtended): LiFiStepExtended | null => {
  return Array.isArray(route.steps) && route.steps.length > 0
    ? (route.steps.findLast((step) => step) as LiFiStepExtended)
    : null;
};

export const getToAmountData = (route: Route | RouteExtended) => {
  const lastStep = getLastStep(route);
  const lastStepExecutionOrRoute = lastStep?.execution || route;

  const toAmount = lastStepExecutionOrRoute?.toAmount || route.toAmount;
  const toTokenDecimals =
    lastStepExecutionOrRoute?.toToken?.decimals || route.toToken.decimals;
  const formattedToAmount = formatUnits(BigInt(toAmount), toTokenDecimals);
  const priceUsd =
    lastStepExecutionOrRoute?.toToken?.priceUSD || route.toToken.priceUSD;
  const toAmountUSD = Number(formattedToAmount) * Number(priceUsd);

  return {
    toAmount,
    toAmountUSD,
    toAmountFormatted: formattedToAmount,
  };
};

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
  const toTokenPrice = formatTokenPrice(toTokenAmount, route.toToken.priceUSD);

  const priceImpact = (toTokenPrice / fromTokenPrice - 1).toFixed(6);

  return Number(priceImpact);
};
