import type { Theme } from '@mui/material';
import { Avatar, useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMultisig } from 'src/hooks';
import { useMenuStore, useSettingsStore } from 'src/stores';
import type { MenuListItem } from 'src/types';
import type { Wallet } from '@solana/wallet-adapter-react';
import { getContrastAlphaColor } from 'src/utils';
import type { CombinedWallet } from 'src/hooks/useCombinedWallets';
import { useCombinedWallets } from 'src/hooks/useCombinedWallets';

export const useWalletSelectContent = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { checkMultisigEnvironment } = useMultisig();
  const { combinedInstalledWallets, combinedNotDetectedWallets } =
    useCombinedWallets();
  const isDesktopView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm'),
  );

  const [, setShowWalletIdentityPopover] = useState<Wallet>();
  const [isCurrentMultisigEnvironment, setIsCurrentMultisigEnvironment] =
    useState(false);

  const [clientWallets, onClientWallets] = useSettingsStore((state) => [
    state.clientWallets,
    state.onClientWallets,
  ]);
  const [onOpenSnackbar, onCloseAllMenus] = useMenuStore((state) => [
    state.onOpenSnackbar,
    state.onCloseAllMenus,
  ]);
  const { onWalletConnect, onWelcomeScreenClosed } = useSettingsStore(
    (state) => ({
      onWalletConnect: state.onWalletConnect,
      onWelcomeScreenClosed: state.onWelcomeScreenClosed,
    }),
  );

  useEffect(() => {
    const setupMultiSig = async () =>
      setIsCurrentMultisigEnvironment(await checkMultisigEnvironment());

    setupMultiSig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // const login = useCallback(
  //   async (wallet: Wallet) => {
  //     if (!wallet.installed()) {
  //       setShowWalletIdentityPopover(wallet);
  //       return;
  //     }
  //     await connect(wallet as Wallet | undefined);
  //     onWalletConnect(wallet.name);
  //     try {
  //     } catch (e) {}
  //   },
  //   [connect, onWalletConnect],
  // );

  const login = useCallback((combinedWallet: CombinedWallet) => {
    console.log('useWalletSelectContent > login:', combinedWallet);
  }, []);

  const walletMenuItems = useMemo<MenuListItem[]>(() => {
    const handleClick = async (combinedWallet: CombinedWallet) => {
      if (
        clientWallets.includes(
          (combinedWallet.evm?.id || combinedWallet.svm?.adapter.name) ?? '',
        )
      ) {
        login(combinedWallet);
        onCloseAllMenus();
        onWelcomeScreenClosed(true);
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
            combinedWallet.evm?.id || combinedWallet.svm?.adapter.name
          }' is not installed`,
        );
      }
    };

    const output = availableWallets.map((combinedWallet) => {
      return {
        label:
          (combinedWallet.evm?.id || combinedWallet.svm?.adapter.name) ?? '',
        prefixIcon: (
          <Avatar
            className="wallet-select-avatar"
            src={combinedWallet.evm?.icon || combinedWallet.svm?.adapter.icon}
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
    clientWallets,
    onCloseAllMenus,
    onOpenSnackbar,
    onWelcomeScreenClosed,
    t,
    theme,
  ]);

  return walletMenuItems;
};
