// import {default as NavbarLinks} from './NavbarLinks'
import { wallets } from '@lifi/wallet-management/wallets';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Avatar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { walletDigest } from '@transferto/shared';
import { useLocales } from '@transferto/shared/src/hooks';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { MenuItem, MenuItemLabel } from './Navbar.styled';

interface NavbarMenuItemProps {
  open: boolean;
  openSubMenu: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  walletManagement: any;
}

export type TWallet = {
  name: string;
  icon: string;
};
export type TWallets = {
  [key: string]: TWallet;
};

const NavbarWalletMenuItemActiveWallet = ({
  open,
  openSubMenu,
  setOpen,
  walletManagement,
}: NavbarMenuItemProps) => {
  const { account, usedWallet } = walletManagement;
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const theme = useTheme();
  const walletSource: TWallets = wallets;
  const walletIcon: string = useMemo(() => {
    if (!!usedWallet) {
      return usedWallet.icon;
    } else {
      const walletKey: any = Object.keys(walletSource).filter(
        (el) => walletSource[el].name === localStorage.activeWalletName,
      );
      return walletSource[walletKey].icon;
    }
  }, [account]);

  const _walletDigest = useMemo(() => {
    return walletDigest(account);
  }, [account]);

  return (
    !!open && (
      <>
        {openSubMenu === 'none' && (
          <MenuItem
            onClick={() => {
              navigator?.clipboard?.writeText(account.address);
              setCopiedToClipboard(true);
            }}
          >
            <MenuItemLabel>
              <>
                <Avatar
                  className="menu-item-label__icon"
                  src={walletIcon}
                  // alt={`${!!usedWallet.name ? usedWallet.name : ''}wallet-logo`}
                  sx={{
                    height: '32px',
                    width: '32px',
                  }}
                />
                <Typography
                  className="menu-item-label__text"
                  fontSize={'14px'}
                  ml={'12px'}
                  fontWeight={500}
                  lineHeight={'20px'}
                >
                  <>{_walletDigest}</>
                </Typography>
              </>
            </MenuItemLabel>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {!!copiedToClipboard ? (
                <CheckIcon sx={{ color: theme.palette.success.main }} />
              ) : (
                <ContentCopyIcon />
              )}
            </div>
          </MenuItem>
        )}
      </>
    )
  );
};

export default NavbarWalletMenuItemActiveWallet;
