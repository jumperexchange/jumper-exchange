import type { Route, RouteExtended } from '@lifi/sdk';

export const getRouteIdHierarchy = (route: RouteExtended | Route) => {
  return {
    routeId: route.id,
    stepIds: getStepIds(route),
    includedStepIds: getIncludedStepIds(route),
    stepTools: getAllStepTools(route),
    integrator: getIntegrator(route),
    nbOfSteps: route.steps?.length,
  };
};

export const getStepIds = (route: RouteExtended | Route): string[] => {
  return route.steps?.map((step) => step.id);
};

export const getIncludedStepIds = (route: RouteExtended | Route): string[] => {
  const includedStepIds: string[] = [];

  route.steps?.forEach((step) => {
    if (step.includedSteps && step.includedSteps.length > 0) {
      step.includedSteps.forEach((includedStep) => {
        includedStepIds.push(includedStep.id);
      });
    }
  });

  return includedStepIds;
};

export const getAllStepTools = (route: RouteExtended | Route): string[] => {
  return route.steps?.map((step) => step.tool).filter(Boolean);
};

export const getIntegrator = (
  route: RouteExtended | Route,
): string | undefined => {
  return route.steps?.find((step) => step.integrator)?.integrator;
};
