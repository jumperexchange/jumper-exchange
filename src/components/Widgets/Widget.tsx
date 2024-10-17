'use client';
import { ClientOnly } from '@/components/ClientOnly';
import { MultisigWalletHeaderAlert } from '@/components/MultisigWalletHeaderAlert';
import { TabsMap } from '@/const/tabsMap';
import { useMultisig } from '@/hooks/useMultisig';
import { useThemeStore } from '@/stores/theme';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import type { LanguageKey } from '@/types/i18n';
import { EVM } from '@lifi/sdk';
import { useWalletMenu } from '@lifi/wallet-management';
import type { FormState, WidgetConfig } from '@lifi/widget';
import { HiddenUI, LiFiWidget } from '@lifi/widget';
import { getWalletClient, switchChain } from '@wagmi/core';
import { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/config/tokens';
import { publicRPCList } from 'src/const/rpcList';
import { ThemesMap } from 'src/const/themesMap';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useMemelist } from 'src/hooks/useMemelist';
import { useWelcomeScreen } from 'src/hooks/useWelcomeScreen';
import { useUserTracking } from 'src/hooks/userTracking';
import { useActiveTabStore } from 'src/stores/activeTab';
import { useConfig } from 'wagmi';
import { WidgetWrapper } from '.';
import type { WidgetProps } from './Widget.types';
import { refuelAllowChains, themeAllowChains } from './Widget.types';
import { WidgetSkeleton } from './WidgetSkeleton';

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
}: WidgetProps) {
  const [widgetTheme, configTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);
  const formRef = useRef<FormState>(null);
  const { i18n } = useTranslation();
  const { trackEvent } = useUserTracking();
  const searchParams = useSearchParams();
  const wagmiConfig = useConfig();
  const { isMultisigSigner, getMultisigWidgetConfig } = useMultisig();
  const { multisigWidget, multisigSdkConfig } = getMultisigWidgetConfig();
  const { activeTab } = useActiveTabStore();
  const partnerName = configTheme?.uid ?? 'default';
  const { tokens: memeListTokens } = useMemelist({
    enabled: partnerName === ThemesMap.Memecoins,
  });
  const { openWalletMenu } = useWalletMenu();
  const widgetCache = useWidgetCacheStore((state) => state);

  const router = useRouter();

  useEffect(() => {
    router.prefetch('/', { kind: PrefetchKind.FULL });
    router.prefetch('/gas', { kind: PrefetchKind.FULL });
  }, [router]);

  const { welcomeScreenClosed, enabled } = useWelcomeScreen(activeTheme);

  const isGasVariant = activeTab === TabsMap.Refuel.index;
  const allowedChainsByVariant = useMemo(
    () =>
      starterVariant === TabsMap.Refuel.variant
        ? refuelAllowChains
        : partnerName === ThemesMap.Memecoins
          ? themeAllowChains
          : [],
    [starterVariant, partnerName],
  );

  const integratorStringByType = useMemo(() => {
    if (widgetIntegrator) {
      return widgetIntegrator;
    }
    // all the trafic from mobile (including "/gas")
    // if (!isDesktop) {
    //   return process.env.NEXT_PUBLIC_INTEGRATOR_MOBILE;
    // }
    // all the trafic from web on "/gas"
    if (isGasVariant) {
      return process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR_REFUEL;
    }

    return process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR;
  }, [widgetIntegrator, isGasVariant]) as string;

  // load environment config
  const config: WidgetConfig = useMemo((): WidgetConfig => {
    let rpcUrls = {};
    try {
      rpcUrls = {
        ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS),
        ...publicRPCList,
      };
    } catch (e) {
      if (process.env.DEV) {
        console.warn('Parsing custom rpcs failed', e);
      }
    }

    const formParameters: Record<string, number | string | undefined> = {
      fromChain: fromChain || widgetCache.fromChainId,
      fromToken: fromToken || widgetCache.fromToken,
      toChain: toChain,
      toToken: toToken,
      fromAmount: fromAmount,
    };

    for (const key in formParameters) {
      if (!formParameters[key]) {
        delete formParameters[key];
      }
    }

    if (memeListTokens) {
      tokens.allow.concat(memeListTokens);
    }

    return {
      ...formParameters,
      variant: starterVariant === 'refuel' ? 'compact' : 'wide',
      subvariant:
        (starterVariant !== 'buy' &&
          !(partnerName === ThemesMap.Memecoins) &&
          starterVariant) ||
        'default',
      walletConfig: {
        onConnect: openWalletMenu,
      },
      chains: {
        allow: allowChains || allowedChainsByVariant,
      },
      bridges: {
        allow: configTheme?.allowedBridges,
      },
      exchanges: {
        allow: configTheme?.allowedExchanges,
      },
      languages: {
        default: i18n.language as LanguageKey,
        allow: i18n.languages as LanguageKey[],
      },
      hiddenUI: [
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
      ],
      appearance: widgetTheme.config.appearance,
      theme: widgetTheme.config.theme,
      keyPrefix: `jumper-${starterVariant}`,
      ...multisigWidget,
      apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
      sdkConfig: {
        apiUrl: process.env.NEXT_PUBLIC_LIFI_API_URL,
        rpcUrls,
        routeOptions: {
          maxPriceImpact: 0.4,
          allowSwitchChain: !isMultisigSigner, // avoid routes requiring chain switch for multisig wallets
        },
        providers: isMultisigSigner
          ? ([
              EVM({
                getWalletClient: () => getWalletClient(wagmiConfig),
                switchChain: async (chainId) => {
                  const chain = await switchChain(wagmiConfig, { chainId });
                  trackEvent({
                    category: TrackingCategory.Widget,
                    action: TrackingAction.SwitchChain,
                    label: 'switch-chain',
                    data: {
                      [TrackingEventParameter.ChainId]: chainId,
                    },
                  });
                  return getWalletClient(wagmiConfig, { chainId: chain.id });
                },
                multisig: multisigSdkConfig,
              }),
            ] as any) // TODO: fix typing Eugene :pray:
          : undefined,
      },
      buildUrl: true,
      // insurance: true,
      integrator: integratorStringByType,
      tokens: tokens as any, // TODO: fix typing Eugene :pray:
    };
  }, [
    fromChain,
    fromToken,
    toChain,
    toToken,
    fromAmount,
    memeListTokens,
    starterVariant,
    partnerName,
    openWalletMenu,
    allowChains,
    allowedChainsByVariant,
    configTheme?.allowedBridges,
    configTheme?.allowedExchanges,
    i18n.language,
    i18n.languages,
    widgetTheme.config.appearance,
    widgetTheme.config.theme,
    multisigWidget,
    isMultisigSigner,
    multisigSdkConfig,
    integratorStringByType,
    wagmiConfig,
    trackEvent,
  ]);

  return (
    <WidgetWrapper
      className="widget-wrapper"
      welcomeScreenClosed={welcomeScreenClosed || !enabled}
    >
      {isMultisigSigner && <MultisigWalletHeaderAlert />}
      <ClientOnly fallback={<WidgetSkeleton config={config} />}>
        <LiFiWidget
          integrator={config.integrator}
          config={config}
          formRef={formRef}
        />
      </ClientOnly>
    </WidgetWrapper>
  );
}
