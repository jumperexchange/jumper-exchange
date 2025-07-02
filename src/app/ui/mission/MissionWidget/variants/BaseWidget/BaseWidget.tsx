'use client';

import { useMemo } from 'react';
import {
  useBaseWidgetConfig,
  useSubVariantWidgetConfig,
  useBaseRPCWidgetConfig,
  useBaseFormWidgetConfig,
  useLanguageResourcesWidgetConfig,
} from '../../hooks';
import { LiFiWidget } from '@lifi/widget';

export const BaseWidget = () => {
  const baseConfig = useBaseWidgetConfig();
  const subVariantConfig = useSubVariantWidgetConfig();
  const baseRpcConfig = useBaseRPCWidgetConfig();
  const formConfig = useBaseFormWidgetConfig();
  const languageConfig = useLanguageResourcesWidgetConfig();

  const config = useMemo(() => {
    return {
      ...baseConfig,
      ...subVariantConfig,
      ...baseRpcConfig,
      ...formConfig,
      ...languageConfig,
    };
  }, [baseConfig, subVariantConfig, baseRpcConfig, formConfig, languageConfig]);

  return <LiFiWidget config={config} integrator={config.integrator} />;
};
