import { useAccount } from '@jumperexchange/wallet-management';
import { ChainType, type WidgetConfig } from '@jumperexchange/widget';
import merge from 'lodash/merge';
import { useMemo } from 'react';
import { useActiveNavigationTab } from '@/hooks/useActiveNavigationTab';
import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';
import type {
  LimitOrdersWidgetContext,
  MainWidgetContext,
  MissionWidgetContext,
  WidgetType,
  ZapWidgetContext,
} from './types';
import { useMainWidgetConfig } from './useMainWidgetConfig';
import { useMissionWidgetConfig } from './useMissionWidgetConfig';
import {
  useLanguageConfig,
  useSharedBaseConfig,
  useSharedFormConfig,
  useSharedRPCConfig,
} from './useSharedConfigs';
import { useWidgetDependencies } from './useWidgetDependencies';
import { useLimitOrdersWidgetConfig } from './useLimitOrdersWidgetConfig';
import { useZapWidgetConfig } from './useZapWidgetConfig';
import { resolveActiveNavigationTab } from './utils';

/**
 * Main widget configuration hook that orchestrates all configuration logic
 */
export function useWidgetConfig<T extends WidgetType>(
  type: T,
  context: T extends 'main'
    ? MainWidgetContext
    : T extends 'mission'
      ? MissionWidgetContext
      : T extends 'zap'
        ? ZapWidgetContext
        : LimitOrdersWidgetContext,
): { config: WidgetConfig; isReady: boolean } {
  const globalActiveNavigationTab = useActiveNavigationTab();
  const resolvedVariant = (context as MainWidgetContext).resolvedVariant;
  const activeTabKey = resolveActiveNavigationTab({
    type,
    resolvedVariant,
    globalActiveNavigationTab,
  });
  const isPrivateTabActive =
    activeTabKey === 'private' || resolvedVariant?.key === 'private';
  const isLimitTabActive =
    activeTabKey === 'limit' ||
    resolvedVariant?.key === 'limit' ||
    type === 'limit';

  const deps = useWidgetDependencies();
  const sharedBase = useSharedBaseConfig(context, deps);
  const sharedRPC = useSharedRPCConfig({
    isPrivateVariant: isPrivateTabActive,
    isLimitVariant: isLimitTabActive,
  });

  const sharedForm = useSharedFormConfig(context.formData);
  const { account } = useAccount();
  const priceImpactABTest = useABTest({
    feature: AB_TEST_NAME.A_B_TEST_PRICE_IMPACT_DISPLAY,
    address: account?.address ?? '',
  });

  const tradeABTest = useABTest({
    feature: AB_TEST_NAME.A_B_TEST_TRADE_DISPLAY,
    address: account?.address ?? '',
  });

  // Language configuration
  const language = useLanguageConfig(
    {
      useMainWidget: type === 'main',
      useLimitOrdersWidget: type === 'limit' || isLimitTabActive,
      useSwapBridgeTitle: tradeABTest.isEnabled && tradeABTest.value === 'test',
      usePrivateWidget: isPrivateTabActive,
      ...context,
    },
    deps,
  );

  const mainWidgetConfig = useMainWidgetConfig(
    context as MainWidgetContext,
    deps,
    activeTabKey,
  );
  const missionWidgetConfig = useMissionWidgetConfig(
    context as MissionWidgetContext,
    deps,
  );
  const zapWidgetConfig = useZapWidgetConfig(context as ZapWidgetContext, deps);
  const limitOrdersWidgetConfig = useLimitOrdersWidgetConfig(
    context as LimitOrdersWidgetContext,
    deps,
  );

  const widgetSpecific = useMemo(() => {
    switch (type) {
      case 'main':
        return mainWidgetConfig;
      case 'mission':
        return missionWidgetConfig;
      case 'zap':
        return merge({}, missionWidgetConfig, zapWidgetConfig);
      case 'limit':
        return limitOrdersWidgetConfig;
      default:
        throw new Error(`Unknown widget type: ${type}`);
    }
  }, [
    mainWidgetConfig,
    missionWidgetConfig,
    zapWidgetConfig,
    limitOrdersWidgetConfig,
    type,
  ]);

  // Merge all configurations
  const config = useMemo(() => {
    const baseConfig = merge(
      {},
      sharedBase,
      sharedRPC,
      sharedForm,
      language,
      widgetSpecific,
    ) as WidgetConfig;

    // Apply theme overrides if provided
    if (context.theme) {
      merge(baseConfig, {
        theme: context.theme,
      });
    }

    if (context.disabledUI) {
      baseConfig.disabledUI = {
        ...(baseConfig.disabledUI ?? {}),
        ...context.disabledUI,
      };
    }

    if (context.hiddenUI) {
      baseConfig.hiddenUI = {
        ...(baseConfig.hiddenUI ?? {}),
        ...context.hiddenUI,
      };
    }

    if (priceImpactABTest.isEnabled && priceImpactABTest.value === 'test') {
      baseConfig.hiddenUI = {
        ...(baseConfig.hiddenUI ?? {}),
        routeCardPriceImpact: true,
      };
    }

    return baseConfig;
  }, [
    sharedBase,
    sharedRPC,
    sharedForm,
    language,
    widgetSpecific,
    context.theme,
    context.disabledUI,
    context.hiddenUI,
    priceImpactABTest.isEnabled,
    priceImpactABTest.value,
  ]);

  return {
    config,
    isReady: !tradeABTest.isLoading && !priceImpactABTest.isLoading,
  };
}
