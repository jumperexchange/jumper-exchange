import { wallets } from '@lifi/wallet-management';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Avatar from '@mui/material/Avatar';
import type { TWallets } from '@transferto/dapp/src/types';
import { SpotButton } from '@transferto/shared/src/atoms';
import { walletDigest } from '@transferto/shared/src/utils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SubMenuKeys } from '../../../../const';
import { useMenu } from '../../../../providers/MenuProvider';
import { useWallet } from '../../../../providers/WalletProvider';
import { NavbarMenu } from '../../index';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}
export const ConnectedMenu = ({ handleClose }: NavbarMenuProps) => {
  const i18Path = 'navbar.walletMenu.';
  const { t: translate } = useTranslation();
  const menu = useMenu();
  const { account, usedWallet } = useWallet();
  const walletSource: TWallets = wallets;
  const walletIcon: string = useMemo(() => {
    if (!!usedWallet) {
      return usedWallet.icon;
    } else {
      const walletKey: any = Object.keys(walletSource).filter(
        (el) => walletSource[el].name === localStorage.activeWalletName,
      );
      return walletSource[walletKey]?.icon || '';
    }
  }, [usedWallet, walletSource]);

  const _walletDigest = useMemo(() => {
    return walletDigest(account);
  }, [account]);

  return !!menu.openNavbarConnectedMenu ? ( //todo, ON ???
    <NavbarMenu
      open={true}
      isScrollable={true}
      setOpen={menu.onOpenNavbarConnectedMenu}
      handleClose={handleClose}
      isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
    >
      <Avatar
        src={walletIcon}
        // alt={`${!!usedWallet.name ? usedWallet.name : ''}wallet-logo`}
        sx={{
          height: '96px',
          width: '96px',
        }}
      />
      <p>{_walletDigest}</p>
      <SpotButton name="name">
        <ContentCopyIcon />
      </SpotButton>
      <SpotButton name="name">
        <LaunchIcon />
      </SpotButton>
      <SpotButton name="name">
        <PowerSettingsNewIcon />
      </SpotButton>
    </NavbarMenu>
  ) : null;
};
