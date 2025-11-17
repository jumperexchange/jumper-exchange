import { useMemo } from 'react';
import merge from 'lodash/merge';
import type { WidgetConfig } from '@lifi/widget';
import type {
  WidgetType,
  MainWidgetContext,
  MissionWidgetContext,
  ZapWidgetContext,
} from './types';
import { WidgetContext } from './types';
import { useWidgetDependencies } from './useWidgetDependencies';
import {
  useSharedRPCConfig,
  useSharedFormConfig,
  useLanguageConfig,
  useSharedBaseConfig,
} from './useSharedConfigs';
import { useMainWidgetConfig } from './useMainWidgetConfig';
import { useMissionWidgetConfig } from './useMissionWidgetConfig';
import { useZapWidgetConfig } from './useZapWidgetConfig';

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
): WidgetConfig {
  const deps = useWidgetDependencies();
  const sharedBase = useSharedBaseConfig(context, deps);
  const sharedRPC = useSharedRPCConfig();
  const sharedForm = useSharedFormConfig(context.formData);

  // Language configuration
  const language = useLanguageConfig(
    {
      useMainWidget: type === 'main',
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
  }, [mainWidgetConfig, missionWidgetConfig, zapWidgetConfig]);

  // Merge all configurations
  return useMemo(() => {
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
      return merge(baseConfig, {
        theme: context.theme,
      });
    }

    return baseConfig;
  }, [
    sharedBase,
    sharedRPC,
    sharedForm,
    language,
    widgetSpecific,
    context.theme,
  ]);
}
