import { supportedWallets, Wallet } from '@lifi/wallet-management';
import { Avatar } from '@mui/material';
import { useSettings } from '@transferto/shared/src/hooks';
import { useCallback, useMemo, useState } from 'react';
import { EventTrackingTools } from '../../../hooks/useUserTracking';
import { useUserTracking } from '../../../hooks/useUserTracking/useUserTracking';
import { useMenu } from '../../../providers/MenuProvider';
import { useWallet } from '../../../providers/WalletProvider';
import { MenuListItem } from '../../../types';

export const useWalletMenuItems = () => {
  const [showWalletIdentityPopover, setShowWalletIdentityPopover] =
    useState<Wallet>();
  const { connect } = useWallet();
  const { trackEvent } = useUserTracking();
  const { ethereum, tally } = window as any;
  const settings = useSettings();
  const menu = useMenu();

  const login = useCallback(
    async (wallet: Wallet) => {
      menu.onCloseAllNavbarMenus();

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
      settings.onWalletConnect(wallet.name);
      menu.onOpenNavbarWalletMenu(false);
      try {
      } catch (e) {}
    },
    [connect, ethereum, menu, settings],
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
            category: 'wallet',
            action: 'choose-wallet',
            label: `${wallet}`,
            data: { usedWallet: wallet.name },
            disableTrackingTool: [EventTrackingTools.arcx],
          });
        },
      });
    });
    return _output;
  }, []);

  return _WalletMenuItems;
};
