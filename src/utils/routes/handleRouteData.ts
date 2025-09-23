import { Route, RouteExtended } from '@lifi/sdk';
import { TrackingEventParameter } from 'src/const/trackingKeys';
import type { TrackTransactionDataProps } from 'src/types/userTracking';
import { calcPriceImpact, getToAmountData } from './routeAmounts';
import { getGasAndFeeCosts } from './routeCosts';
import { getRouteIdHierarchy } from './routeDataProcessor';
import { getProcessInformation } from './routeProcess';
import { getRouteStatus, getRouteType } from './routeStatus';

export const handleRouteData = (
  route: Route | RouteExtended,
  customData?: object,
): TrackTransactionDataProps => {
  const {
    routeId,
    stepIds,
    includedStepIds,
    stepTools,
    nbOfSteps,
    integrator,
  } = getRouteIdHierarchy(route);
  const {
    gasCostUSD,
    gasCost,
    gasCostFormatted,
    feeCostUSD,
    feeCost,
    feeCostFormatted,
  } = getGasAndFeeCosts(route);
  const routeStatus = getRouteStatus(route);
  const type = getRouteType(route);
  const isFinal = routeStatus === 'DONE';
  const { toAmount, toAmountUSD, toAmountFormatted } = getToAmountData(route);
  const duration = route.steps?.reduce(
    (acc, step) => acc + step.estimate.executionDuration,
    0,
  );
  const priceImpact = calcPriceImpact(route);

  // Note(laurent): the rest of this function code was reworked to fix type issues,
  // it was producing incorrect types. There are too many checks according to types,
  // For example we're checking that stepTools is an array despite the type being
  // `string[]` already. I'm keeping these checks as is, in case runtime types are different.
  let steps = 'missing';
  if (Array.isArray(stepTools) && stepTools.length > 0) {
    steps = stepTools.join(',');
  }

  let transactionId = 'missing';
  if (Array.isArray(includedStepIds) && includedStepIds.length > 0) {
    transactionId = includedStepIds.join(',');
  }

  const routeData: TrackTransactionDataProps = {
    [TrackingEventParameter.FromAmount]: route.fromAmount,
    [TrackingEventParameter.FromAmountUSD]: route.fromAmountUSD,
    [TrackingEventParameter.FromChainId]: route.fromChainId,
    [TrackingEventParameter.FromToken]: route.fromToken.address,
    [TrackingEventParameter.IsFinal]: isFinal,
    [TrackingEventParameter.NbOfSteps]: nbOfSteps,
    [TrackingEventParameter.RouteId]: routeId,
    [TrackingEventParameter.Slippage]: priceImpact,
    [TrackingEventParameter.StepIds]: stepIds.join(','),
    [TrackingEventParameter.Steps]: steps,
    [TrackingEventParameter.Time]: duration || -1,
    [TrackingEventParameter.ToAmount]: toAmount,
    [TrackingEventParameter.ToAmountFormatted]: toAmountFormatted,
    [TrackingEventParameter.ToAmountMin]: route.toAmountMin,
    [TrackingEventParameter.ToAmountUSD]: toAmountUSD,
    [TrackingEventParameter.ToChainId]: route.toChainId,
    [TrackingEventParameter.ToToken]: route.toToken.address,
    [TrackingEventParameter.TransactionId]: transactionId,
    [TrackingEventParameter.TransactionStatus]: routeStatus || '',
    [TrackingEventParameter.Type]: type,
  };

  if (Array.isArray(route.tags) && route.tags.length > 0) {
    routeData[TrackingEventParameter.Tags] = route.tags.join(',');
  }

  if (integrator) {
    routeData[TrackingEventParameter.Integrator] = integrator;
  }

  if (gasCost) {
    routeData[TrackingEventParameter.GasCost] = gasCost;
  }

  if (gasCostFormatted) {
    routeData[TrackingEventParameter.GasCostFormatted] = gasCostFormatted;
  }

  const gasCostUSDNumber = Number(gasCostUSD);
  if (!isNaN(gasCostUSDNumber)) {
    routeData[TrackingEventParameter.GasCostUSD] = gasCostUSDNumber;
  }

  if (feeCost) {
    routeData[TrackingEventParameter.FeeCost] = feeCost;
  }

  if (feeCostFormatted) {
    routeData[TrackingEventParameter.FeeCostFormatted] = feeCostFormatted;
  }

  if (feeCostUSD) {
    routeData[TrackingEventParameter.FeeCostUSD] = feeCostUSD;
  }

  const processData = getProcessInformation(route);

  return {
    ...routeData,
    ...processData,
    ...customData,
  };
};
