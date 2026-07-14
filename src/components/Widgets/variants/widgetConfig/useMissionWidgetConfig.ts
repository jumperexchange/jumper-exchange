import { useAccount } from '@jumperexchange/wallet-management';
import type { WidgetConfig } from '@jumperexchange/widget';
import { useMemo } from 'react';

import { TaskType } from '@/types/strapi';

import { useMultisig } from '../../../../hooks/useMultisig';
import type { HookDependencies, MissionWidgetContext } from './types';
import { isSupportedChainType } from './utils';

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

    const isSupported = isSupportedChainType(chainType);

    const isZapTask =
      (context.taskType === TaskType.Zap ||
        context.taskType === TaskType.Deposit) &&
      context.subTaskType !== 'withdraw';

    return {
      // Variant configuration
      variant: context.variant ?? 'compact',
      mode: isZapTask ? 'custom' : 'default',
      modeOptions: isZapTask ? { custom: { type: 'deposit' } } : undefined,

      // UI configuration
      hiddenUI: {
        appearance: true,
        language: true,
        poweredBy: true,
        walletMenu: true,
        reverseTokensButton: true,
        history: true,
        ...(isSupported && !isSafe ? { toAddress: true } : {}),
        ...(isZapTask
          ? { lowAddressActivityConfirmation: true, gasRefuelMessage: true }
          : {}),
      },

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

      appearance: deps.theme.widgetTheme.config.appearance,

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
