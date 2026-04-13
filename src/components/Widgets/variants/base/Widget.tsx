import type { FC } from 'react';
import { useMemo } from 'react';
import { LiFiWidget, WidgetSkeleton as LifiWidgetSkeleton } from '@lifi/widget';
import type { WidgetProps } from './Widget.types';
import { useWidgetConfig } from '../widgetConfig/useWidgetConfig';
import { ClientOnly } from '@/components/ClientOnly';

export const Widget: FC<WidgetProps> = ({ ctx, type, formRef, feeConfig }) => {
  const { config: widgetConfig, isReady } = useWidgetConfig(type, ctx);

  const config = useMemo(
    () => (feeConfig ? { ...widgetConfig, feeConfig } : widgetConfig),
    [widgetConfig, feeConfig],
  );

  return (
    <ClientOnly fallback={<LifiWidgetSkeleton config={config} />}>
      {isReady ? (
        <LiFiWidget
          config={config}
          integrator={config.integrator}
          formRef={formRef}
        />
      ) : (
        <LifiWidgetSkeleton config={config} />
      )}
    </ClientOnly>
  );
};
