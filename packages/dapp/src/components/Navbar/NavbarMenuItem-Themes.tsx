import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { Typography } from '@mui/material';
import { useLocales } from '@transferto/shared/src/hooks';
import { MenuItem, MenuItemLabel } from './Navbar.styled';

interface NavbarMenuItemProps {
  open: boolean;
  openSubMenu: string;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
}

const NavbarMenuItemThemes = ({
  open,
  openSubMenu,
  setOpenSubMenu,
}: NavbarMenuItemProps) => {
  const { translate } = useLocales();
  const i18Path = 'Navbar.';

  return !!open && openSubMenu === 'none' ? (
    <MenuItem
      onClick={() => {
        setOpenSubMenu('themes');
      }}
    >
      <>
        <MenuItemLabel className="menu-item-label">
          <>
            <LightModeOutlinedIcon className="menu-item-label__icon" />
            <Typography
              className="menu-item-label__text"
              fontSize={'14px'}
              fontWeight={500}
              lineHeight={'20px'}
              ml={'12px'}
            >
              <>{translate(`${i18Path}NavbarMenu.Theme`)}</>{' '}
            </Typography>
          </>
        </MenuItemLabel>
        <ChevronRightIcon />
      </>
    </MenuItem>
  ) : null;
};

export default NavbarMenuItemThemes;
