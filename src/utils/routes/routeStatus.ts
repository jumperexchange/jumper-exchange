import type { RouteExtended } from '@lifi/sdk';

export const getRouteType = (route: RouteExtended) => {
  if (!route) {
    return 'unknown';
  }
  return route.fromChainId !== route.toChainId ? 'CROSS_CHAIN' : 'SWAP';
};

export enum RouteStatus {
  DONE = 'DONE',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  UNKNOWN = 'UNKNOWN',
}

export const getRouteStatus = (route?: RouteExtended) => {
  if (!route) {
    return RouteStatus.UNKNOWN;
  }

  let status = RouteStatus.UNKNOWN;
  let hasExecution = false;

  for (const step of route.steps || []) {
    if (step.execution) {
      hasExecution = true;

      if (step.execution.status === RouteStatus.FAILED) {
        return RouteStatus.FAILED;
      }

      if (step.execution.status === RouteStatus.DONE) {
        status = RouteStatus.DONE;
      } else {
        status = RouteStatus.PENDING;
      }
    }
  }

  return hasExecution ? status : RouteStatus.UNKNOWN;
};
