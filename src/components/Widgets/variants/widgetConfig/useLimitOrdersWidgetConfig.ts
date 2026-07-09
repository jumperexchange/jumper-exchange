import type { WidgetConfig } from '@lifi/widget';
import { useMemo } from 'react';
import envConfig from '@/config/env-config';
import type { HookDependencies, LimitOrdersWidgetContext } from './types';
import { useMainWidgetConfig } from './useMainWidgetConfig';
import { resolveWidgetVariant } from './utils';

/**
 * Configuration hook for the limit orders widget variant
 */
export function useLimitOrdersWidgetConfig(
  context: LimitOrdersWidgetContext,
  deps: HookDependencies,
): Partial<WidgetConfig> {
  const mainConfig = useMainWidgetConfig(
    {
      starterVariant: 'limit',
      resolvedVariant: resolveWidgetVariant('limit', {
        limitOrders: false,
        privateSwaps: false,
      }),
      partnerName: 'default',
      integrator: envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_LIMIT || undefined,
      ...context,
    },
    deps,
  );

  return useMemo(
    () => ({
      ...mainConfig,
      variant: 'compact',
      mode: 'limit',
      buildUrl: true,
      useRelayerRoutes: true,
      hiddenUI: {
        ...mainConfig.hiddenUI,
        history: true,
        appearance: true,
      },
    }),
    [mainConfig],
  );
}
