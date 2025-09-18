import { ConfigOverrideHook } from '../types';
import { useRouteLabels } from '../base/useRouteLabels';

export const useRouteLabelsOverride: ConfigOverrideHook = (ctx) => {
  return useRouteLabels(ctx);
};
