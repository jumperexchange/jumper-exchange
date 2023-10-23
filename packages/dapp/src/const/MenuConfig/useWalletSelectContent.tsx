import { supportedWallets, Wallet } from '@lifi/wallet-management';
import { Avatar, Theme, useMediaQuery } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMultisig } from '../../hooks/useMultisig';
import { useWallet } from '../../providers/WalletProvider';
import { useMenuStore, useSettingsStore } from '../../stores';
import { MenuListItem } from '../../types';

export const useWalletSelectContent = () => {
  const isDesktopView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm'),
  );

  const [, setShowWalletIdentityPopover] = useState<Wallet>();
  const { connect, account } = useWallet();
  const [isCurrentMultisigEnvironment, setIsCurrentMultisigEnvironment] =
    useState(false);

  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);

  const { checkMultisigEnvironment } = useMultisig();

  const initializeWalletSelect = async () => {
    const isMultisig = await checkMultisigEnvironment();

    const walletsPromise = supportedWallets.map(
      async (wallet) => await wallet.installed(),
    );

    const walletsInstalled = await Promise.all(walletsPromise);

    // separate into installed and not installed wallets
    const installedWallets = supportedWallets.filter(
      (_, index) => walletsInstalled[index],
    );

    // always remove Default Wallet from not installed Wallets
    const notInstalledWallets = supportedWallets.filter(
      (wallet, index) =>
        !walletsInstalled[index] && wallet.name !== 'Default Wallet',
    );

    const allowedWallets = [...installedWallets];

    if (isDesktopView) {
      allowedWallets.push(...notInstalledWallets);
    }

    setAvailableWallets(allowedWallets);

    if (isMultisig) {
      setIsCurrentMultisigEnvironment(true);
    } else {
      setIsCurrentMultisigEnvironment(false);
    }
  };

  const { onWalletConnect, onWelcomeScreenClosed } = useSettingsStore(
    (state) => ({
      onWalletConnect: state.onWalletConnect,
      onWelcomeScreenClosed: state.onWelcomeScreenClosed,
    }),
  );

  const onCloseAllNavbarMenus = useMenuStore(
    (state) => state.onCloseAllNavbarMenus,
  );

  const login = useCallback(
    async (wallet: Wallet) => {
      if (!wallet.installed()) {
        setShowWalletIdentityPopover(wallet);
        return;
      }
      await connect(wallet as Wallet | undefined);
      onWalletConnect(wallet.name);
      try {
      } catch (e) {}
    },
    [connect, onWalletConnect],
  );

  useEffect(() => {
    initializeWalletSelect();
    // fix: remove 'initializeWalletSelect' from dep´s to fix infinite loop / freeze
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.address]);

  const walletMenuItems = useMemo<MenuListItem[]>(() => {
    const walletsOptions: Wallet[] = availableWallets.filter((wallet) => {
      if (!isCurrentMultisigEnvironment) {
        return wallet.name !== 'Safe';
      }
      return true;
    });

    const output = walletsOptions.map((wallet) => {
      return {
        label: wallet.name,
        prefixIcon: (
          <Avatar
            className="wallet-select-avatar"
            src={wallet.icon}
            alt={`${wallet.name}-wallet-logo`}
            sx={{ height: '48px', width: '48px', objectFit: 'contain' }}
          />
        ),
        showMoreIcon: false,
        onClick: () => {
          login(wallet);
          onCloseAllNavbarMenus();
          onWelcomeScreenClosed(true);
        },
      };
    });
    return output;
  }, [
    availableWallets,
    isCurrentMultisigEnvironment,
    login,
    onCloseAllNavbarMenus,
    onWelcomeScreenClosed,
  ]);

  return walletMenuItems;
};
