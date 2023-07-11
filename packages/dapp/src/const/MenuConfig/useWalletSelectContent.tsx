import { supportedWallets, Wallet } from '@lifi/wallet-management';
import { Avatar } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUserTracking } from '../../hooks';
import { useWallet } from '../../providers/WalletProvider';
import { useMenuStore, useSettingsStore } from '../../stores';
import { EventTrackingTools, MenuListItem } from '../../types';
import { TrackingActions, TrackingCategories } from '../trackingKeys';
import { useMultisig } from '../../hooks/useMultisig';

export const useWalletSelectContent = () => {
  const [, setShowWalletIdentityPopover] = useState<Wallet>();
  const { connect } = useWallet();
  const { trackEvent } = useUserTracking();
  const [isCurrentMultisigEnvironment, setIsCurrentMultisigEnvironment] =
    useState(false);

  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);

  const { checkMultisigEnvironment } = useMultisig();

  const initializeWalletSelect = async () => {
    Promise.all(supportedWallets.map((wallet) => wallet.installed())).then(
      (installed) => {
        // separate into installed and not installed wallets
        const installedWallets = supportedWallets.filter(
          (_, index) => installed[index],
        );
        // always remove Default Wallet from not installed Wallets
        const notInstalledWallets = supportedWallets.filter(
          (wallet, index) =>
            !installed[index] && wallet.name !== 'Default Wallet',
        );
        setAvailableWallets([...installedWallets, ...notInstalledWallets]);
      },
    );

    const isMultisig = await checkMultisigEnvironment();

    if (isMultisig) {
      setIsCurrentMultisigEnvironment(true);
    } else {
      setIsCurrentMultisigEnvironment(false);
    }
  };

  const onWalletConnect = useSettingsStore((state) => state.onWalletConnect);
  const [onWelcomeScreenEntered] = useSettingsStore((state) => [
    state.onWelcomeScreenEntered,
  ]);
  const onCloseAllNavbarMenus = useMenuStore(
    (state) => state.onCloseAllNavbarMenus,
  );
  const { account } = useWallet();

  const login = useCallback(
    async (wallet: Wallet) => {
      if (!wallet.installed()) {
        setShowWalletIdentityPopover(wallet);
        return;
      }
      await connect(wallet);
      onWalletConnect(wallet.name);
      try {
      } catch (e) {}
    },
    [connect, onWalletConnect],
  );

  useEffect(() => {
    initializeWalletSelect();
  }, [account?.address]);

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
            action: TrackingActions.ChooseWallet,
            label: `choose-wallet-${wallet}`,
            data: { usedWallet: wallet.name },
            disableTrackingTool: [EventTrackingTools.arcx],
          });
        },
      };
    });
    return _output;
  }, [
    availableWallets.length,
    isCurrentMultisigEnvironment,
    login,
    onCloseAllNavbarMenus,
    onWelcomeScreenEntered,
    trackEvent,
  ]);

  return walletMenuItems;
};
