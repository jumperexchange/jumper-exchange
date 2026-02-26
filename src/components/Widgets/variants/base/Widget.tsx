import type { FC } from 'react';
import { LiFiWidget, WidgetSkeleton as LifiWidgetSkeleton } from '@lifi/widget';
import type { WidgetProps } from './Widget.types';
import { useWidgetConfig } from '../widgetConfig/useWidgetConfig';
import { ClientOnly } from '@/components/ClientOnly';

export const Widget: FC<WidgetProps> = ({ ctx, type, formRef, feeConfig }) => {
  const widgetConfig = useWidgetConfig(type, ctx);

  return (
    <ClientOnly fallback={<LifiWidgetSkeleton config={widgetConfig} />}>
      <LiFiWidget
        config={widgetConfig}
        integrator={widgetConfig.integrator}
        formRef={formRef}
        feeConfig={feeConfig}
      />
    </ClientOnly>
  );
};
