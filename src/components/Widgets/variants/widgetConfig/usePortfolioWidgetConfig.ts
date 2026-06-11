import envConfig from '@/config/env-config';
import type { PortfolioPosition } from '@/providers/PortfolioProvider/types';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import { TaskType } from '@/types/strapi';
import type { WidgetConfig } from '@lifi/widget';
import merge from 'lodash/merge';
import { useMemo } from 'react';
import type {
  MainWidgetContext,
  ZapWidgetContext,
  HookDependencies,
} from './types';
import { useWidgetConfig } from './useWidgetConfig';
import { PortfolioWidgetVariants } from '../portfolio/types';
import { useTranslation } from 'react-i18next';

export interface DepositContractProps {
  toChainId: number;
  toTokenAddress: string;
}

// --- Pure context builders ---

function buildDepositContext(
  opportunity: EarnOpportunityWithLatestAnalytics | null,
  minFromAmountUSD?: number,
): ZapWidgetContext {
  const lpToken = opportunity?.lpToken;
  const assetToken = opportunity?.asset;
  return {
    taskType: TaskType.Zap,
    zapPoolName: opportunity
      ? `${opportunity.protocol.name} ${opportunity.asset.symbol.toUpperCase()} Pool`
      : undefined,
    integrator: envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_EARN,
    keyPrefix: 'zap.backend',
    formData: {
      minFromAmountUSD,
      sourceToken: assetToken
        ? {
            tokenAddress: assetToken.address,
            tokenSymbol: assetToken.symbol,
          }
        : undefined,
      sourceChain: assetToken
        ? {
            chainId: assetToken.chain.chainId.toString(),
            chainKey: assetToken.chain.chainKey,
          }
        : undefined,
      destinationToken: lpToken
        ? {
            tokenAddress: lpToken.address,
            tokenSymbol: lpToken.symbol,
          }
        : undefined,
      destinationChain: lpToken
        ? {
            chainId: lpToken.chain.chainId.toString(),
            chainKey: lpToken.chain?.chainKey ?? '',
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
    disabledUI: { fromToken: true },
    hiddenUI: { fromToken: true },
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

function buildSwapBuyContext(
  variant: PortfolioWidgetVariants,
): MainWidgetContext {
  return {
    starterVariant: variant === PortfolioWidgetVariants.Buy ? 'buy' : 'default',
    partnerName: '',
  };
}

type PortfolioButtonLabels = {
  exchange: string;
  swap: string;
  bridge: string;
  buy: string;
  deposit: string;
  depositReview: string;
  swapReview: string;
  bridgeReview: string;
  checkoutReview: string;
  startSwapping: string;
  startBridging: string;
};

function createPortfolioButtonLabels(label: string): PortfolioButtonLabels {
  return {
    exchange: label,
    swap: label,
    bridge: label,
    buy: label,
    deposit: label,
    depositReview: label,
    swapReview: label,
    bridgeReview: label,
    checkoutReview: label,
    startSwapping: label,
    startBridging: label,
  };
}

function getPortfolioButtonLabels(
  variant: PortfolioWidgetVariants,
  t: HookDependencies['translation']['t'],
): PortfolioButtonLabels | undefined {
  switch (variant) {
    case PortfolioWidgetVariants.Deposit:
      return createPortfolioButtonLabels(t('buttons.deposit'));
    case PortfolioWidgetVariants.Withdraw:
      return createPortfolioButtonLabels(t('buttons.withdraw'));
    case PortfolioWidgetVariants.Swap:
      return createPortfolioButtonLabels(t('buttons.swap'));
    case PortfolioWidgetVariants.Buy:
      return createPortfolioButtonLabels(t('buttons.buy'));
    default:
      return undefined;
  }
}

// --- Hook ---

interface UsePortfolioWidgetConfigResult {
  config: WidgetConfig;
  depositContractProps: DepositContractProps | null;
  isReady: boolean;
}

export function usePortfolioWidgetConfig(
  variant: PortfolioWidgetVariants,
  earnOpportunity: EarnOpportunityWithLatestAnalytics | null,
  position: PortfolioPosition | null,
  minFromAmountUSD?: number,
): UsePortfolioWidgetConfigResult {
  const { t } = useTranslation();

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
      default:
        return {
          widgetType: 'main' as const,
          widgetContext: buildSwapBuyContext(variant),
        };
    }
  }, [variant, earnOpportunity, position, minFromAmountUSD]);

  const { config, isReady } = useWidgetConfig(widgetType, widgetContext);

  const depositContractProps = useMemo((): DepositContractProps | null => {
    if (variant !== PortfolioWidgetVariants.Deposit || !earnOpportunity) {
      return null;
    }
    return {
      toChainId: earnOpportunity.lpToken.chain.chainId,
      toTokenAddress: earnOpportunity.lpToken.address,
    };
  }, [variant, earnOpportunity]);

  const buttonLabels = getPortfolioButtonLabels(variant, t);

  return {
    config: {
      ...config,
      theme: {
        ...config.theme,
        container: { width: '100%', minWidth: '100%', maxWidth: '100%' },
      },
      ...(buttonLabels && {
        languageResources: {
          ...config.languageResources,
          en: merge({}, config.languageResources?.en, {
            button: buttonLabels,
          }),
        },
      }),
    },
    depositContractProps,
    isReady,
  };
}
