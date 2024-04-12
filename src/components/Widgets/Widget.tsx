'use client';
import { MultisigWalletHeaderAlert } from '@/components/MultisigWalletHeaderAlert';
import { widgetConfig } from '@/config/widgetConfig';
import { TabsMap } from '@/const/tabsMap';
import { useMultisig } from '@/hooks/useMultisig';
import { useActiveTabStore } from '@/stores/activeTab/ActiveTabStore';
import { useMenuStore } from '@/stores/menu';
import { useSettingsStore } from '@/stores/settings';
import type { LanguageKey } from '@/types/i18n';
import type { StarterVariantType, ThemeVariantType } from '@/types/internal';
import type { MenuState } from '@/types/menu';
import { ChainId, EVM } from '@lifi/sdk';
import type { WidgetConfig } from '@lifi/widget';
import { HiddenUI, LiFiWidget } from '@lifi/widget';
import { useTheme } from '@mui/material/styles';
import { getWalletClient, switchChain } from '@wagmi/core';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { darkTheme } from 'src/theme/theme';
import { useConfig } from 'wagmi';
import { WidgetWrapper } from '.';
import { useMemelist } from 'src/hooks/useMemelist';
import { ThemesMap } from 'src/const/themesMap';

export const base_meme_tokens = [
  {
    address: '0xE3086852A4B125803C815a158249ae468A3254Ca',
    chainId: 8453,
    logoURI: 'https://strapi.li.finance/uploads/mfer_c5c316fa92.webp',
  },
];

const refuelAllowChains: ChainId[] = [
  ChainId.ETH,
  ChainId.POL,
  ChainId.BSC,
  ChainId.DAI,
  ChainId.FTM,
  ChainId.AVA,
  ChainId.ARB,
  ChainId.OPT,
  ChainId.FUS,
  ChainId.VEL,
];

interface WidgetProps {
  starterVariant: StarterVariantType;
  themeVariant?: ThemeVariantType;
}

export function Widget({ starterVariant, themeVariant }: WidgetProps) {
  const [loaded, setLoaded] = useState(false);
  const theme = useTheme();
  const { i18n } = useTranslation();
  const wagmiConfig = useConfig();
  const { isMultisigSigner, getMultisigWidgetConfig } = useMultisig();
  const { multisigWidget, multisigSdkConfig } = getMultisigWidgetConfig();
  const { activeTab } = useActiveTabStore();
  console.log(themeVariant);
  const { tokens } = useMemelist({
    enabled: !!themeVariant,
  });
  const isGasVariant = activeTab === TabsMap.Refuel.index;

  const welcomeScreenClosed = useSettingsStore(
    (state) => state.welcomeScreenClosed,
  );
  const setWalletSelectMenuState = useMenuStore(
    (state: MenuState) => state.setWalletSelectMenuState,
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  // load environment config
  const config: WidgetConfig = useMemo((): WidgetConfig => {
    let rpcUrls = {};
    try {
      rpcUrls = JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS);
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
      chains: {
        allow:
          starterVariant === TabsMap.Refuel.variant
            ? refuelAllowChains
            : themeVariant === ThemesMap.Memecoins
              ? [8453]
              : [],
      },
      languages: {
        default: i18n.language as LanguageKey,
        allow: i18n.languages as LanguageKey[],
      },
      appearance: theme.palette.mode === 'light' ? 'light' : 'dark',
      hiddenUI: [HiddenUI.Appearance, HiddenUI.Language, HiddenUI.PoweredBy],
      theme: {
        container: {
          borderRadius: '12px',
          minWidth: 416,
          boxShadow:
            theme.palette.mode === 'light'
              ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
              : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
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
                switchChain: async (chainId: number) => {
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
      integrator: `${
        isGasVariant
          ? process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR_REFUEL
          : process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR
      }`,
      tokens:
        themeVariant === ThemesMap.Memecoins && tokens ? { allow: tokens } : {},
    };
  }, [
    starterVariant,
    i18n.language,
    i18n.languages,
    theme.palette.mode,
    theme.palette.surface2.main,
    theme.palette.surface1.main,
    theme.palette.accent1.main,
    theme.palette.grey,
    multisigWidget,
    isMultisigSigner,
    multisigSdkConfig,
    setWalletSelectMenuState,
    wagmiConfig,
    isGasVariant,
    tokens,
    themeVariant,
  ]);

  return (
    loaded && (
      <WidgetWrapper
        className="widget-wrapper"
        welcomeScreenClosed={welcomeScreenClosed}
      >
        {isMultisigSigner && <MultisigWalletHeaderAlert />}
        <LiFiWidget integrator={config.integrator} config={config} />
      </WidgetWrapper>
    )
  );
}
