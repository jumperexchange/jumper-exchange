import { Typography } from '@mui/material';
import Discord from '@transferto/shared/src/atoms/icons/Discord';
import { useLocales } from '@transferto/shared/src/hooks';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { Dispatch, SetStateAction } from 'react';
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
  const { translate } = useLocales();
  const i18Path = 'Navbar.';

  return !!open && openSubMenu === 'none' ? (
    <MenuItem
      sx={{ p: 0, mt: 2 }}
      onClick={() => {
        openInNewTab('https://discord.gg/lifi');
        setOpen(false);
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
