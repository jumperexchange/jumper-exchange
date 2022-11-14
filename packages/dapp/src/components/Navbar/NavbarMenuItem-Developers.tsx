import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import { useLocales } from '@transferto/shared/src/hooks';

import { MenuItem, MenuItemLabel, MenuItemText } from './Navbar.styled';

interface NavbarMenuItemProps {
  open: boolean;
  openSubMenu: string;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
}

const NavbarMenuItemDevelopers = ({
  open,
  openSubMenu,
  setOpenSubMenu,
}: NavbarMenuItemProps) => {
  const { translate } = useLocales();
  const i18Path = 'Navbar.';

  // Dropdown-Menu - Source: https://mui.com/material-ui/react-menu/
  return (
    !!open && (
      <>
        {openSubMenu == 'none' && (
          <MenuItem
            onClick={() => {
              setOpenSubMenu('devs');
            }}
          >
            <>
              <MenuItemLabel>
                <>
                  <DeveloperModeIcon className="menu-item-label__icon" />
                  <MenuItemText className="menu-item-label__text">
                    <>{translate(`${i18Path}NavbarMenu.Developers`)}</>
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

export default NavbarMenuItemDevelopers;
