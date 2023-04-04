import { Token } from '@lifi/sdk';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '../providers/hotfix/wallet-automation-hotfix';
import { HiddenUI, WidgetConfig } from '@lifi/widget';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenu } from '../providers/MenuProvider';
import { useWallet } from '../providers/WalletProvider';
import { LanguageKey } from '../types/i18n';
import { EventTrackingTools } from './useUserTracking';
import { useUserTracking } from './useUserTracking/useUserTracking';

export function useWidgetConfig({ starterVariant }) {
  const menu = useMenu();
  const theme = useTheme();
  const { disconnect, account } = useWallet();
  const { i18n } = useTranslation();
  const isDarkMode = theme.palette.mode === 'dark';
  const { trackEvent, trackAttribute } = useUserTracking();

  const widgetConfig: WidgetConfig = useMemo(() => {
    let rpcs = {};
    try {
      rpcs = JSON.parse(import.meta.env.VITE_CUSTOM_RPCS);
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('Parsing custom rpcs failed', e);
      }
    }
    return {
      variant: starterVariant ? starterVariant : 'expandable',
      walletManagement: {
        signer: account.signer,
        connect: async () => {
          menu.onOpenNavbarWalletMenu(
            !!menu.openNavbarWalletMenu ? false : true,
          );
          let promiseResolver: (value: void | PromiseLike<void>) => void;
          const loginAwaiter = new Promise<void>(
            (resolve) => (promiseResolver = resolve),
          );

          await loginAwaiter;
          if (account.signer) {
            return account.signer!;
          } else {
            throw Error('No signer object after login');
          }
        },
        disconnect: async () => {
          trackEvent({
            category: 'wallet',
            action: 'disconnect',
            label: 'widget',
            data: { source: 'widget' },
            disableTrackingTool: [EventTrackingTools.arcx],
          });
          disconnect();
        },
        switchChain: async (reqChainId: number) => {
          await switchChain(reqChainId);
          if (account.signer) {
            trackEvent({
              category: 'wallet',
              action: 'switch-chain',
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
            category: 'wallet',
            action: 'add-token',
            label: `${token}`,
            data: {
              tokenAdded: `${token}`,
              tokenAddChainId: chainId,
            },
            disableTrackingTool: [EventTrackingTools.arcx],
          });
          await switchChainAndAddToken(chainId, token);
        },
        addChain: async (chainId: number) => {
          trackEvent({
            category: 'wallet',
            action: 'add-chain',
            label: `${chainId}`,
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
      },
    };
  }, [
    starterVariant,
    account.signer,
    isDarkMode,
    i18n.language,
    i18n.languages,
    theme.palette.surface2.main,
    theme.palette.surface1.main,
    theme.palette.accent1.main,
    theme.palette.grey,
    menu,
    trackEvent,
    disconnect,
  ]);

  return widgetConfig;
}
