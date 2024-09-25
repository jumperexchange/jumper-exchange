'use client';
import { useAccountConnect } from '@/hooks/useAccounts';
import type { CombinedWallet } from '@/hooks/useCombinedWallets';
import { useCombinedWallets } from '@/hooks/useCombinedWallets';
import { useMenuStore } from '@/stores/menu';
import type { MenuListItem } from '@/types/internal';
import { getContrastAlphaColor } from '@/utils/colors';
import type { CreateConnectorFnExtended } from '@lifi/wallet-management';
import {
  getConnectorIcon,
  isWalletInstalled,
  isWalletInstalledAsync,
} from '@lifi/wallet-management';
import type { Theme } from '@mui/material';
import { Avatar, useMediaQuery, useTheme } from '@mui/material';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { useCallback, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { type Connector } from 'wagmi';

export const useWalletSelectContent = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const { combinedInstalledWallets, combinedNotDetectedWallets } =
    useCombinedWallets();
  const isDesktopView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm'),
  );
  const connect = useAccountConnect();
  const [, setCookie] = useCookies(['welcomeScreenClosed']);

  const { setSnackbarState, closeAllMenus, setEcosystemSelectMenuState } =
    useMenuStore((state) => state);

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
      const isMultiEcosystemWallet =
        [combinedWallet.evm, combinedWallet.svm, combinedWallet.utxo].filter(
          Boolean,
        ).length > 1;
      if (isMultiEcosystemWallet) {
        setEcosystemSelectMenuState(true, combinedWallet);
        return;
      } else if (
        combinedWallet.evm ||
        combinedWallet.svm ||
        combinedWallet.utxo
      ) {
        await connect(combinedWallet);
      } else {
        setSnackbarState(
          true,
          t('navbar.walletSelectMenu.ecosystemSelectMenu.noEcosystemAdapter'),
          'error',
        );
      }
      closeAllMenus();
      setCookie('welcomeScreenClosed', true, { path: '/', sameSite: true });
    },
    [
      closeAllMenus,
      setCookie,
      setEcosystemSelectMenuState,
      connect,
      setSnackbarState,
      t,
    ],
  );

  const walletMenuItems = useMemo<MenuListItem[]>(() => {
    const handleWalletClick = async (combinedWallet: CombinedWallet) => {
      if (
        isWalletInstalled(combinedWallet.evm?.id || '') ||
        isWalletInstalled(combinedWallet.utxo?.id || '') ||
        (await isWalletInstalledAsync(combinedWallet.evm?.id || '')) ||
        (combinedWallet.svm &&
          combinedWallet.svm.adapter.readyState === WalletReadyState.Installed)
      ) {
        connectWallet(combinedWallet);
      } else {
        closeAllMenus();
        setSnackbarState(
          true,
          t('navbar.walletMenu.walletNotInstalled', {
            wallet:
              (combinedWallet.evm?.id ||
                combinedWallet.utxo?.id ||
                combinedWallet.svm?.adapter.name) ??
              '',
          }),
          'error',
        );
      }
    };

    const output = availableWallets.map((combinedWallet) => {
      const walletDisplayName =
        (combinedWallet.evm as CreateConnectorFnExtended)?.displayName ||
        (combinedWallet.evm as Connector)?.name ||
        (combinedWallet.utxo as CreateConnectorFnExtended)?.displayName ||
        (combinedWallet.utxo as Connector)?.name ||
        combinedWallet.svm?.adapter.name ||
        '';
      const walletIcon = getConnectorIcon(
        (combinedWallet.evm as Connector) ||
          (combinedWallet.utxo as Connector) ||
          combinedWallet.svm?.adapter,
      );
      return {
        label: walletDisplayName,
        prefixIcon: (
          <Avatar
            className="wallet-select-avatar"
            src={walletIcon}
            alt={`${
              combinedWallet.evm?.id ||
              combinedWallet.utxo?.id ||
              combinedWallet.svm?.adapter.name
            }-wallet-logo`}
            sx={{
              height: 40,
              width: 40,
              objectFit: 'contain',
            }}
          />
        ),
        showMoreIcon: false,
        onClick: () => {
          handleWalletClick(combinedWallet);
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
    closeAllMenus,
    setSnackbarState,
    t,
    theme,
    trackEvent,
  ]);

  return walletMenuItems;
};
