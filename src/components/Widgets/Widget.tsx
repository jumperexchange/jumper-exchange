'use client';
import { ClientOnly } from '@/components/ClientOnly';
import type { FormState } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton as LifiWidgetSkeleton } from '@lifi/widget';
import { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
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
  widgetIntegrator,
  activeTheme,
  autoHeight,
  customWidgetTheme,
}: WidgetProps) {
  const formRef = useRef<FormState>(null);
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/', { kind: PrefetchKind.FULL });
    router.prefetch('/gas', { kind: PrefetchKind.FULL });
  }, [router]);

  const { welcomeScreenClosed, enabled } = useWelcomeScreen(activeTheme);

  const config = useWidgetConfig({
    fromChain,
    toChain,
    fromToken,
    toToken,
    fromAmount,
    starterVariant,
    allowChains,
    widgetIntegrator,
    customWidgetTheme,
  });

  return (
    <WidgetWrapper
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
