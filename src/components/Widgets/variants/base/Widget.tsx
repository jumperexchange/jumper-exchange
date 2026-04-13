import { LiFiWidget, WidgetSkeleton as LifiWidgetSkeleton } from '@lifi/widget';
import type { FC } from 'react';
import { ClientOnly } from '@/components/ClientOnly';
import { useWidgetConfig } from '../widgetConfig/useWidgetConfig';
import type { WidgetProps } from './Widget.types';

export const Widget: FC<WidgetProps> = ({ ctx, type, formRef }) => {
  const { config, isReady } = useWidgetConfig(type, ctx);

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
