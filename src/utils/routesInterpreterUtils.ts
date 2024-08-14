import type { RouteExtended } from '@lifi/sdk';
import { TabsMap } from 'src/const/tabsMap';
import { TrackingEventParameter } from 'src/const/trackingKeys';
import type { TrackTransactionDataProps } from 'src/types/userTracking';

export const getStepData = (
  route: RouteExtended,
  activeTab?: number | boolean,
): TrackTransactionDataProps => {
  let currentStep = {};
  route.steps.forEach((step, index) =>
    step.execution?.process.forEach((process) => {
      const routeStatus = getRouteStatus(route);
      if (process.status !== 'DONE') {
        currentStep = {
          [TrackingEventParameter.RouteId]: step.id,
          [TrackingEventParameter.IsFinal]: false,
          [TrackingEventParameter.Action]: 'execution_updated',
          [TrackingEventParameter.TransactionId]:
            step.includedSteps[step.includedSteps.length - 1].id,
          [TrackingEventParameter.Type]: step.type,
          [TrackingEventParameter.Exchange]: step.tool,
          [TrackingEventParameter.FromToken]: step.action.fromToken.address,
          [TrackingEventParameter.ToToken]: step.action.toToken.address,
          [TrackingEventParameter.FromChainId]: step.action.fromChainId,
          [TrackingEventParameter.Integrator]: step.integrator,
          [TrackingEventParameter.StepNumber]: index + 1,
          [TrackingEventParameter.ToChainId]: step.action.toChainId,
          [TrackingEventParameter.FromAmount]: step.estimate.fromAmount,
          [TrackingEventParameter.FromAmountUSD]: step.estimate.fromAmountUSD,
          [TrackingEventParameter.ToAmount]: step.estimate.toAmount,
          [TrackingEventParameter.ToAmountUSD]: step.estimate.toAmountUSD,
          [TrackingEventParameter.ToAmountMin]: step.estimate.toAmountMin,
          // [TrackingEventParameter.Status]: process.status,
          [TrackingEventParameter.TransactionStatus]:
            routeStatus || process.status,
          [TrackingEventParameter.TransactionHash]: process.txHash || '',
          [TrackingEventParameter.TransactionLink]: process.txLink || '',
          [TrackingEventParameter.GasCost]: -1, //todo fix
          // step.estimate.gasCosts?.reduce(
          //   (accumulator: number, currentValue: any) => {
          //     return accumulator + currentValue.amount;
          //   },
          //   0,
          // )
          [TrackingEventParameter.GasCostUSD]: route.gasCostUSD,
          [TrackingEventParameter.ErrorCode]: process.error?.code || '',
          [TrackingEventParameter.ErrorMessage]: process.error?.message || '',
          [TrackingEventParameter.NonInteraction]: true,
          [TrackingEventParameter.Variant]:
            Object.values(TabsMap).find((el) => el.index === activeTab)
              ?.variant || '',
        };
      }
    }),
  );
  return currentStep as TrackTransactionDataProps;
};

export const isRouteDone = (route: RouteExtended) => {
  return route.steps.every((step) => step.execution?.status === 'DONE');
};

export const isRouteFailed = (route: RouteExtended) => {
  return route.steps.some((step) => step.execution?.status === 'FAILED');
};

export const getRouteStatus = (route?: RouteExtended) => {
  if (!route) {
    return false;
  }
  const isDone = isRouteDone(route);
  const isFailed = isRouteFailed(route);
  const alreadyStarted = route.steps.some((step) => step.execution);
  if (alreadyStarted) {
    if (isFailed) {
      return 'FAILED';
    } else if (isDone) {
      return 'DONE';
    } else {
      return 'PENDING';
    }
  }
};

export const getSourceTxHash = (route?: RouteExtended) => {
  return route?.steps[0].execution?.process
    .filter((process) => process.type !== 'TOKEN_ALLOWANCE')
    .find((process) => process.txHash)?.txHash;
};

export const getSourceTxLink = (route?: RouteExtended) => {
  return route?.steps[0].execution?.process
    .filter((process) => process.type !== 'TOKEN_ALLOWANCE')
    .find((process) => process.txHash)?.txLink;
};
