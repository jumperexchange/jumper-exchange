import type { WidgetConfig } from '@jumperexchange/widget';
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
        widgetAdvanced: false,
      }),
      partnerName: 'default',
      integrator: envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_ADVANCED || undefined,
      ...context,
    },
    deps,
  );

  return useMemo(
    () => ({
      ...mainConfig,
      variant: 'compact',
      mode: 'limit',
      buildUrl: false,
      useRelayerRoutes: true,
      hiddenUI: {
        ...mainConfig.hiddenUI,
        history: true,
        appearance: true,
      },
      exchanges: context.allowExchange
        ? { allow: [context.allowExchange] }
        : mainConfig.exchanges,
    }),
    [mainConfig, context.allowExchange],
  );
}
