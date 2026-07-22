import { usePortfolioFormatters } from '@/hooks/tokens/usePortfolioFormatters';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import { createExtendedToken, createTokenBalance } from '@/types/tokens';
import type { FeeCost, GasCost, LiFiStep, RouteExtended } from '@lifi/sdk';
import { getPriceImpact } from '@jumperexchange/widget';
import { groupBy, map, maxBy, sum, sumBy } from 'lodash';

const isRouteExtended = (
  from: RouteExtended | LiFiStep[],
): from is RouteExtended =>
  !Array.isArray(from) &&
  from !== null &&
  typeof from === 'object' &&
  'steps' in from;

export const useFeeCostsBreakdown = (
  from: RouteExtended | LiFiStep[],
  includedFeesFlag = false,
) => {
  const { toAggregatedAmount, toAggregatedAmountUSD } =
    usePortfolioFormatters();

  let stepsFeesSource;

  if (isRouteExtended(from)) {
    stepsFeesSource = map(
      from.steps,
      (step) => step.execution ?? step.estimate,
    );
  } else {
    stepsFeesSource = map(from, (step) => step.estimate);
  }

  const filteredGasCosts = map(stepsFeesSource, (source) => source.gasCosts)
    .filter(
      (gasCosts): gasCosts is GasCost[] => !!gasCosts && !!gasCosts.length,
    )
    .flat();
  const groupedGasCost = groupBy(
    filteredGasCosts,
    (gasCost) => gasCost.token.chainId,
  );

  const gasCosts = Object.values(groupedGasCost).map((tokenGasCosts) => {
    const balances = tokenGasCosts.map((tokenGasCost) => ({
      token: createExtendedToken(tokenGasCost.token),
      amount: BigInt(tokenGasCost.amount),
      amountUSD: Number(tokenGasCost.amountUSD),
    }));

    return {
      token: balances[0].token,
      amount: toAggregatedAmount(balances),
      amountUSD: toAggregatedAmountUSD(balances),
    };
  });

  const filteredFeeCosts = map(stepsFeesSource, (source) => source.feeCosts)
    .filter(
      (feeCosts): feeCosts is FeeCost[] => !!feeCosts && !!feeCosts.length,
    )
    .flat()
    .filter((feeCost) => feeCost.included === includedFeesFlag);
  const groupedFeeCost = groupBy(
    filteredFeeCosts,
    (feeCost) => feeCost.token.chainId,
  );

  const feeCosts = Object.values(groupedFeeCost).map((tokenFeeCosts) => {
    const balances = tokenFeeCosts.map((tokenFeeCost) => ({
      token: createExtendedToken(tokenFeeCost.token),
      amount: BigInt(tokenFeeCost.amount),
      amountUSD: Number(tokenFeeCost.amountUSD),
    }));

    return {
      token: balances[0].token,
      amount: toAggregatedAmount(balances),
      amountUSD: toAggregatedAmountUSD(balances),
    };
  });

  const gasCostUSD = sumBy(gasCosts, (gasCost) => gasCost.amountUSD);
  const feeCostUSD = sumBy(feeCosts, (feeCost) => feeCost.amountUSD);
  const combinedFeesUSD = gasCostUSD + feeCostUSD;

  return {
    feeCosts,
    feeCostUSD,
    gasCosts,
    gasCostUSD,
    combinedFeesUSD,
  };
};

export const usePriceImpact = (from: RouteExtended | LiFiStep[]) => {
  if (isRouteExtended(from)) {
    return getPriceImpact({
      fromAmount: BigInt(from.fromAmount),
      toAmount: BigInt(from.toAmount),
      fromToken: from.fromToken,
      toToken: from.toToken,
    });
  } else {
    return sum(
      from.map((step) =>
        getPriceImpact({
          fromAmount: BigInt(step.action.fromAmount),
          toAmount: BigInt(step.estimate.toAmount),
          fromToken: step.action.fromToken,
          toToken: step.action.toToken,
        }),
      ),
    );
  }
};

export const useSlippage = (from: RouteExtended | LiFiStep[]) => {
  if (isRouteExtended(from)) {
    return from.steps[0]?.action.slippage;
  }
  return maxBy(map(from, (step) => step.action.slippage));
};

export const useMinReceivedAmount = (from: RouteExtended | LiFiStep[]) => {
  const { toDisplayAmount } = useTokenFormatters();
  const { toDisplayAggregatedAmount } = usePortfolioFormatters();

  if (isRouteExtended(from)) {
    const balance = createTokenBalance(
      createExtendedToken(from.toToken),
      from.toAmountMin,
    );

    return toDisplayAmount(balance, balance.token.symbol, {
      maximumFractionDigits: 6,
    });
  }

  const balances = map(from, (step) => {
    return {
      ...createTokenBalance(
        createExtendedToken(step.action.toToken),
        step.estimate.toAmountMin,
      ),
      amountUSD: 0,
    };
  });

  return toDisplayAggregatedAmount(balances);
};
