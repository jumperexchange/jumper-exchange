'use client';
import { ClientOnly } from '@/components/ClientOnly';
import { MultisigWalletHeaderAlert } from '@/components/MultisigWalletHeaderAlert';
import { widgetConfig } from '@/config/widgetConfig';
import { TabsMap } from '@/const/tabsMap';
import { useMultisig } from '@/hooks/useMultisig';
import { useActiveTabStore } from '@/stores/activeTab/ActiveTabStore';
import { useMenuStore } from '@/stores/menu';
import { useSettingsStore } from '@/stores/settings';
import type { LanguageKey } from '@/types/i18n';
import type { MenuState } from '@/types/menu';
import { EVM } from '@lifi/sdk';
import type { WidgetConfig, WidgetTheme } from '@lifi/widget';
import { HiddenUI, LiFiWidget } from '@lifi/widget';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { getWalletClient, switchChain } from '@wagmi/core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { publicRPCList } from 'src/const/rpcList';
import { STRAPI_PARTNER_THEMES } from 'src/const/strapiContentKeys';
import { ThemesMap } from 'src/const/themesMap';
import { useMemelist } from 'src/hooks/useMemelist';
import { useStrapi } from 'src/hooks/useStrapi';
import type { PartnerThemesData } from 'src/types/strapi';
import { useConfig } from 'wagmi';
import { shallow } from 'zustand/shallow';
import { WidgetWrapper } from '.';
import { DefaultWidgetTheme } from './DefaultWidgetTheme';
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
  themeVariant,
  activeTheme,
}: WidgetProps) {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const { i18n } = useTranslation();
  const wagmiConfig = useConfig();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const { isMultisigSigner, getMultisigWidgetConfig } = useMultisig();
  const { multisigWidget, multisigSdkConfig } = getMultisigWidgetConfig();
  const { activeTab } = useActiveTabStore();
  const { tokens } = useMemelist({
    enabled: !!themeVariant,
  });
  const partnerThemeUid = useSettingsStore(
    (state) => state.partnerThemeUid,
    shallow,
  );
  const { data: partnerThemes, isSuccess: partnerThemesIsSuccess } =
    useStrapi<PartnerThemesData>({
      contentType: STRAPI_PARTNER_THEMES,
      queryKey: ['partner-themes'],
      filterUid: partnerThemeUid,
    });
  console.log('partnerThemeUid', partnerThemeUid);
  const isGasVariant = activeTab === TabsMap.Refuel.index;
  const welcomeScreenClosed = useSettingsStore(
    (state) => state.welcomeScreenClosed,
  );
  const setWalletSelectMenuState = useMenuStore(
    (state: MenuState) => state.setWalletSelectMenuState,
  );

  const allowedChainsByVariant = useMemo(
    () =>
      starterVariant === TabsMap.Refuel.variant
        ? refuelAllowChains
        : themeVariant === ThemesMap.Memecoins
          ? themeAllowChains
          : [],
    [starterVariant, themeVariant],
  );

  console.log('partnerThemes', partnerThemes);

  const integratorStringByType = useMemo(() => {
    if (widgetIntegrator) {
      return widgetIntegrator;
    }
    // all the trafic from mobile (including "/gas")
    if (!isDesktop) {
      return process.env.NEXT_PUBLIC_INTEGRATOR_MOBILE;
    }
    // all the trafic from web on "/gas"
    if (isGasVariant) {
      return process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR_REFUEL;
    }
    return process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR;
  }, [widgetIntegrator, isGasVariant, isDesktop]) as string;

  const widgetTheme = useMemo(() => {
    if (partnerThemesIsSuccess && partnerThemes.length) {
      return partnerThemes[0].attributes.config;
    } else {
      return DefaultWidgetTheme;
    }
  }, [partnerThemes, partnerThemesIsSuccess]);

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

    return {
      ...widgetConfig,
      variant: starterVariant === 'refuel' ? 'compact' : 'wide',
      subvariant:
        (starterVariant !== 'buy' && !themeVariant && starterVariant) ||
        'default',
      walletConfig: {
        onConnect: async () => {
          setWalletSelectMenuState(true);
        },
      },
      fromChain: fromChain,
      fromToken: fromToken,
      toChain: toChain,
      toToken: toToken,
      fromAmount: fromAmount,
      chains: {
        allow: allowChains || allowedChainsByVariant,
      },
      languages: {
        default: i18n.language as LanguageKey,
        allow: i18n.languages as LanguageKey[],
      },
      appearance: themeMode,
      hiddenUI: [
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
      ],
      theme: widgetTheme as WidgetTheme,
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
          ? [
              EVM({
                getWalletClient: () => getWalletClient(wagmiConfig),
                switchChain: async (chainId) => {
                  const chain = await switchChain(wagmiConfig, { chainId });
                  return getWalletClient(wagmiConfig, { chainId: chain.id });
                },
                multisig: multisigSdkConfig,
              }),
            ]
          : undefined,
      },
      buildUrl: true,
      insurance: true,
      integrator: integratorStringByType,
      tokens:
        themeVariant === ThemesMap.Memecoins && tokens ? { allow: tokens } : {},
    };
  }, [
    allowChains,
    allowedChainsByVariant,
    fromAmount,
    fromChain,
    fromToken,
    i18n.language,
    i18n.languages,
    integratorStringByType,
    isMultisigSigner,
    multisigSdkConfig,
    multisigWidget,
    setWalletSelectMenuState,
    starterVariant,
    themeMode,
    themeVariant,
    toChain,
    toToken,
    tokens,
    wagmiConfig,
    widgetTheme,
  ]);

  return (
    <WidgetWrapper
      className="widget-wrapper"
      welcomeScreenClosed={welcomeScreenClosed}
    >
      {isMultisigSigner && <MultisigWalletHeaderAlert />}
      <ClientOnly
        fallback={
          <WidgetSkeleton
            welcomeScreenClosed={welcomeScreenClosed}
            config={{ ...config, appearance: activeTheme }}
          />
        }
      >
        <LiFiWidget integrator={config.integrator} config={config} />
      </ClientOnly>
    </WidgetWrapper>
  );
}
