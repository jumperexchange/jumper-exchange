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
import type { WidgetConfig } from '@lifi/widget';
import { HiddenUI, LiFiWidget } from '@lifi/widget';
import type { Breakpoint } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { getWalletClient, switchChain } from '@wagmi/core';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemesMap } from 'src/const/themesMap';
import { useMemelist } from 'src/hooks/useMemelist';
import { darkTheme } from 'src/theme/theme';
import { useConfig } from 'wagmi';
import { WidgetWrapper } from '.';
import type { WidgetProps } from './Widget.types';
import { refuelAllowChains, themeAllowChains } from './Widget.types';
import { WidgetSkeleton } from './WidgetSkeleton';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import { useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material';
import { publicRPCList } from 'src/const/rpcList';
import { useRouter } from 'next/navigation';
import { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types';

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
  const theme = useTheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const { i18n } = useTranslation();
  const wagmiConfig = useConfig();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const { isMultisigSigner, getMultisigWidgetConfig } = useMultisig();
  const { isBridgeFiltered, isDexFiltered, partnerName } = usePartnerTheme();
  const { multisigWidget, multisigSdkConfig } = getMultisigWidgetConfig();
  const { activeTab } = useActiveTabStore();
  const { tokens } = useMemelist({
    enabled: partnerName === ThemesMap.Memecoins,
  });

  const router = useRouter();

  useEffect(() => {
    router.prefetch('/', { kind: PrefetchKind.FULL });
    router.prefetch('/gas/', { kind: PrefetchKind.FULL });
    router.prefetch('/buy/', { kind: PrefetchKind.FULL });
  });

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
  }, [widgetIntegrator, isGasVariant, isDesktop]) as string;

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
        (starterVariant !== 'buy' &&
          !(partnerName === ThemesMap.Memecoins) &&
          starterVariant) ||
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
      bridges: {
        allow: isBridgeFiltered && partnerName ? [partnerName] : undefined,
      },
      exchanges: {
        allow: isDexFiltered && partnerName ? [partnerName] : undefined,
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
      theme: {
        // @ts-expect-error
        typography: {
          fontFamily: theme.typography.fontFamily,
        },
        container: {
          borderRadius: '12px',
          maxWidth: '100%',
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            borderRadius: '12px',
            maxWidth: 416,
            minWidth: 416,
            boxShadow:
              theme.palette.mode === 'light'
                ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
                : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
          },
        },
        shape: {
          borderRadius: 12,
          borderRadiusSecondary: 24,
        },
        palette: {
          background: {
            paper: theme.palette.surface2.main,
            default: theme.palette.surface1.main,
          },
          primary: {
            main: theme.palette.accent1.main,
          },
          secondary: {
            // FIXME: we need to find out how to use the correct color from the main theme config
            main: darkTheme.palette.accent2.main,
          },
          grey: theme.palette.grey,
        },
      },
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
        partnerName === ThemesMap.Memecoins && tokens ? { allow: tokens } : {},
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
    theme.breakpoints,
    theme.palette.accent1.main,
    theme.palette.grey,
    theme.palette.mode,
    theme.palette.surface1.main,
    theme.palette.surface2.main,
    theme.typography.fontFamily,
    themeMode,
    toChain,
    toToken,
    tokens,
    wagmiConfig,
    widgetIntegrator,
    partnerName,
    isDexFiltered,
    isBridgeFiltered,
    integratorStringByType,
  ]);

  return (
    <WidgetWrapper
      className="widget-wrapper"
      welcomeScreenClosed={welcomeScreenClosed}
    >
      {isMultisigSigner && <MultisigWalletHeaderAlert />}
      <ClientOnly
        fallback={
          <WidgetSkeleton config={{ ...config, appearance: activeTheme }} />
        }
      >
        <LiFiWidget integrator={config.integrator} config={config} />
      </ClientOnly>
    </WidgetWrapper>
  );
}
