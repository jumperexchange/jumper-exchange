import { supportedWallets, Wallet } from '@lifi/wallet-management';
import { Avatar } from '@mui/material';
import { useSettings } from '@transferto/shared/src/hooks';
import { useCallback, useMemo, useState } from 'react';
import { EventTrackingTools } from '../../../hooks/useUserTracking';
import { useUserTracking } from '../../../hooks/useUserTracking/useUserTracking';
import { useMenu } from '../../../providers/MenuProvider';
import { useWallet } from '../../../providers/WalletProvider';
import { MenuListItem } from '../../../types';
import { TrackingActions, TrackingCategories } from '../../trackingKeys';

export const useWalletSelectMenuItems = () => {
  const [showWalletIdentityPopover, setShowWalletIdentityPopover] =
    useState<Wallet>();
  const { connect } = useWallet();
  const { trackEvent } = useUserTracking();
  const settings = useSettings();
  const menu = useMenu();

  const login = useCallback(
    async (wallet: Wallet) => {
      menu.onCloseAllNavbarMenus();

      if (wallet.installed?.()) {
        setShowWalletIdentityPopover(wallet);
        return;
      }
      await connect(wallet);
      settings.onWalletConnect(wallet.name);
      menu.onOpenNavbarWalletSelectMenu(false);
      try {
      } catch (e) {}
    },
    [connect, menu, settings],
  );

  const _WalletMenuItems = useMemo<MenuListItem[]>(() => {
    const installedWallets = supportedWallets.filter((wallet) =>
      wallet.installed(),
    );

    const notInstalledWallets = supportedWallets.filter(
      (wallet) => !wallet.installed() && wallet.name !== 'Default Wallet', // always remove Default Wallet from not installed Wallets
    );
    const _output = [...installedWallets, ...notInstalledWallets].map(
      (wallet, index) => {
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
  }, [login, trackEvent]);

  return _WalletMenuItems;
};
