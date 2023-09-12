import { ChainId, Token } from '@lifi/sdk';
import { HiddenUI, LiFiWidget, WidgetConfig } from '@lifi/widget';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MenuState } from '@transferto/shared/src/types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrackingActions,
  TrackingCategories,
  TrackingEventParameters,
  TrackingUserProperties,
} from '../../const';
import { TabsMap } from '../../const/tabsMap';
import { useUserTracking } from '../../hooks';
import { useMultisig } from '../../hooks/useMultisig';
import { useWallet } from '../../providers/WalletProvider';
import { useMenuStore } from '../../stores';
import {
  EventTrackingTool,
  LanguageKey,
  StarterVariantType,
} from '../../types';
import { MultisigWalletHeaderAlert } from '../MultisigWalletHeaderAlert';

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
  const isDarkMode = theme.palette.mode === 'dark';
  const { trackEvent, trackAttribute } = useUserTracking();
  const onOpenNavbarWalletSelectMenu = useMenuStore(
    (state: MenuState) => state.onOpenNavbarWalletSelectMenu,
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
          trackEvent({
            category: TrackingCategories.Widget,
            action: TrackingActions.OpenWalletSelectMenu,
            label: 'click_connect_wallet',
            disableTrackingTool: [
              EventTrackingTool.ARCx,
              EventTrackingTool.Raleon,
            ],
          });
          onOpenNavbarWalletSelectMenu(
            true,
            document.getElementById('connect-wallet-button'),
          );
          return account.signer!;
        },
        disconnect: async () => {
          trackAttribute({
            data: {
              [TrackingUserProperties.Connected]: false,
            },
          });
          trackEvent({
            category: TrackingCategories.Widget,
            action: TrackingActions.Disconnect,
            label: 'click_disconnect_wallet',
            disableTrackingTool: [
              EventTrackingTool.ARCx,
              EventTrackingTool.Raleon,
            ],
          });
          disconnect();
        },
        switchChain: async (reqChainId: number) => {
          window.gtag('event', '');
          await switchChain(reqChainId).then(() => {
            trackEvent({
              category: TrackingCategories.Widget,
              action: TrackingActions.SwitchChain,
              label: `${reqChainId}`,
              data: {
                [TrackingEventParameters.SwitchedChain]: reqChainId,
              },
              disableTrackingTool: [
                EventTrackingTool.ARCx,
                EventTrackingTool.Raleon,
              ],
              // transport: "xhr", // optional, beacon/xhr/image
            });
          });
          if (account.signer) {
            return account.signer!;
          } else {
            throw Error('No signer object after chain switch');
          }
        },
        addToken: async (token: Token, chainId: number) => {
          await addToken(chainId, token).then(() => {
            trackAttribute({
              data: {
                [TrackingUserProperties.AddedToken]: true,
              },
            });
            trackEvent({
              category: TrackingCategories.Widget,
              action: TrackingActions.AddToken,
              label: `add_token_${token.name}`,
              data: {
                [TrackingEventParameters.TokenAdded]: `${token.name}`,
                [TrackingEventParameters.TokenAddedChainId]: chainId,
              },
              disableTrackingTool: [
                EventTrackingTool.ARCx,
                EventTrackingTool.Raleon,
              ],
            });
          });
        },
        addChain: async (chainId: number) => {
          return addChain(chainId).then((data) => {
            trackAttribute({
              data: {
                [TrackingUserProperties.AddedChain]: true,
              },
            });
            trackEvent({
              category: TrackingCategories.Widget,
              action: TrackingActions.AddChain,
              label: `add_chain_${chainId}`,
              data: {
                [TrackingEventParameters.ChainIdAdded]: `${chainId}`,
              },
              disableTrackingTool: [
                EventTrackingTool.ARCx,
                EventTrackingTool.Raleon,
              ],
            });
            return data;
          });
        },
      },
      chains: {
        allow:
          starterVariant === TabsMap.Refuel.variant ? refuelAllowChains : [],
      },
      containerStyle: {
        borderRadius: '12px',
        boxShadow: !isDarkMode
          ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
          : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
      },
      languages: {
        default: i18n.language as LanguageKey,
        allow: i18n.languages as LanguageKey[],
      },
      appearance: isDarkMode ? 'dark' : 'light',
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
    isDarkMode,
    i18n.language,
    i18n.languages,
    theme.palette.surface2.main,
    theme.palette.surface1.main,
    theme.palette.accent1.main,
    theme.palette.grey,
    isMultisigSigner,
    trackAttribute,
    trackEvent,
    onOpenNavbarWalletSelectMenu,
    disconnect,
    switchChain,
    addToken,
    addChain,
  ]);

  return (
    <Box className="widget-wrapper">
      {isMultisigSigner && <MultisigWalletHeaderAlert />}
      <LiFiWidget
        integrator={import.meta.env.VITE_WIDGET_INTEGRATOR as string}
        config={widgetConfig}
      />
    </Box>
  );
}
