'use client';
import { ChainId, EVM } from '@lifi/sdk';
import type { WidgetConfig } from '@lifi/widget';
import { HiddenUI, LiFiWidget } from '@lifi/widget';
import { useTheme } from '@mui/material/styles';
import { getWalletClient, switchChain } from '@wagmi/core';
import { useLocale } from 'next-intl';
import { useMemo } from 'react';
import { TabsMap } from 'src/const';
import { useMultisig } from 'src/hooks';
import { locales } from 'src/i18n';
import { useMenuStore, useSettingsStore } from 'src/stores';
import type { LanguageKey, MenuState, StarterVariantType } from 'src/types';
import { useConfig } from 'wagmi';
import { MultisigWalletHeaderAlert } from '../MultisigWalletHeaderAlert';
import { WidgetWrapper } from './Widget.style';

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
}

export function Widget({ starterVariant }: WidgetProps) {
  const theme = useTheme();
  const locale = useLocale();
  const wagmiConfig = useConfig();
  const { isMultisigSigner, getMultisigWidgetConfig } = useMultisig();
  const { multisigWidget, multisigSdkConfig } = getMultisigWidgetConfig();

  const welcomeScreenClosed = useSettingsStore(
    (state) => state.welcomeScreenClosed,
  );
  const setWalletSelectMenuState = useMenuStore(
    (state: MenuState) => state.setWalletSelectMenuState,
  );

  // load environment config
  const widgetConfig: WidgetConfig = useMemo((): WidgetConfig => {
    let rpcUrls = {};
    try {
      rpcUrls =
        process.env.NEXT_PUBLIC_CUSTOM_RPCS &&
        JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS);
    } catch (e) {
      if (process.env.DEV) {
        console.warn('Parsing custom rpcs failed', e);
      }
    }
    return {
      variant: starterVariant === 'refuel' ? 'default' : 'expandable',
      subvariant: (starterVariant !== 'buy' && starterVariant) || 'default',
      walletConfig: {
        onConnect: async () => {
          setWalletSelectMenuState(true);
        },
      },
      chains: {
        allow:
          starterVariant === TabsMap.Refuel.variant ? refuelAllowChains : [],
      },
      containerStyle: {
        borderRadius: '12px',
        minWidth: 392,
        boxShadow:
          theme.palette.mode === 'light'
            ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
            : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
      },
      languages: {
        default: locale as LanguageKey,
        allow: locales,
      },
      appearance: theme.palette.mode === 'light' ? 'light' : 'dark',
      hiddenUI: [HiddenUI.Appearance, HiddenUI.Language, HiddenUI.PoweredBy],
      theme: {
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
          grey: {
            300: theme.palette.grey[300],
            800: theme.palette.grey[800],
          },
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
      integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
    };
  }, [
    isMultisigSigner,
    locale,
    multisigSdkConfig,
    multisigWidget,
    setWalletSelectMenuState,
    starterVariant,
    theme.palette.accent1.main,
    theme.palette.grey,
    theme.palette.mode,
    theme.palette.surface1.main,
    theme.palette.surface2.main,
    wagmiConfig,
  ]);

  return (
    <WidgetWrapper
      className="widget-wrapper"
      welcomeScreenClosed={welcomeScreenClosed}
    >
      {isMultisigSigner && <MultisigWalletHeaderAlert />}
      <LiFiWidget integrator={'dev.jumper.exchange'} config={widgetConfig} />
    </WidgetWrapper>
  );
}
