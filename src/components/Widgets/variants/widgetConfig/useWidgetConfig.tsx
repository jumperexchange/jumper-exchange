import { useAccount } from '@lifi/wallet-management';
import { ChainType, HiddenUI, type WidgetConfig } from '@lifi/widget';
import merge from 'lodash/merge';
import { useMemo } from 'react';
import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';
import type {
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
import { useZapWidgetConfig } from './useZapWidgetConfig';
import FeeContribution from '../../FeeContribution/FeeContribution';

/**
 * Main widget configuration hook that orchestrates all configuration logic
 */
export function useWidgetConfig<T extends WidgetType>(
  type: T,
  context: T extends 'main'
    ? MainWidgetContext
    : T extends 'mission'
      ? MissionWidgetContext
      : ZapWidgetContext,
): { config: WidgetConfig; isReady: boolean } {
  const deps = useWidgetDependencies();
  const sharedBase = useSharedBaseConfig(context, deps);
  const sharedRPC = useSharedRPCConfig();
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

  const feeContributionABTest = useABTest({
    feature: AB_TEST_NAME.A_B_TEST_FEE_CONTRIBUTION_DISPLAY,
    address: account?.address ?? '',
  });

  // Language configuration
  const language = useLanguageConfig(
    {
      useMainWidget: type === 'main',
      useSwapBridgeTitle: tradeABTest.isEnabled && tradeABTest.value === 'test',
      ...context,
    },
    deps,
  );

  const mainWidgetConfig = useMainWidgetConfig(
    context as MainWidgetContext,
    deps,
  );
  const missionWidgetConfig = useMissionWidgetConfig(
    context as MissionWidgetContext,
    deps,
  );
  const zapWidgetConfig = useZapWidgetConfig(context as ZapWidgetContext, deps);

  // Widget-specific configuration
  const widgetSpecific = useMemo(() => {
    switch (type) {
      case 'main':
        return mainWidgetConfig;
      case 'mission':
        return missionWidgetConfig;
      case 'zap':
        // For zap widgets, we use both mission and zap configurations
        return merge({}, missionWidgetConfig, zapWidgetConfig);
      default:
        throw new Error(`Unknown widget type: ${type}`);
    }
  }, [mainWidgetConfig, missionWidgetConfig, zapWidgetConfig, type]);

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
      baseConfig.disabledUI = [
        ...(baseConfig.disabledUI ?? []),
        ...context.disabledUI,
      ];
    }

    if (context.hiddenUI) {
      baseConfig.hiddenUI = [
        ...(baseConfig.hiddenUI ?? []),
        ...context.hiddenUI,
      ];
    }

    if (priceImpactABTest.isEnabled && priceImpactABTest.value === 'test') {
      baseConfig.hiddenUI = [
        ...(baseConfig.hiddenUI ?? []),
        HiddenUI.RouteCardPriceImpact,
      ];
    }

    if (
      type === 'main' &&
      feeContributionABTest.isEnabled &&
      feeContributionABTest.value
    ) {
      baseConfig.feeConfig = {
        _vcComponent: () => (
          <FeeContribution translationFn={deps.translation.t} />
        ),
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
    deps.translation.t,
    priceImpactABTest.isEnabled,
    priceImpactABTest.value,
    type,
    feeContributionABTest.isEnabled,
    feeContributionABTest.value,
  ]);

  return {
    config,
    isReady:
      !tradeABTest.isLoading &&
      !priceImpactABTest.isLoading &&
      !feeContributionABTest.isLoading,
  };
}
