import type { WidgetConfig } from '@lifi/widget';
import { RequiredUI } from '@lifi/widget';
import { useMemo } from 'react';

import type { HookDependencies, ZapWidgetContext } from './types';

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
          // Needs to be enabled to support multisig wallets
          allowSwitchChain: true,
        },
      },

      // Additional zap-specific config
      buildUrl: false,
      useRecommendedRoute: true,
      // contractCompactComponent: <></>,

      bridges: {
        allow: ['across', 'relaydepository', 'mayan'],
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
