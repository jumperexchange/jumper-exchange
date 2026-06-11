import type { FC } from 'react';
import { LiFiWidget, WidgetSkeleton as LifiWidgetSkeleton } from '@lifi/widget';
import type { WidgetProps } from './Widget.types';
import { useWidgetConfig } from '../widgetConfig/useWidgetConfig';
import { ClientOnly } from '@/components/ClientOnly';

export const Widget: FC<WidgetProps> = ({ ctx, type, formRef, isLoading }) => {
  const { config, isReady } = useWidgetConfig(type, ctx);

  return (
    <ClientOnly fallback={<LifiWidgetSkeleton config={config} />}>
      {isReady && !isLoading ? (
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
