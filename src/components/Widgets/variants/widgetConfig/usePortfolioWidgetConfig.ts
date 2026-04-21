import envConfig from '@/config/env-config';
import type { PortfolioPosition } from '@/providers/PortfolioProvider/types';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import { TaskType } from '@/types/strapi';
import type { WidgetConfig } from '@lifi/widget';
import { DisabledUI, HiddenUI } from '@lifi/widget';
import { useMemo } from 'react';
import type { MainWidgetContext, ZapWidgetContext } from './types';
import { useWidgetConfig } from './useWidgetConfig';
import { PortfolioWidgetVariants } from '../portfolio/types';

export interface DepositContractProps {
  toChainId: number;
  toTokenAddress: string;
}

// --- Pure context builders ---

function buildDepositContext(
  opportunity: EarnOpportunityWithLatestAnalytics | null,
  minFromAmountUSD?: number,
): ZapWidgetContext {
  return {
    taskType: TaskType.Zap,
    zapPoolName: opportunity
      ? `${opportunity.protocol.name} ${opportunity.asset.symbol.toUpperCase()} Pool`
      : undefined,
    integrator: envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_EARN,
    keyPrefix: 'zap.backend',
    formData: {
      minFromAmountUSD,
      sourceToken: opportunity
        ? {
            tokenAddress: opportunity.asset.address,
            tokenSymbol: opportunity.asset.symbol,
          }
        : undefined,
      sourceChain: opportunity
        ? {
            chainId: opportunity.asset.chain.chainId.toString(),
            chainKey: opportunity.asset.chain.chainKey,
          }
        : undefined,
    },
  };
}

function buildWithdrawContext(
  position: PortfolioPosition | null,
): ZapWidgetContext {
  const lpToken = position?.lpToken;
  return {
    taskType: TaskType.Zap,
    subTaskType: 'withdraw',
    integrator: envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_EARN,
    keyPrefix: 'zap.backend',
    disabledUI: [DisabledUI.FromToken],
    hiddenUI: [HiddenUI.FromToken],
    formData: {
      sourceToken: lpToken
        ? {
            tokenAddress: lpToken.token.address,
            tokenSymbol: lpToken.token.symbol,
          }
        : undefined,
      sourceChain: lpToken
        ? {
            chainId: lpToken.token.chainId.toString(),
            chainKey: lpToken.token.chain?.chainKey ?? '',
          }
        : undefined,
      destinationChain: lpToken
        ? {
            chainId: lpToken.token.chainId.toString(),
            chainKey: lpToken.token.chain?.chainKey ?? '',
          }
        : undefined,
    },
  };
}

function buildBorrowContext(
  opportunity: EarnOpportunityWithLatestAnalytics | null,
  minFromAmountUSD?: number,
): ZapWidgetContext {
  return {
    taskType: TaskType.Zap,
    subTaskType: 'borrow',
    zapPoolName: opportunity
      ? `${opportunity.protocol.name} ${opportunity.asset.symbol.toUpperCase()} Pool`
      : undefined,
    integrator: envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_BORROW,
    keyPrefix: 'zap.backend',
    formData: {
      minFromAmountUSD,
      sourceToken: opportunity
        ? {
            tokenAddress: opportunity.asset.address,
            tokenSymbol: opportunity.asset.symbol,
          }
        : undefined,
      sourceChain: opportunity
        ? {
            chainId: opportunity.asset.chain.chainId.toString(),
            chainKey: opportunity.asset.chain.chainKey,
          }
        : undefined,
    },
  };
}

function buildSwapBuyContext(
  variant: PortfolioWidgetVariants,
): MainWidgetContext {
  return {
    starterVariant: variant === PortfolioWidgetVariants.Buy ? 'buy' : 'default',
    partnerName: '',
  };
}

// --- Hook ---

interface UsePortfolioWidgetConfigResult {
  config: WidgetConfig;
  depositContractProps: DepositContractProps | null;
}

export function usePortfolioWidgetConfig(
  variant: PortfolioWidgetVariants,
  earnOpportunity: EarnOpportunityWithLatestAnalytics | null,
  position: PortfolioPosition | null,
  minFromAmountUSD?: number,
): UsePortfolioWidgetConfigResult {
  const { widgetType, widgetContext } = useMemo(() => {
    switch (variant) {
      case PortfolioWidgetVariants.Deposit:
        return {
          widgetType: 'zap' as const,
          widgetContext: buildDepositContext(earnOpportunity, minFromAmountUSD),
        };
      case PortfolioWidgetVariants.Withdraw:
        return {
          widgetType: 'zap' as const,
          widgetContext: buildWithdrawContext(position),
        };
      case PortfolioWidgetVariants.Borrow:
        return {
          widgetType: 'zap' as const,
          widgetContext: buildBorrowContext(earnOpportunity, minFromAmountUSD),
        };
      default:
        return {
          widgetType: 'main' as const,
          widgetContext: buildSwapBuyContext(variant),
        };
    }
  }, [variant, earnOpportunity, position, minFromAmountUSD]);

  // Cast needed: TS cannot narrow the conditional type param at call site
  const { config, isReady } = useWidgetConfig(
    widgetType,
    widgetContext as MainWidgetContext & ZapWidgetContext,
  );

  const depositContractProps = useMemo((): DepositContractProps | null => {
    if (
      (variant !== PortfolioWidgetVariants.Deposit &&
        variant !== PortfolioWidgetVariants.Borrow) ||
      !earnOpportunity
    ) {
      return null;
    }
    return {
      toChainId: earnOpportunity.lpToken.chain.chainId,
      toTokenAddress: earnOpportunity.lpToken.address,
    };
  }, [variant, earnOpportunity]);

  return {
    config: {
      ...config,
      theme: {
        ...config.theme,
        container: { width: '100%', minWidth: '100%', maxWidth: '100%' },
      },
    },
    depositContractProps,
  };
}
