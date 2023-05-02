import { supportedWallets, Wallet } from '@lifi/wallet-management';
import { Avatar } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useUserTracking } from '../../hooks';
import { useWallet } from '../../providers/WalletProvider';
import { useMenuStore, useSettingsStore } from '../../stores';
import { EventTrackingTools, MenuListItem } from '../../types';
import { TrackingActions, TrackingCategories } from '../trackingKeys';

export const useWalletSelectContent = () => {
  const [, setShowWalletIdentityPopover] = useState<Wallet>();
  const { connect } = useWallet();
  const { trackEvent } = useUserTracking();

  const onWalletConnect = useSettingsStore((state) => state.onWalletConnect);

  const onCloseAllNavbarMenus = useMenuStore(
    (state) => state.onCloseAllNavbarMenus,
  );

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

  const walletMenuItems = useMemo<MenuListItem[]>(() => {
    const installedWallets = supportedWallets.filter((wallet) =>
      wallet.installed(),
    );

    const notInstalledWallets = supportedWallets.filter(
      (wallet) => !wallet.installed() && wallet.name !== 'Default Wallet', // always remove Default Wallet from not installed Wallets
    );
    const _output = [...installedWallets, ...notInstalledWallets].map(
      (wallet) => {
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
            trackEvent({
              category: TrackingCategories.Wallet,
              action: TrackingActions.ChooseWallet,
              label: `choose-wallet-${wallet}`,
              data: { usedWallet: wallet.name },
              disableTrackingTool: [EventTrackingTools.arcx],
            });
          },
        };
      },
    );
    return _output;
  }, [login, onCloseAllNavbarMenus, trackEvent]);

  return walletMenuItems;
};
