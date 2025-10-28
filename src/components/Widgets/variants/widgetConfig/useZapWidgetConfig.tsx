import { useMemo } from 'react';
import { WidgetConfig, RequiredUI } from '@lifi/widget';
import { ZapWidgetContext, HookDependencies } from './types';

const BICONOMY_EXPLORER_URL = 'https://meescan.biconomy.io';
const BICONOMY_EXPLORER_TX_PATH = 'details';
const BICONOMY_EXPLORER_ADDRESS_PATH = 'address';

/**
 * Configuration hook for the zap widget variant
 */
export function useZapWidgetConfig(
  context: ZapWidgetContext,
  deps: HookDependencies,
): Partial<WidgetConfig> {
  return useMemo(() => {
    const explorerConfig = [
      {
        url: BICONOMY_EXPLORER_URL,
        txPath: BICONOMY_EXPLORER_TX_PATH,
        addressPath: BICONOMY_EXPLORER_ADDRESS_PATH,
      },
    ];

    const explorerChainIds = ['internal'];
    const explorerUrls = explorerChainIds.reduce(
      (acc, id) => {
        acc[String(id)] = explorerConfig;
        return acc;
      },
      {} as Record<string, typeof explorerConfig>,
    );

    return {
      // UI configuration
      requiredUI: [RequiredUI.ToAddress],
      keyPrefix: context.keyPrefix ?? 'jumper-custom-zap',

      // Explorer configuration
      explorerUrls,

      sdkConfig: {
        routeOptions: {
          allowSwitchChain: false,
        },
      },

      // Additional zap-specific config
      buildUrl: true,
      useRecommendedRoute: true,
      // contractCompactComponent: <></>,

      bridges: {
        allow: ['across', 'relay'],
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
  }, [context.allowChains, context.allowToChains, context.keyPrefix]);
}
