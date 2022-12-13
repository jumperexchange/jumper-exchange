import { Typography } from '@mui/material';
import { Discord } from '@transferto/shared/src';
import { openInNewTab } from '@transferto/shared/src';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuButton, MenuItem } from './Navbar.styled';
interface NavbarMenuItemProps {
  open: boolean;
  openSubMenu: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const NavbarMenuItemSupport = ({
  open,
  openSubMenu,
  setOpen,
}: NavbarMenuItemProps) => {
  const { t: translate } = useTranslation();
  const i18Path = 'Navbar.';

  return !!open && openSubMenu === 'none' ? (
    <MenuItem
      sx={{
        p: '0 24px',
        mt: 2,
      }}
      onClick={() => {
        openInNewTab('https://discord.gg/lifi');
        setOpen(false);
      }}
    >
      <MenuButton
        sx={{
          textTransform: 'none',
        }}
      >
        <>
          <Typography
            fontSize={'14px'}
            fontWeight={700}
            lineHeight={'20px'}
            component={'span'}
          >
            <>{translate(`${i18Path}NavbarMenu.Support`)}</>
          </Typography>
          <Discord
            style={{
              marginLeft: '9.5px',
            }}
          />
        </>
      </MenuButton>
    </MenuItem>
  ) : null;
};

export default NavbarMenuItemSupport;
