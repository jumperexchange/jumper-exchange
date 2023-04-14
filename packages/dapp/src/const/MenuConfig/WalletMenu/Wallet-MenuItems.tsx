import { supportedWallets, Wallet } from '@lifi/wallet-management';
import { Avatar } from '@mui/material';
import { MenuContextProps } from '@transferto/shared/src/types';
import { SettingsContextProps } from '@transferto/shared/src/types/settings';
import { useCallback, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { EventTrackingTools } from '../../../hooks/useUserTracking';
import { useUserTracking } from '../../../hooks/useUserTracking/useUserTracking';
import { useWallet } from '../../../providers/WalletProvider';
import { useMenuStore, useSettingsStore } from '../../../stores';
import { MenuListItem } from '../../../types';
import { TrackingActions, TrackingCategories } from '../../trackingKeys';

export const useWalletMenuItems = () => {
  const [showWalletIdentityPopover, setShowWalletIdentityPopover] =
    useState<Wallet>();
  const { connect } = useWallet();
  const { trackEvent } = useUserTracking();
  const { ethereum, tally } = window as any;

  const [onWalletConnect] = useSettingsStore(
    (state: SettingsContextProps) => [state.onWalletConnect],
    shallow,
  );

  const [onCloseAllNavbarMenus, onOpenNavbarWalletMenu] = useMenuStore(
    (state: MenuContextProps) => [
      state.onCloseAllNavbarMenus,
      state.onOpenNavbarWalletMenu,
    ],
    shallow,
  );

  const login = useCallback(
    async (wallet: Wallet) => {
      onCloseAllNavbarMenus();

      if (wallet.checkProviderIdentity) {
        let checkResult;
        if (wallet.name === 'Taho') {
          checkResult = wallet.checkProviderIdentity({ provider: tally });
        } else {
          checkResult = wallet.checkProviderIdentity({ provider: ethereum });
        }

        if (!checkResult) {
          setShowWalletIdentityPopover(wallet);
          return;
        }
      }
      await connect(wallet);
      onWalletConnect(wallet.name);
      onOpenNavbarWalletMenu(false);
      try {
      } catch (e) {}
    },
    [
      connect,
      ethereum,
      onCloseAllNavbarMenus,
      onOpenNavbarWalletMenu,
      onWalletConnect,
      tally,
    ],
  );

  const _WalletMenuItems = useMemo<MenuListItem[]>(() => {
    const _output = [];
    supportedWallets.forEach((wallet, index) => {
      // TODO: overwrite taho name ; REMOVE AfTER WALLET MANAGEMENT v2
      if (wallet.name === 'Tally Ho') {
        wallet.name = 'Taho';
      }
      _output.push({
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
            category: TrackingCategories.WALLET,
            action: TrackingActions.CHOOSE_WALLET,
            label: `choose-wallet-${wallet}`,
            data: { usedWallet: wallet.name },
            disableTrackingTool: [EventTrackingTools.arcx],
          });
        },
      });
    });
    return _output;
  }, [login, trackEvent]);

  return _WalletMenuItems;
};
