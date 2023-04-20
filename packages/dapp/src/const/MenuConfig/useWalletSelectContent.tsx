import { supportedWallets, Wallet } from '@lifi/wallet-management';
import { Avatar } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useUserTracking } from '../../hooks';
import { useWallet } from '../../providers/WalletProvider';
import { useMenuStore, useSettingsStore } from '../../stores';
import { EventTrackingTools, MenuListItem } from '../../types';
import { TrackingActions, TrackingCategories } from '../trackingKeys';

export const useWalletSelectContent = () => {
  const [, setShowWalletIdentityPopover] = useState<Wallet>();
  const { connect } = useWallet();
  const { trackEvent } = useUserTracking();
  const { ethereum, tally } = window as any;

  const [onWalletConnect] = useSettingsStore(
    (state) => [state.onWalletConnect],
    shallow,
  );

  const [onCloseAllNavbarMenus] = useMenuStore(
    (state) => [state.onCloseAllNavbarMenus],
    shallow,
  );

  const login = useCallback(
    async (wallet: Wallet) => {
      onCloseAllNavbarMenus();
      onWalletConnect(wallet.name);
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
      try {
      } catch (e) {}
    },
    [connect, ethereum, onCloseAllNavbarMenus, onWalletConnect, tally],
  );

  const _WalletMenuItems = useMemo<MenuListItem[]>(() => {
    const _output = supportedWallets.map((wallet, index) => {
      // TODO: overwrite taho name ; REMOVE AfTER WALLET MANAGEMENT v2
      if (wallet.name === 'Tally Ho') {
        wallet.name = 'Taho';
      }
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
    });
    return _output;
  }, [login, trackEvent]);

  return _WalletMenuItems;
};
