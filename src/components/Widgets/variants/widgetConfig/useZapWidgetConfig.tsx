import { useMemo } from 'react';
import type { WidgetConfig } from '@lifi/widget';
import { RequiredUI } from '@lifi/widget';
import type { ZapWidgetContext, HookDependencies } from './types';

/**
 * Configuration hook for the zap widget variant
 */
export function useZapWidgetConfig(
  context: ZapWidgetContext,
  deps: HookDependencies,
): Partial<WidgetConfig> {
  return useMemo(() => {
    return {
      // UI configuration
      requiredUI: [RequiredUI.ToAddress],
      keyPrefix: context.keyPrefix ?? 'jumper-custom-zap',

      sdkConfig: {
        routeOptions: {
          allowSwitchChain: false,
        },
      },

      // Additional zap-specific config
      buildUrl: false,
      useRecommendedRoute: true,
      // contractCompactComponent: <></>,

      bridges: {
        allow: ['across', 'relay', 'mayan'],
      },
      // Chain configuration
      chains: {
        allow: context.allowChains,
        from: context.allowFromChains
          ? {
              allow: context.allowFromChains,
            }
          : undefined,
        to: context.allowToChains
          ? { allow: context.allowToChains }
          : undefined,
      },
    };
  }, [
    context.allowChains,
    context.allowFromChains,
    context.allowToChains,
    context.keyPrefix,
  ]);
}
