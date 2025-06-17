import type { RouteExtended } from '@lifi/sdk';

export enum RouteStatus {
  DONE = 'DONE',
  FAILED = 'FAILED',
}

export const isRouteStatus = (route: RouteExtended, status: RouteStatus) => {
  switch (status) {
    case RouteStatus.DONE:
      return route.steps.every((step) => step.execution?.status === 'DONE');
    case RouteStatus.FAILED:
      return route.steps.some((step) => step.execution?.status === 'FAILED');
    default:
      return false;
  }
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
  const isDone = isRouteStatus(route, RouteStatus.DONE);
  const isFailed = isRouteStatus(route, RouteStatus.FAILED);
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
