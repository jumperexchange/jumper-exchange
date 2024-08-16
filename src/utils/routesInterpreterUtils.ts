import type {
  LiFiStep,
  LiFiStepExtended,
  Route,
  RouteExtended,
} from '@lifi/sdk';
import { TrackingEventParameter } from 'src/const/trackingKeys';
import type { TrackTransactionDataProps } from 'src/types/userTracking';

export const handleTransactionDetails = (
  route: RouteExtended,
  customData: object,
) => {
  const routesData = filterRoutesObject(route);
  const sourceTxHash = getSourceTxHash(route);
  const sourceTxLink = getSourceTxLink(route);
  const type = getRouteType(route);
  const customTransactionData = {
    [TrackingEventParameter.TransactionHash]: sourceTxHash,
    [TrackingEventParameter.TransactionLink]: sourceTxLink,
    [TrackingEventParameter.Type]: type,
    ...customData,
  };

  return {
    ...routesData,
    ...customTransactionData,
  };
};

export const filterRoutesObject = (
  route: RouteExtended | Route,
  // activeTab?: number | boolean,
): TrackTransactionDataProps => {
  const gasCost = getGasFees(route);
  const routeStatus = getRouteStatus(route);
  const action = getAction(route)?.message;
  const type = getRouteType(route);
  const routeData = {
    ...(action && { [TrackingEventParameter.Action]: action }),
    [TrackingEventParameter.RouteId]: route.id,
    [TrackingEventParameter.FromToken]: route.fromToken.address,
    [TrackingEventParameter.IsFinal]: isRouteDone(route),
    [TrackingEventParameter.Type]: type,
    [TrackingEventParameter.Exchange]: 'unknown',
    [TrackingEventParameter.ToToken]: route.toToken.address,
    [TrackingEventParameter.FromChainId]: route.fromChainId,
    [TrackingEventParameter.ToChainId]: route.toChainId,
    [TrackingEventParameter.FromAmount]: route.fromAmount,
    [TrackingEventParameter.FromAmountUSD]: route.fromAmountUSD,
    [TrackingEventParameter.ToAmountUSD]: route.toAmountUSD,
    [TrackingEventParameter.ToAmount]: route.toAmount,
    [TrackingEventParameter.ToAmountMin]: route.toAmountMin,
    [TrackingEventParameter.TransactionStatus]: routeStatus,
    [TrackingEventParameter.GasCost]: gasCost,
    [TrackingEventParameter.GasCostUSD]: route.gasCostUSD,
  };
  let stepData = {};
  let processData = {};

  route.steps.forEach((step: LiFiStep | LiFiStepExtended, index) => {
    stepData = {
      [TrackingEventParameter.RouteId]: step.id,
      [TrackingEventParameter.TransactionId]:
        step.includedSteps[step.includedSteps.length - 1].id,
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
    };

    // Check if the step is of type LiFiStepExtended by checking the presence of the 'execution' property
    const isExtendedStep = 'execution' in step;
    // Determine detailInformation: use 'execution' if it's an extended step, otherwise fall back to 'estimate'
    const detailInformation =
      isExtendedStep && step.execution ? step.execution : step.estimate;
    if ('process' in detailInformation) {
      detailInformation.process.forEach((process) => {
        if (process.status !== 'DONE') {
          processData = {
            [TrackingEventParameter.Exchange]: step.estimate.tool,
            [TrackingEventParameter.ErrorCode]: process.error?.code,
            [TrackingEventParameter.ErrorMessage]: process.error?.message,
            [TrackingEventParameter.TransactionStatus]: process.status,
            [TrackingEventParameter.TransactionHash]: process.txHash,
            [TrackingEventParameter.TransactionLink]: process.txLink,
          };
        }
      });
    }
  });
  return {
    ...routeData,
    ...stepData,
    ...processData,
  } as TrackTransactionDataProps;
};

export const isRouteDone = (route: RouteExtended) => {
  return route.steps.every((step) => step.execution?.status === 'DONE');
};

export const isRouteFailed = (route: RouteExtended) => {
  return route.steps.some((step) => step.execution?.status === 'FAILED');
};

export const getRouteType = (route: RouteExtended) => {
  if (!route) {
    return 'unknown';
  }
  return route.fromChainId !== route.toChainId ? 'CROSS_CHAIN' : 'SWAP';
};

export const getRouteStatus = (route?: RouteExtended) => {
  if (!route) {
    return 'unknown';
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

export const getAction = (route?: RouteExtended) => {
  if (!route) {
    return null;
  } // Return null or a default value if no route is provided.

  for (const step of route.steps) {
    return step.execution?.process.find(
      (process) =>
        process.status === 'PENDING' || process.status === 'ACTION_REQUIRED',
    );
  }

  return null;
};

export const getGasFees = (route?: RouteExtended) => {
  if (!route) {
    return 0;
  }

  return route.steps.reduce((sum, step) => {
    const gasFees = step.execution?.gasCosts || step.estimate?.gasCosts;
    const innerSum =
      gasFees?.reduce((innerSum, innerItem) => {
        return innerSum + parseFloat(innerItem.amount || '0');
      }, 0) || 0;

    // Add the innerSum to the total sum
    return sum + innerSum;
  }, 0);
};
