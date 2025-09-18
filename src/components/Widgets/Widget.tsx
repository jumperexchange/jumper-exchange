'use client';
import { ClientOnly } from '@/components/ClientOnly';
import envConfig from '@/config/env-config';
import { TabsMap } from '@/const/tabsMap';
import { useThemeStore } from '@/stores/theme';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import type { LanguageKey } from '@/types/i18n';
import getApiUrl from '@/utils/getApiUrl';
import { ChainId } from '@lifi/sdk';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import type { FormState, WidgetConfig } from '@lifi/widget';
import {
  HiddenUI,
  LiFiWidget,
  WidgetSkeleton as LifiWidgetSkeleton,
  RequiredUI,
} from '@lifi/widget';
import { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/config/tokens';
import { publicRPCList } from 'src/const/rpcList';
import { ThemesMap } from 'src/const/themesMap';
import { useMemelist } from 'src/hooks/useMemelist';
import { useWelcomeScreen } from 'src/hooks/useWelcomeScreen';
import { useBridgeConditions } from 'src/hooks/useBridgeConditions';
import { useActiveTabStore } from 'src/stores/activeTab';
import { useContributionStore } from 'src/stores/contribution/ContributionStore';
import { themeAllowChains, WidgetWrapper } from '.';
import FeeContribution from './FeeContribution/FeeContribution';
import type { WidgetProps } from './Widget.types';
import { useTheme } from '@mui/material/styles';
import { useLiFiWidgetConfig } from './variants/widgetConfig/hooks';
import { ConfigContext } from './variants/widgetConfig/types';
import uniqBy from 'lodash/uniqBy';

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
  const { i18n, t } = useTranslation();
  const { account } = useAccount();
  const isConnectedAGW = account?.connector?.name === 'Abstract';

  const { activeTab } = useActiveTabStore();
  const partnerName = configTheme?.uid ?? 'default';
  const { tokens: memeListTokens } = useMemelist({
    enabled: partnerName === ThemesMap.Memecoins,
  });
  const contributionDisplayed = useContributionStore(
    (state) => state.contributionDisplayed,
  );
  const { openWalletMenu } = useWalletMenu();
  const widgetCache = useWidgetCacheStore((state) => state);

  useEffect(() => {
    router.prefetch('/', { kind: PrefetchKind.FULL });
    router.prefetch('/gas', { kind: PrefetchKind.FULL });
  }, [router]);

  const { welcomeScreenClosed, enabled } = useWelcomeScreen();

  const isGasVariant = activeTab === TabsMap.Refuel.index;
  const allowedChainsByVariant = useMemo(
    () => (partnerName === ThemesMap.Memecoins ? themeAllowChains : []),
    [starterVariant, partnerName],
  );

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

  const subvariant = useMemo(() => {
    if (starterVariant === 'buy' || partnerName === ThemesMap.Memecoins) {
      return 'default';
    }
    return starterVariant;
  }, [partnerName, starterVariant]);

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

  const tokensCtx = useMemo(() => {
    const _tokens = tokens || {};
    console.log('----memeListTokens----', memeListTokens);
    if (memeListTokens) {
      const currentAllowList = _tokens?.allow ?? [];
      const newAllowList = currentAllowList.concat(memeListTokens);
      _tokens.allow = newAllowList;
    }
    return _tokens;
  }, [memeListTokens]);

  const chainsCtx = useMemo(() => {
    return {
      ...configTheme?.chains,
      from: isConnectedAGW
        ? { allow: [ChainId.ABS] }
        : { allow: allowChains || allowedChainsByVariant },
      to: allowToChains ? { allow: allowToChains } : undefined,
    };
  }, [
    configTheme?.chains,
    isConnectedAGW,
    allowChains,
    allowedChainsByVariant,
    allowToChains,
  ]);

  const bridgesCtx = useMemo(() => {
    return {
      allow: configTheme?.allowedBridges,
    };
  }, [configTheme?.allowedBridges]);

  const exchangesCtx = useMemo(() => {
    return {
      allow: configTheme?.allowedExchanges,
    };
  }, [configTheme?.allowedExchanges]);

  const ctx = useMemo(() => {
    const baseOverrides: ConfigContext['baseOverrides'] = {
      integrator: integratorStringByType,
      keyPrefix: `jumper-${starterVariant}`,
      hiddenUI: [
        ...(configTheme?.hiddenUI ?? []),
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
      ],
      bridges: bridgesCtx,
      exchanges: exchangesCtx,
      tokens: tokensCtx,
      chains: chainsCtx,
      buildUrl: true,
    };

    return {
      ...formParametersCtx,
      useMainWidget: true,
      includeRouteLabels: true,
      starterVariant,
      partnerName,
      baseOverrides,
    };
  }, [
    formParametersCtx,
    starterVariant,
    partnerName,
    configTheme?.hiddenUI,
    tokensCtx,
    chainsCtx,
    bridgesCtx,
    exchangesCtx,
    integratorStringByType,
    isConnectedAGW,
  ]);

  const widgetConfig = useLiFiWidgetConfig(ctx);

  if (bridgeConditions.isAGWToNonABSChain) {
    widgetConfig.requiredUI = [
      ...(widgetConfig.requiredUI || []),
      RequiredUI.ToAddress,
    ];
  }

  if (
    bridgeConditions.isBridgeFromHypeToArbNativeUSDC ||
    bridgeConditions.isBridgeFromEvmToHype
  ) {
    widgetConfig.hiddenUI = [
      ...(widgetConfig.hiddenUI || []),
      HiddenUI.ToAddress,
    ];
  }

  if (!isConnectedAGW) {
    widgetConfig.sdkConfig!.routeOptions!.allowSwitchChain = true;
  }

  return (
    <WidgetWrapper
      ref={wrapperRef}
      className="widget-wrapper"
      welcomeScreenClosed={welcomeScreenClosed || !enabled}
      autoHeight={autoHeight}
      contributionDisplayed={contributionDisplayed}
    >
      <ClientOnly fallback={<LifiWidgetSkeleton config={widgetConfig} />}>
        <LiFiWidget
          integrator={widgetConfig.integrator}
          config={widgetConfig}
          formRef={formRef}
          feeConfig={{
            _vcComponent: () => <FeeContribution translationFn={t} />,
          }}
        />
      </ClientOnly>
    </WidgetWrapper>
  );
}
