import { Token } from '@lifi/sdk';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '@lifi/wallet-management';
import { HiddenUI, WidgetConfig } from '@lifi/widget';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import ReactGA from 'react-ga';
import { hotjar } from 'react-hotjar';
import { useTranslation } from 'react-i18next';
import { useMenu } from '../providers/MenuProvider';
import { useWallet } from '../providers/WalletProvider';
import { LanguageKey } from '../types/i18n';
import { gaEventTrack } from '../utils/google-analytics';

export function useWidgetConfig({ starterVariant }) {
  const menu = useMenu();
  const theme = useTheme();
  const { disconnect, account } = useWallet();
  const { i18n } = useTranslation();
  const isDarkMode = theme.palette.mode === 'dark';

  const widgetConfig: WidgetConfig = useMemo(() => {
    return {
      variant: starterVariant ? starterVariant : 'expandable',
      walletManagement: {
        signer: account.signer,
        connect: async () => {
          menu.onOpenNavbarWalletMenu(
            !!menu.openNavbarWalletMenu ? false : true,
          );
          let promiseResolver;
          const loginAwaiter = new Promise<void>(
            (resolve) => (promiseResolver = resolve),
          );

          await loginAwaiter;
          if (account.signer) {
            ReactGA.set({
              username: account.address,
              chainId: account.chainId,
              // Other relevant user information
            });
            hotjar.initialized() &&
              hotjar.identify('USER_ID', {
                address: account.address,
                chainId: account.chainId,
              });
            gaEventTrack({
              category: 'walletInteraction',
              action: 'connect',
              label: account.address, // optional
              value: account.chainId, // optional, must be a number
              nonInteraction: false, // optional, true/false
              // transport: "xhr", // optional, beacon/xhr/image
            });
            return account.signer!;
          } else {
            throw Error('No signer object after login');
          }
        },
        disconnect: async () => {
          gaEventTrack({
            category: 'walletInteraction',
            action: 'disconnect',
            label: account?.address, // optional
            value: account?.chainId, // optional, must be a number
            nonInteraction: false, // optional, true/false
            // transport: "xhr", // optional, beacon/xhr/image
          });
          disconnect();
        },
        switchChain: async (reqChainId: number) => {
          await switchChain(reqChainId);
          if (account.signer) {
            gaEventTrack({
              category: 'walletInteraction',
              action: 'switchChain',
              label: account.address, // optional
              value: reqChainId, // optional, must be a number
              nonInteraction: false, // optional, true/false
              // transport: "xhr", // optional, beacon/xhr/image
            });
            return account.signer!;
          } else {
            throw Error('No signer object after chain switch');
          }
        },
        addToken: async (token: Token, chainId: number) => {
          gaEventTrack({
            category: 'walletInteraction',
            action: 'addToken',
            label: account?.address, // optional
            value: chainId, // optional, must be a number
            nonInteraction: false, // optional, true/false
            // transport: "xhr", // optional, beacon/xhr/image
          });
          await switchChainAndAddToken(chainId, token);
        },
        addChain: async (chainId: number) => {
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
        apiUrl: (import.meta as any).env.VITE_LIFI_API_URL,
      },
    };
  }, [
    i18n.language,
    isDarkMode,
    account.signer,
    disconnect,
    theme.palette.mode,
  ]);

  return widgetConfig;
}
