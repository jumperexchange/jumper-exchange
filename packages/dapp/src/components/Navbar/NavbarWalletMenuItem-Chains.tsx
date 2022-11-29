import { ExtendedChain } from '@lifi/types';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import { Avatar, Typography } from '@mui/material';
import { useLocales } from '@transferto/shared/src/hooks';
import { MenuItem, MenuItemLabel } from './Navbar.styled';
interface NavbarMenuItemProps {
  open: boolean;
  activeChain: ExtendedChain;
  openSubMenu: string;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
  walletManagement: any;
}

const NavbarWalletMenuItemChains = ({
  open,
  openSubMenu,
  activeChain,
  setOpenSubMenu,
}: NavbarMenuItemProps) => {
  const { translate } = useLocales();
  const i18Path = 'Navbar.WalletMenu.';

  return !!open && openSubMenu === 'none' ? (
    <MenuItem
      onClick={() => {
        setOpenSubMenu('language');
      }}
    >
      <>
        <MenuItemLabel>
          <>
            {!!activeChain?.logoURI ? (
              <Avatar
                className="menu-item-label__icon"
                src={!!activeChain ? activeChain.logoURI : 'empty'}
                alt={`${!!activeChain?.name ? activeChain.name : ''}chain-logo`}
                sx={{ height: '32px', width: '32px' }}
              />
            ) : (
              <ChangeCircleOutlinedIcon
                sx={{ height: '32px', width: '32px' }}
              />
            )}

            <Typography
              className="menu-item-label__text"
              fontSize={'14px'}
              fontWeight={500}
              lineHeight={'20px'}
              ml={'12px'}
            >
              <>
                {!!activeChain?.name
                  ? activeChain?.name
                  : translate(`${i18Path}SwitchChain`)}
              </>
            </Typography>
          </>
        </MenuItemLabel>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronRightIcon />
        </div>
      </>
    </MenuItem>
  ) : null;
};

export default NavbarWalletMenuItemChains;
