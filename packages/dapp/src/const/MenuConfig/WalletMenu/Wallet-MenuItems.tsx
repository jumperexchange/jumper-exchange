import { supportedWallets, Wallet } from '@lifi/wallet-management';
import { Avatar } from '@mui/material';
import { useSettings } from '@transferto/shared/src/hooks';
import { useCallback, useMemo, useState } from 'react';
import { useUserTracking } from '../../../hooks/useUserTracking/useUserTracking';
import { useMenu } from '../../../providers/MenuProvider';
import { useWallet } from '../../../providers/WalletProvider';
import { MenuListItem } from '../../../types';

export const useWalletMenuItems = () => {
  const [showWalletIdentityPopover, setShowWalletIdentityPopover] =
    useState<Wallet>();
  const { connect } = useWallet();
  const { trackEvent } = useUserTracking();
  const { ethereum } = window as any;
  const settings = useSettings();
  const menu = useMenu();

  const login = useCallback(
    async (wallet: Wallet) => {
      menu.onCloseAllNavbarMenus();

      if (wallet.checkProviderIdentity) {
        const checkResult = wallet.checkProviderIdentity(ethereum);
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
          });
        },
      });
    });
    return _output;
  }, []);

  return _WalletMenuItems;
};
