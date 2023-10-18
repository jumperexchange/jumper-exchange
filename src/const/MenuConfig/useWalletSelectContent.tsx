import type { Wallet } from '@lifi/wallet-management';
import { supportedWallets } from '@lifi/wallet-management';
import type { Theme } from '@mui/material';
import { Avatar, useMediaQuery } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMultisig } from 'src/hooks';
import { useWallet } from 'src/providers';
import { useMenuStore, useSettingsStore } from 'src/stores';
import type { MenuListItem } from 'src/types';

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

  const onCloseAllPopperMenus = useMenuStore(
    (state) => state.onCloseAllPopperMenus,
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
            src={wallet.icon}
            alt={`${wallet.name}-wallet-logo`}
            sx={{ height: '32px', width: '32px' }}
          />
        ),
        showMoreIcon: false,
        onClick: () => {
          login(wallet);
          onCloseAllPopperMenus();
          onWelcomeScreenClosed(true);
        },
      };
    });
    return output;
  }, [
    availableWallets,
    isCurrentMultisigEnvironment,
    login,
    onCloseAllPopperMenus,
    onWelcomeScreenClosed,
  ]);

  return walletMenuItems;
};
