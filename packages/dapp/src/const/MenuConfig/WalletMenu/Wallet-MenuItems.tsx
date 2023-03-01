import { supportedWallets, Wallet } from '@lifi/wallet-management';
import { Avatar } from '@mui/material';
import { useSettings } from '@transferto/shared/src/hooks';
import { useCallback, useMemo, useState } from 'react';
import { useMenu } from '../../../providers/MenuProvider';
import { useWallet } from '../../../providers/WalletProvider';
import { MenuListItem } from '../../../types';

export const useWalletMenuItems = () => {
  const [showWalletIdentityPopover, setShowWalletIdentityPopover] =
    useState<Wallet>();
  const { connect } = useWallet();
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
        },
      });
    });
    return _output;
  }, [login]);

  return _WalletMenuItems;
};
