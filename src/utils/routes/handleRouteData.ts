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

  const routeData = {
    [TrackingEventParameter.FromAmount]: route.fromAmount,
    [TrackingEventParameter.FromAmountUSD]: route.fromAmountUSD,
    [TrackingEventParameter.FromChainId]: route.fromChainId,
    [TrackingEventParameter.FromToken]: route.fromToken.address,
    [TrackingEventParameter.IsFinal]: isFinal,
    [TrackingEventParameter.NbOfSteps]: nbOfSteps,
    [TrackingEventParameter.RouteId]: routeId,
    [TrackingEventParameter.Slippage]: priceImpact,
    [TrackingEventParameter.StepIds]: stepIds.join(','),
    [TrackingEventParameter.ToAmount]: toAmount,
    [TrackingEventParameter.ToAmountFormatted]: toAmountFormatted,
    [TrackingEventParameter.ToAmountMin]: route.toAmountMin,
    [TrackingEventParameter.ToAmountUSD]: toAmountUSD,
    [TrackingEventParameter.ToChainId]: route.toChainId,
    [TrackingEventParameter.ToToken]: route.toToken.address,
    [TrackingEventParameter.TransactionStatus]: routeStatus || '',
    [TrackingEventParameter.Type]: type,
    ...(duration && { [TrackingEventParameter.Time]: duration }),
    ...(Array.isArray(route.tags) &&
      route.tags.length > 0 && {
        [TrackingEventParameter.Tags]: route.tags.join(','),
      }),
    ...(Array.isArray(includedStepIds) &&
      includedStepIds.length > 0 && {
        [TrackingEventParameter.TransactionId]: includedStepIds.join(','),
      }),
    ...(Array.isArray(stepTools) &&
      stepTools.length > 0 && {
        [TrackingEventParameter.Steps]: stepTools.join(','),
      }),
    ...(integrator && { [TrackingEventParameter.Integrator]: integrator }),
    ...(gasCost && { [TrackingEventParameter.GasCost]: gasCost }),
    ...(gasCostFormatted && {
      [TrackingEventParameter.GasCostFormatted]: gasCostFormatted,
    }),
    ...(gasCostUSD && { [TrackingEventParameter.GasCostUSD]: gasCostUSD }),
    ...(feeCost && { [TrackingEventParameter.FeeCost]: feeCost }),
    ...(feeCostFormatted && {
      [TrackingEventParameter.FeeCostFormatted]: feeCostFormatted,
    }),
    ...(feeCostUSD && { [TrackingEventParameter.FeeCostUSD]: feeCostUSD }),
  };

  const processData = getProcessInformation(route);

  return {
    ...routeData,
    ...processData,
    ...customData,
  } as TrackTransactionDataProps;
};
