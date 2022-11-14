import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useLocales, useSettings } from '@transferto/shared/src/hooks';

import { MenuItem, MenuItemLabel, MenuItemText } from './Navbar.styled';

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
  const settings = useSettings();

  // Dropdown-Menu - Source: https://mui.com/material-ui/react-menu/
  return (
    !!open && (
      <>
        {openSubMenu == 'none' && (
          <MenuItem
            onClick={() => {
              setOpenSubMenu('themes');
            }}
          >
            <>
              <MenuItemLabel className="menu-item-label">
                <>
                  <LightModeOutlinedIcon className="menu-item-label__icon" />
                  <MenuItemText className="menu-item-label__text">
                    <>{translate(`${i18Path}NavbarMenu.Theme`)}</>
                  </MenuItemText>
                </>
              </MenuItemLabel>
              <ChevronRightIcon />
            </>
          </MenuItem>
        )}
      </>
    )
  );
};

export default NavbarMenuItemThemes;
