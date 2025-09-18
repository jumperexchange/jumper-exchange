'use client';
import { ClientOnly } from '@/components/ClientOnly';
import envConfig from '@/config/env-config';
import { TabsMap } from '@/const/tabsMap';
import { useThemeStore } from '@/stores/theme';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import { useAccount } from '@lifi/wallet-management';
import type { FormState } from '@lifi/widget';
import { WidgetSkeleton as LifiWidgetSkeleton } from '@lifi/widget';
import { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useWelcomeScreen } from 'src/hooks/useWelcomeScreen';
import { useBridgeConditions } from 'src/hooks/useBridgeConditions';
import { useActiveTabStore } from 'src/stores/activeTab';
import { useContributionStore } from 'src/stores/contribution/ContributionStore';
import { WidgetWrapper } from './Widget.style';
import FeeContribution from './FeeContribution/FeeContribution';
import type { WidgetProps } from './Widget.types';
import { useTheme } from '@mui/material/styles';
import { MainWidgetContext } from './variants/widgetConfig/types';
import { useWidgetConfig } from './variants/widgetConfig/useWidgetConfig';
import { Widget as BaseWidget } from './variants/base/Widget';

export function Widget({
  starterVariant,
  fromChain,
  fromToken,
  toChain,
  toToken,
  fromAmount,
  allowChains: allowFromChains,
  allowToChains,
  widgetIntegrator,
  activeTheme,
  autoHeight,
}: WidgetProps) {
  const theme = useTheme();
  const [configTheme, widgetTheme] = useThemeStore((state) => [
    state.configTheme,
    state.widgetTheme,
  ]);
  const formRef = useRef<FormState>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bridgeConditions = useBridgeConditions({
    formRef,
    allowToChains,
    configThemeChains: configTheme?.chains,
  });
  const router = useRouter();
  const { t } = useTranslation();
  const { account } = useAccount();
  const isConnectedAGW = account?.connector?.name === 'Abstract';

  const { activeTab } = useActiveTabStore();
  const partnerName = configTheme?.uid ?? 'default';
  const contributionDisplayed = useContributionStore(
    (state) => state.contributionDisplayed,
  );
  const widgetCache = useWidgetCacheStore((state) => state);

  useEffect(() => {
    router.prefetch('/', { kind: PrefetchKind.FULL });
    router.prefetch('/gas', { kind: PrefetchKind.FULL });
  }, [router]);

  const { welcomeScreenClosed, enabled } = useWelcomeScreen();

  const isGasVariant = activeTab === TabsMap.Refuel.index;

  const integratorStringByType = useMemo(() => {
    if (configTheme?.integrator) {
      return configTheme.integrator;
    }
    if (widgetIntegrator) {
      return widgetIntegrator;
    }
    // all the trafic from mobile (including "/gas")
    // if (!isDesktop) {
    //   return envConfig.NEXT_PUBLIC_INTEGRATOR_MOBILE;
    // }
    // all the trafic from web on "/gas"
    if (isGasVariant) {
      return envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_REFUEL;
    }

    return envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR;
  }, [configTheme.integrator, widgetIntegrator, isGasVariant]) as string;

  const formParametersCtx = useMemo(() => {
    const params: Record<string, number | string | undefined> = {
      sourceChain:
        configTheme?.fromChain ?? (fromChain || widgetCache.fromChainId),
      sourceToken:
        configTheme?.fromToken ?? (fromToken || widgetCache.fromToken),
      destinationChain: configTheme?.toChain ?? toChain,
      destinationToken: configTheme?.toToken ?? toToken,
      fromAmount: fromAmount,
    };

    for (const key in params) {
      if (!params[key]) {
        delete params[key];
      }
    }

    return params;
  }, [
    configTheme?.fromChain,
    configTheme?.fromToken,
    configTheme?.toChain,
    configTheme?.toToken,
    fromAmount,
    fromChain,
    fromToken,
    toChain,
    toToken,
    widgetCache.fromChainId,
    widgetCache.fromToken,
  ]);

  const context: MainWidgetContext = useMemo(
    () => ({
      integrator: integratorStringByType,
      starterVariant,
      partnerName,
      formData: formParametersCtx,
      allowFromChains: allowFromChains,
      allowToChains,
      bridgeConditions,
      isConnectedAGW,
    }),
    [
      starterVariant,
      partnerName,
      formParametersCtx,
      allowFromChains,
      allowToChains,
      configTheme,
      bridgeConditions,
      isConnectedAGW,
    ],
  );

  const widgetConfig = useWidgetConfig('main', context);

  return (
    <WidgetWrapper
      ref={wrapperRef}
      className="widget-wrapper"
      welcomeScreenClosed={welcomeScreenClosed || !enabled}
      autoHeight={autoHeight}
      contributionDisplayed={contributionDisplayed}
    >
      <ClientOnly fallback={<LifiWidgetSkeleton config={widgetConfig} />}>
        <BaseWidget
          type="main"
          ctx={context}
          formRef={formRef}
          feeConfig={{
            _vcComponent: () => <FeeContribution translationFn={t} />,
          }}
        />
      </ClientOnly>
    </WidgetWrapper>
  );
}
