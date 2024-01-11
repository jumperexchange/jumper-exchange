import type { Theme } from '@mui/material';
import { Avatar, useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenuStore, useSettingsStore } from 'src/stores';
import type { MenuListItem } from 'src/types';
import { getContrastAlphaColor } from 'src/utils';
import type { CombinedWallet } from 'src/hooks/useCombinedWallets';
import { useCombinedWallets } from 'src/hooks/useCombinedWallets';
import { getWalletIcon, isWalletInstalled } from '@lifi/wallet-management';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { useConnect, useDisconnect } from 'wagmi';
import { useWallet } from '@solana/wallet-adapter-react';

export const useWalletSelectContent = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { combinedInstalledWallets, combinedNotDetectedWallets } =
    useCombinedWallets();
  const isDesktopView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm'),
  );
  const { connectAsync } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { select, disconnect, connected } = useWallet();

  const { onOpenSnackbar, onCloseAllMenus, onOpenEcosystemSelectMenu } =
    useMenuStore((state) => state);
  const { onWalletConnect, onWelcomeScreenClosed } = useSettingsStore(
    (state) => ({
      onWalletConnect: state.onWalletConnect,
      onWelcomeScreenClosed: state.onWelcomeScreenClosed,
    }),
  );

  const availableWallets = useMemo(() => {
    let allowedWallets = combinedInstalledWallets.slice(0, 7);

    if (isDesktopView) {
      allowedWallets = [
        ...combinedInstalledWallets,
        ...combinedNotDetectedWallets,
      ];
    }

    return allowedWallets;
  }, [combinedInstalledWallets, combinedNotDetectedWallets, isDesktopView]);

  const connectWallet = useCallback(
    async (combinedWallet: CombinedWallet) => {
      if (combinedWallet.evm && combinedWallet.svm) {
        onOpenEcosystemSelectMenu(
          true,
          combinedWallet,
          document.getElementById('connect-wallet-button'),
        );
        return;
      } else if (combinedWallet.evm) {
        wagmiDisconnect();
        await connectAsync({ connector: combinedWallet.evm! });
        onWalletConnect(combinedWallet.evm.name);
      } else if (combinedWallet.svm) {
        if (connected) {
          disconnect();
        }
        select(combinedWallet.svm.adapter.name);
        onWalletConnect(combinedWallet.svm.adapter.name);
      } else {
        onOpenSnackbar(
          true,
          t('navbar.walletSelectMenu.ecosystemSelectMenu.noEcosystemAdapter'),
          'error',
        );
      }
      onCloseAllMenus();
      onWelcomeScreenClosed(true);
    },
    [
      onCloseAllMenus,
      onWelcomeScreenClosed,
      onOpenEcosystemSelectMenu,
      wagmiDisconnect,
      connectAsync,
      onWalletConnect,
      connected,
      select,
      disconnect,
      onOpenSnackbar,
      t,
    ],
  );

  const walletMenuItems = useMemo<MenuListItem[]>(() => {
    const handleClick = async (combinedWallet: CombinedWallet) => {
      if (
        isWalletInstalled(combinedWallet.evm?.id || '') ||
        (combinedWallet.svm &&
          combinedWallet.svm.adapter.readyState !== WalletReadyState.Installed)
      ) {
        connectWallet(combinedWallet);
      } else {
        onCloseAllMenus();
        onOpenSnackbar(
          true,
          t('navbar.walletMenu.walletNotInstalled', {
            wallet:
              (combinedWallet.evm?.id || combinedWallet.svm?.adapter.name) ??
              '',
          }),
          'error',
        );

        console.error(
          `Wallet '${
            combinedWallet.evm?.name || combinedWallet.svm?.adapter.name
          }' is not installed`,
        );
      }
    };

    const output = availableWallets.map((combinedWallet) => {
      return {
        label:
          (combinedWallet.evm?.name || combinedWallet.svm?.adapter.name) ?? '',
        prefixIcon: (
          <Avatar
            className="wallet-select-avatar"
            src={
              combinedWallet.evm?.icon ||
              combinedWallet.svm?.adapter.icon ||
              getWalletIcon(combinedWallet.evm?.id!)
            }
            alt={`${
              combinedWallet.evm?.id || combinedWallet.svm?.adapter.name
            }-wallet-logo`}
            sx={{
              height: '40px',
              width: '40px',
              objectFit: 'contain',
            }}
          />
        ),
        showMoreIcon: false,
        onClick: () => {
          handleClick(combinedWallet);
        },
        styles: {
          '&:hover': {
            backgroundColor: getContrastAlphaColor(theme, '16%'),
          },
        },
      };
    });
    return output;
  }, [
    availableWallets,
    connectWallet,
    onCloseAllMenus,
    onOpenSnackbar,
    t,
    theme,
  ]);

  return walletMenuItems;
};
