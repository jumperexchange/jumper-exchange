import { supportedWallets, Wallet } from '@lifi/wallet-management';
import { Avatar } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUserTracking } from '../../hooks';
import { useMultisig } from '../../hooks/useMultisig';
import { useWallet } from '../../providers/WalletProvider';
import { useMenuStore, useSettingsStore } from '../../stores';
import { EventTrackingTool, MenuListItem } from '../../types';
import { TrackingActions, TrackingCategories } from '../trackingKeys';

export const useWalletSelectContent = () => {
  const [, setShowWalletIdentityPopover] = useState<Wallet>();
  const { connect, account } = useWallet();
  const { trackEvent } = useUserTracking();
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

    setAvailableWallets([...installedWallets, ...notInstalledWallets]);

    if (isMultisig) {
      setIsCurrentMultisigEnvironment(true);
    } else {
      setIsCurrentMultisigEnvironment(false);
    }
  };

  const { onWalletConnect, onWelcomeScreenEntered } = useSettingsStore(
    (state) => ({
      onWalletConnect: state.onWalletConnect,
      onWelcomeScreenEntered: state.onWelcomeScreenEntered,
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

    const _output = walletsOptions.map((wallet) => {
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
          onCloseAllNavbarMenus();
          onWelcomeScreenEntered(true);
          trackEvent({
            category: TrackingCategories.Wallet,
            action: TrackingActions.SelectWallet,
            label: `choose-wallet-${wallet}`,
            data: { usedWallet: wallet.name },
            disableTrackingTool: [
              EventTrackingTool.ARCx,
              EventTrackingTool.Raleon,
            ],
          });
        },
      };
    });
    return _output;
  }, [
    availableWallets,
    isCurrentMultisigEnvironment,
    login,
    onCloseAllNavbarMenus,
    onWelcomeScreenEntered,
    trackEvent,
  ]);

  return walletMenuItems;
};
