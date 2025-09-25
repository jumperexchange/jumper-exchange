import { useMemo } from 'react';
import { WidgetConfig, HiddenUI } from '@lifi/widget';
import { TaskType } from 'src/types/strapi';
import { MissionWidgetContext, HookDependencies } from './types';

/**
 * Configuration hook for the mission widget variant
 */
export function useMissionWidgetConfig(
  context: MissionWidgetContext,
  deps: HookDependencies,
): Partial<WidgetConfig> {
  return useMemo(() => {
    const isZapTask =
      context.taskType === TaskType.Zap ||
      context.taskType === TaskType.Deposit;

    return {
      // Variant configuration
      variant: context.variant ?? 'compact',
      subvariant: isZapTask ? 'custom' : 'default',
      subvariantOptions: isZapTask ? { custom: 'deposit' } : undefined,

      // UI configuration
      hiddenUI: [
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
        HiddenUI.ToAddress,
        HiddenUI.ReverseTokensButton,
        HiddenUI.History,
        ...(isZapTask
          ? [HiddenUI.LowAddressActivityConfirmation, HiddenUI.GasRefuelMessage]
          : []),
      ],

      // Theme configuration
      theme: {
        ...deps.theme.widgetTheme.config.theme,
        container: {
          maxHeight: '100%',
          maxWidth: 'unset',
          borderRadius: 24,
          boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
        },
        header: {
          whiteSpace: 'break-spaces !important',
        },
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

      // Bridge and exchange configuration
      bridges: context.allowBridge
        ? { allow: [context.allowBridge] }
        : undefined,
      exchanges: context.allowExchange
        ? { allow: [context.allowExchange] }
        : undefined,
    };
  }, [
    context.integrator,
    context.taskType,
    context.allowChains,
    context.allowToChains,
    context.allowBridge,
    context.allowExchange,
    deps.theme,
  ]);
}
