import { useAccount } from '@lifi/wallet-management';
import type { WidgetConfig } from '@lifi/widget';
import { ChainType, HiddenUI } from '@lifi/widget';
import { useMemo } from 'react';

import { TaskType } from '@/types/strapi';

import { useMultisig } from '../../../../hooks/useMultisig';
import type { HookDependencies, MissionWidgetContext } from './types';

/**
 * Configuration hook for the mission widget variant
 */
export function useMissionWidgetConfig(
  context: MissionWidgetContext,
  deps: HookDependencies,
): Partial<WidgetConfig> {
  const { account } = useAccount();
  const { isSafe } = useMultisig();
  return useMemo(() => {
    const chainType = account?.chainType;
    const isEvmWallet = chainType === ChainType.EVM;

    const isZapTask =
      (context.taskType === TaskType.Zap ||
        context.taskType === TaskType.Deposit) &&
      context.subTaskType !== 'withdraw';

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
        HiddenUI.ReverseTokensButton,
        HiddenUI.History,
        ...(isEvmWallet && !isSafe ? [HiddenUI.ToAddress] : []),
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
