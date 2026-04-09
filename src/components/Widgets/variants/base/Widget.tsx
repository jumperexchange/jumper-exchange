import { LiFiWidget, WidgetSkeleton as LifiWidgetSkeleton } from '@lifi/widget';
import type { FC } from 'react';
import { useMemo } from 'react';
import { ClientOnly } from '@/components/ClientOnly';
import { useWidgetConfig } from '../widgetConfig/useWidgetConfig';
import type { WidgetProps } from './Widget.types';

export const Widget: FC<WidgetProps> = ({ ctx, type, formRef, feeConfig }) => {
  const widgetConfig = useWidgetConfig(type, ctx);

  const config = useMemo(
    () => (feeConfig ? { ...widgetConfig, feeConfig } : widgetConfig),
    [widgetConfig, feeConfig],
  );

  return (
    <ClientOnly fallback={<LifiWidgetSkeleton config={config} />}>
      <LiFiWidget
        config={config}
        integrator={config.integrator}
        formRef={formRef}
      />
    </ClientOnly>
  );
};
