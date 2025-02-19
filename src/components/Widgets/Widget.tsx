'use client';
import { ClientOnly } from '@/components/ClientOnly';
import type { FormState } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton as LifiWidgetSkeleton } from '@lifi/widget';
import { useRef } from 'react';
import { useWelcomeScreen } from 'src/hooks/useWelcomeScreen';
import { useWidgetConfig } from 'src/hooks/useWidgetConfig';
import { WidgetWrapper } from '.';
import type { WidgetProps } from './Widget.types';

export function Widget({
  starterVariant,
  fromChain,
  fromToken,
  toChain,
  toToken,
  fromAmount,
  allowChains,
  allowToChains,
  widgetIntegrator,
  activeTheme,
  autoHeight,
}: WidgetProps) {
  const formRef = useRef<FormState>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const config = useWidgetConfig({
    starterVariant,
    fromChain,
    fromToken,
    toChain,
    toToken,
    fromAmount,
    allowChains,
    widgetIntegrator,
    allowToChains,
  });
  const { welcomeScreenClosed, enabled } = useWelcomeScreen(activeTheme);

  return (
    <WidgetWrapper
      ref={wrapperRef}
      className="widget-wrapper"
      welcomeScreenClosed={welcomeScreenClosed || !enabled}
      autoHeight={autoHeight}
    >
      <ClientOnly fallback={<LifiWidgetSkeleton config={config} />}>
        <LiFiWidget
          integrator={config.integrator}
          config={config}
          formRef={formRef}
        />
      </ClientOnly>
    </WidgetWrapper>
  );
}
