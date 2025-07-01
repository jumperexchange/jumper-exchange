'use client';

import { useMemo } from 'react';
import {
  useBaseWidgetConfig,
  useSubVariantWidgetConfig,
  useBaseRPCWidgetConfig,
  useBaseFormWidgetConfig,
} from '../../hooks';
import { LiFiWidget } from '@lifi/widget';

export const BaseWidget = () => {
  const baseConfig = useBaseWidgetConfig();
  const subVariantConfig = useSubVariantWidgetConfig();
  const baseRpcConfig = useBaseRPCWidgetConfig();
  const formConfig = useBaseFormWidgetConfig();

  const config = useMemo(() => {
    return {
      ...baseConfig,
      ...subVariantConfig,
      ...baseRpcConfig,
      ...formConfig,
    };
  }, [baseConfig, subVariantConfig, baseRpcConfig, formConfig]);

  return <LiFiWidget config={config} integrator={config.integrator} />;
};
