import { ChainId, EVM } from '@lifi/sdk';
import type { WidgetConfig } from '@lifi/widget';
import { HiddenUI, LiFiWidget } from '@lifi/widget';
import { useTheme } from '@mui/material/styles';
import { getWalletClient, switchChain } from '@wagmi/core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TabsMap, ThemesMap } from 'src/const';
import { useMultisig } from 'src/hooks';
import { useActiveTabStore, useMenuStore, useSettingsStore } from 'src/stores';
import { darkTheme } from 'src/theme';
import type {
  LanguageKey,
  MenuState,
  StarterVariantType,
  ThemeVariantType,
} from 'src/types';
import { useConfig } from 'wagmi';
import { widgetConfig } from '../../config';
import { MultisigWalletHeaderAlert } from '../MultisigWalletHeaderAlert';
import { WidgetWrapper } from './Widget.style';
import { useMemelist } from 'src/hooks/useMemelist';

//
const BASE_DEGEN = {
  address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
  chainId: 8453,
};

const BASE_BENG = {
  address: '0x3e05D37CFBd8caaad9E3322D35CC727AfaFF63E3',
  chainId: 8453,
  logoURI: 'https://strapi.li.finance/uploads/beng_fb10df317b.webp',
};

const BASE_MFER = {
  address: '0xE3086852A4B125803C815a158249ae468A3254Ca',
  chainId: 8453,
  logoURI: 'https://strapi.li.finance/uploads/mfer_c5c316fa92.webp',
};

export const base_meme_tokens = [BASE_DEGEN, BASE_BENG, BASE_MFER];

//

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
  const theme = useTheme();
  const { i18n } = useTranslation();
  const wagmiConfig = useConfig();
  const { isMultisigSigner, getMultisigWidgetConfig } = useMultisig();
  const { multisigWidget, multisigSdkConfig } = getMultisigWidgetConfig();

  const { activeTab } = useActiveTabStore();
  //Questions: will we alter performance by calling a new external hook when initializing the widget?
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

  // load environment config
  const config: WidgetConfig = useMemo((): WidgetConfig => {
    let rpcUrls = {};
    try {
      rpcUrls = JSON.parse(import.meta.env.VITE_CUSTOM_RPCS);
    } catch (e) {
      if (import.meta.env.DEV) {
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
        default: i18n.resolvedLanguage as LanguageKey,
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
        apiUrl: import.meta.env.VITE_LIFI_API_URL,
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
      integrator: isGasVariant
        ? import.meta.env.VITE_WIDGET_INTEGRATOR_REFUEL
        : import.meta.env.VITE_WIDGET_INTEGRATOR,
      tokens:
        themeVariant === ThemesMap.Memecoins
          ? { allow: [...base_meme_tokens] }
          : {},
    };
  }, [
    starterVariant,
    theme.palette.mode,
    theme.palette.surface2.main,
    theme.palette.surface1.main,
    theme.palette.accent1.main,
    theme.palette.grey,
    i18n.resolvedLanguage,
    i18n.languages,
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
    <WidgetWrapper
      className="widget-wrapper"
      welcomeScreenClosed={welcomeScreenClosed}
    >
      {isMultisigSigner && <MultisigWalletHeaderAlert />}
      <LiFiWidget integrator={config.integrator} config={config} />
    </WidgetWrapper>
  );
}
