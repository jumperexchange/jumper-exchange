import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Typography } from '@mui/material';
import { useLocales, useSettings } from '@transferto/shared/src/hooks';
import { Dispatch, SetStateAction } from 'react';
import { MenuButton, MenuItem } from './Navbar.styled';

interface NavbarMenuItemProps {
  open: boolean;
  openSubMenu: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  disconnect: any;
}

const NavbarWalletMenuItemDisconnect = ({
  open,
  openSubMenu,
  setOpen,
  disconnect,
}: NavbarMenuItemProps) => {
  const { translate } = useLocales();
  const i18Path = 'Navbar.WalletMenu.';
  const settings = useSettings();

  return !!open && openSubMenu === 'none' ? (
    <MenuItem
      sx={{ p: '0 24px', mt: 2 }}
      onClick={() => {
        disconnect();
        setOpen(false);
        settings.onWalletDisconnect();
      }}
    >
      <MenuButton sx={{ textTransform: 'none' }}>
        <>
          <Typography
            fontSize={'14px'}
            fontWeight={700}
            lineHeight={'20px'}
            component={'span'}
          >
            <>{translate(`${i18Path}Disconnect`)}</>
          </Typography>
          <PowerSettingsNewIcon
            sx={{
              marginLeft: '9.5px',
            }}
          />
        </>
      </MenuButton>
    </MenuItem>
  ) : null;
};

export default NavbarWalletMenuItemDisconnect;
