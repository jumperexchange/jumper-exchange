import type { Token } from '@lifi/sdk';
import { ChainId } from '@lifi/sdk';
import type { WidgetConfig } from '@lifi/widget';
import { HiddenUI, LiFiWidget } from '@lifi/widget';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TabsMap } from 'src/const';
import { useMultisig } from 'src/hooks';
import { useWallet } from 'src/providers';
import { useMenuStore, useSettingsStore } from 'src/stores';
import type { LanguageKey, MenuState, StarterVariantType } from 'src/types';
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
  const { disconnect, account, switchChain, addChain, addToken } = useWallet();
  const { i18n } = useTranslation();
  const welcomeScreenClosed = useSettingsStore(
    (state) => state.welcomeScreenClosed,
  );
  const onOpenWalletSelectMenu = useMenuStore(
    (state: MenuState) => state.onOpenWalletSelectMenu,
  );
  const { isMultisigSigner, getMultisigWidgetConfig } = useMultisig();

  // load environment config
  const widgetConfig: WidgetConfig = useMemo((): WidgetConfig => {
    let rpcs = {};
    try {
      rpcs = JSON.parse(import.meta.env.VITE_CUSTOM_RPCS);
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('Parsing custom rpcs failed', e);
      }
    }

    const { multisigWidget, multisigSdkConfig } = getMultisigWidgetConfig();

    return {
      variant: starterVariant === 'refuel' ? 'default' : 'expandable',
      subvariant: (starterVariant !== 'buy' && starterVariant) || 'default',
      walletManagement: {
        signer: account.signer,
        connect: async () => {
          onOpenWalletSelectMenu(
            true,
            document.getElementById('connect-wallet-button'),
          );
          return account.signer!;
        },
        disconnect: async () => {
          disconnect();
        },
        switchChain: async (reqChainId: number) => {
          await switchChain(reqChainId);
          if (account.signer) {
            return account.signer!;
          } else {
            throw Error('No signer object after chain switch');
          }
        },
        addToken: async (token: Token, chainId: number) => {
          await addToken(chainId, token);
        },
        addChain: async (chainId: number) => {
          return addChain(chainId);
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
        default: i18n.resolvedLanguage as LanguageKey,
        allow: i18n.languages as LanguageKey[],
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
        apiUrl: import.meta.env.VITE_LIFI_API_URL,
        rpcs,
        defaultRouteOptions: {
          maxPriceImpact: 0.4,
          allowSwitchChain: !isMultisigSigner, // avoid routes requiring chain switch for multisig wallets
        },
        multisigConfig: { ...(multisigSdkConfig ?? {}) },
      },
      buildUrl: true,
      insurance: true,
      integrator: import.meta.env.VITE_WIDGET_INTEGRATOR,
    };
  }, [
    getMultisigWidgetConfig,
    starterVariant,
    account.signer,
    theme.palette.mode,
    theme.palette.surface2.main,
    theme.palette.surface1.main,
    theme.palette.accent1.main,
    theme.palette.grey,
    i18n.resolvedLanguage,
    i18n.languages,
    isMultisigSigner,
    onOpenWalletSelectMenu,
    disconnect,
    switchChain,
    addToken,
    addChain,
  ]);

  return (
    <WidgetWrapper
      className="widget-wrapper"
      welcomeScreenClosed={welcomeScreenClosed}
    >
      {isMultisigSigner && <MultisigWalletHeaderAlert />}
      <LiFiWidget
        integrator={import.meta.env.VITE_WIDGET_INTEGRATOR as string}
        config={widgetConfig}
      />
    </WidgetWrapper>
  );
}
