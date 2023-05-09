import { Token } from '@lifi/sdk';
import { HiddenUI, LiFiWidget, WidgetConfig } from '@lifi/widget';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TrackingActions, TrackingCategories } from '../../const';
import { useUserTracking } from '../../hooks/';
import { useWallet } from '../../providers/WalletProvider';
import { useMenuStore } from '../../stores';
import { EventTrackingTools, LanguageKey } from '../../types';

export function Widget({ starterVariant }) {
  const theme = useTheme();
  const { disconnect, account, switchChain, addChain, addToken } = useWallet();
  const { i18n } = useTranslation();
  const isDarkMode = theme.palette.mode === 'dark';
  const { trackEvent } = useUserTracking();
  const onOpenNavbarWalletSelectMenu = useMenuStore(
    (state) => state.onOpenNavbarWalletSelectMenu,
  );

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

    return {
      variant: starterVariant || 'expandable',
      walletManagement: {
        signer: account.signer,
        connect: async () => {
          trackEvent({
            category: TrackingCategories.Menu,
            action: TrackingActions.OpenWalletSelectMenu,
            disableTrackingTool: [EventTrackingTools.arcx],
          });
          onOpenNavbarWalletSelectMenu(
            true,
            document.getElementById('connect-wallet-button'),
          );

          return account.signer;
        },
        disconnect: async () => {
          trackEvent({
            category: TrackingCategories.Wallet,
            action: TrackingActions.Disconnect,
            disableTrackingTool: [EventTrackingTools.arcx],
          });
          disconnect();
        },
        switchChain: async (reqChainId: number) => {
          await switchChain(reqChainId);
          if (account.signer) {
            trackEvent({
              category: TrackingCategories.Wallet,
              action: TrackingActions.SwitchChain,
              label: `${reqChainId}`,
              data: {
                switchChain: reqChainId,
              },
              disableTrackingTool: [EventTrackingTools.arcx],
              // transport: "xhr", // optional, beacon/xhr/image
            });
            return account.signer!;
          } else {
            throw Error('No signer object after chain switch');
          }
        },
        addToken: async (token: Token, chainId: number) => {
          trackEvent({
            category: TrackingCategories.Wallet,
            action: TrackingActions.AddToken,
            label: `addToken-${token.name}`,
            data: {
              tokenAdded: `${token.name}`,
              tokenAddChainId: chainId,
            },
            disableTrackingTool: [EventTrackingTools.arcx],
          });
          await addToken(chainId, token);
        },
        addChain: async (chainId: number) => {
          trackEvent({
            category: TrackingCategories.Wallet,
            action: TrackingActions.AddChain,
            label: `addChain-${chainId}`,
            data: {
              chainIdAdded: `${chainId}`,
            },
            // transport: "xhr", // optional, beacon/xhr/image
            disableTrackingTool: [EventTrackingTools.arcx],
          });
          return addChain(chainId);
        },
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
      appearance: !!isDarkMode ? 'dark' : 'light',
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
      localStorageKeyPrefix: `jumper-${starterVariant}`,
      sdkConfig: {
        apiUrl: import.meta.env.VITE_LIFI_API_URL,
        rpcs,
        defaultRouteOptions: {
          maxPriceImpact: 0.4,
        },
      },
      buildSwapUrl: true,
      insurance: true,
      integrator: import.meta.env.VITE_WIDGET_INTEGRATOR,
    };
  }, [
    account.signer,
    addChain,
    addToken,
    disconnect,
    i18n.language,
    i18n.languages,
    isDarkMode,
    onOpenNavbarWalletSelectMenu,
    starterVariant,
    switchChain,
    theme.palette.accent1.main,
    theme.palette.grey,
    theme.palette.surface1.main,
    theme.palette.surface2.main,
    trackEvent,
  ]);

  return (
    <LiFiWidget
      integrator={import.meta.env.VITE_WIDGET_INTEGRATOR as string}
      config={widgetConfig}
    />
  );
}
