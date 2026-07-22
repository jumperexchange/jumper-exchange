import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import {
  LiFiWidget,
  WidgetSkeleton as LifiWidgetSkeleton,
} from '@jumperexchange/widget';
import type { WidgetProps } from './Widget.types';
import { useWidgetConfig } from '../widgetConfig/useWidgetConfig';
import { ClientOnly } from '@/components/ClientOnly';

export const Widget: FC<WidgetProps> = ({
  ctx,
  type,
  formRef,
  isLoading,
  onFormReady,
}) => {
  const { config, isReady } = useWidgetConfig(type, ctx);
  const showWidget = isReady && !isLoading;
  const onFormReadyRef = useRef(onFormReady);
  onFormReadyRef.current = onFormReady;

  useEffect(() => {
    if (!showWidget) {
      return;
    }
    onFormReadyRef.current?.();
  }, [showWidget]);

  return (
    <ClientOnly fallback={<LifiWidgetSkeleton config={config} />}>
      {showWidget ? (
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
