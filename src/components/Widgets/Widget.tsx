'use client';
import { ClientOnly } from '@/components/ClientOnly';
import { TabsMap } from '@/const/tabsMap';
import { useMultisig } from '@/hooks/useMultisig';
import { useThemeStore } from '@/stores/theme';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import type { LanguageKey } from '@/types/i18n';
import getApiUrl from '@/utils/getApiUrl';
import { ChainId, EVM } from '@lifi/sdk';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import type { FormFieldChanged, FormState, WidgetConfig } from '@lifi/widget';
import {
  HiddenUI,
  LiFiWidget,
  WidgetSkeleton as LifiWidgetSkeleton,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import { getWalletClient, switchChain } from '@wagmi/core';
import { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/config/tokens';
import { AbTestCases } from 'src/const/abtests';
import { publicRPCList } from 'src/const/rpcList';
import { ThemesMap } from 'src/const/themesMap';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useMemelist } from 'src/hooks/useMemelist';
import { useUrlParams } from 'src/hooks/useUrlParams';
import { useWelcomeScreen } from 'src/hooks/useWelcomeScreen';
import { useUserTracking } from 'src/hooks/userTracking';
import { useABTestStore } from 'src/stores/abTests';
import { useActiveTabStore } from 'src/stores/activeTab';
import { isIframeEnvironment } from 'src/utils/iframe';
import { useConfig } from 'wagmi';
import { themeAllowChains, WidgetWrapper } from '.';
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
  const [widgetTheme, configTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);
  const { destinationChainToken, toAddress } = useUrlParams();
  const widgetEvents = useWidgetEvents();
  const formRef = useRef<FormState>(null);
  const { i18n } = useTranslation();
  const { trackEvent } = useUserTracking();
  const { abtests } = useABTestStore();
  const { account } = useAccount();
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isConnectedAGW = account?.connector?.name === 'Abstract';
  useEffect(() => {
    router.prefetch('/', { kind: PrefetchKind.FULL });
    router.prefetch('/gas', { kind: PrefetchKind.FULL });
  }, [router]);

  useEffect(() => {
    // Our partners that want to onboard on pre-filled address can still do it
    if (
      !wrapperRef.current ||
      configTheme?.chains?.to?.allow?.includes(2741) ||
      allowToChains?.includes(2741)
    ) {
      return;
    }
    // Clear toAddress URL parameter once the widget is mounted
    // Uses MutationObserver to detect when the widget content is loaded
    // since it's rendered dynamically inside WidgetWrapper
    const observer = new MutationObserver(() => {
      if (formRef.current && isConnectedAGW) {
        formRef.current.setFieldValue('toAddress', undefined, {
          setUrlSearchParam: true,
        });
        observer.disconnect();
      }
    });
    observer.observe(wrapperRef.current, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [allowToChains, configTheme?.chains?.to?.allow]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (formRef.current) {
        formRef.current.setFieldValue('toAddress', undefined, {
          setUrlSearchParam: true,
        });
        observer.disconnect();
      }
    });

    if (configTheme?.integrator !== 'abs.jmp.exchange') {
      formRef.current?.setFieldValue('toAddress', undefined, {
        setUrlSearchParam: true,
      });
    }

    if (
      configTheme?.integrator === 'abs.jmp.exchange' &&
      isConnectedAGW &&
      toAddress === account.address
    ) {
      formRef.current?.setFieldValue('toAddress', undefined, {
        setUrlSearchParam: true,
      });
    }

    const handleAGW = async (fieldChange: FormFieldChanged) => {
      if (
        isConnectedAGW &&
        fieldChange?.fieldName === 'toAddress' &&
        fieldChange?.newValue === account.address
      ) {
        formRef.current?.setFieldValue('toAddress', undefined, {
          setUrlSearchParam: true,
        });
      }
    };

    widgetEvents.on(WidgetEvent.FormFieldChanged, handleAGW);
    return () => {
      widgetEvents.off(WidgetEvent.FormFieldChanged, handleAGW);
    };
  }, [
    account.address,
    account.chainId,
    configTheme?.integrator,
    destinationChainToken,
    isConnectedAGW,
    toAddress,
    widgetEvents,
  ]);

  const { welcomeScreenClosed, enabled } = useWelcomeScreen(activeTheme);

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
    //   return process.env.NEXT_PUBLIC_INTEGRATOR_MOBILE;
    // }
    // all the trafic from web on "/gas"
    if (isGasVariant) {
      return process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR_REFUEL;
    }

    return process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR;
  }, [configTheme.integrator, widgetIntegrator, isGasVariant]) as string;

  const subvariant = useMemo(() => {
    if (
      abtests[AbTestCases.TEST_WIDGET_SUBVARIANTS] &&
      starterVariant !== TabsMap.Refuel.variant
    ) {
      return 'split';
    } else if (
      starterVariant === 'buy' ||
      partnerName === ThemesMap.Memecoins
    ) {
      return 'default';
    }
    return starterVariant;
  }, [abtests, partnerName, starterVariant]);

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
      fromChain:
        configTheme?.fromChain ?? (fromChain || widgetCache.fromChainId),
      fromToken: configTheme?.fromToken ?? (fromToken || widgetCache.fromToken),
      toChain: configTheme?.toChain ?? toChain,
      toToken: configTheme?.toToken ?? toToken,
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
      variant:
        // @ts-expect-error
        starterVariant === 'compact'
          ? 'compact'
          : starterVariant === 'refuel'
            ? 'compact'
            : 'wide',
      subvariant,
      walletConfig: {
        onConnect: openWalletMenu,
      },
      chains: {
        ...configTheme?.chains,
        from: isConnectedAGW
          ? { allow: [ChainId.ABS] }
          : { allow: allowChains || allowedChainsByVariant },
        to:
          isConnectedAGW && configTheme?.integrator !== 'abs.jmp.exchange'
            ? { allow: [ChainId.ABS] }
            : allowToChains
              ? { allow: allowToChains }
              : undefined,
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
        ...(configTheme?.hiddenUI ?? []),
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
      ],
      requiredUI:
        // if AGW connected and destinationChainToken is NOT ABS, require toAddress
        isConnectedAGW && destinationChainToken.chainId !== ChainId.ABS
          ? ['toAddress']
          : undefined,
      appearance: widgetTheme.config.appearance,
      theme: widgetTheme.config.theme,
      keyPrefix: `jumper-${starterVariant}`,
      ...multisigWidget,
      apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
      languageResources: {
        en: {
          warning: {
            message: {
              lowAddressActivity:
                "This address has low activity on this blockchain. Please verify above you're sending to the correct ADDRESS and network to prevent potential loss of funds. ABSTRACT WALLET WORKS ONLY ON ABSTRACT CHAIN, DO NOT SEND FUNDS TO ABSTRACT WALLET ON ANOTHER CHAIN.",
            },
          },
        },
      },
      sdkConfig: {
        apiUrl: getApiUrl(),
        rpcUrls,
        routeOptions: {
          maxPriceImpact: 0.4,
          allowSwitchChain: !isMultisigSigner && !isConnectedAGW, // avoid routes requiring chain switch for multisig or smart account wallets
        },
        providers:
          isMultisigSigner && isIframeEnvironment()
            ? [
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
              ]
            : undefined,
      },
      buildUrl: true,
      integrator: integratorStringByType,
      tokens: tokens,
    };
  }, [
    configTheme?.fromChain,
    configTheme?.fromToken,
    configTheme?.toChain,
    configTheme?.toToken,
    configTheme?.chains,
    configTheme?.allowedBridges,
    configTheme?.allowedExchanges,
    configTheme?.hiddenUI,
    fromChain,
    widgetCache.fromChainId,
    widgetCache.fromToken,
    fromToken,
    toChain,
    toToken,
    fromAmount,
    memeListTokens,
    starterVariant,
    openWalletMenu,
    isConnectedAGW,
    allowChains,
    allowedChainsByVariant,
    allowToChains,
    i18n.language,
    i18n.languages,
    destinationChainToken.chainId,
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
