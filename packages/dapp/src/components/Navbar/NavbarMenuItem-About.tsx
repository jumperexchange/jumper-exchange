// import {default as NavbarLinks} from './NavbarLinks'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useLocales } from '@transferto/shared/src/hooks';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { Dispatch, SetStateAction } from 'react';
import { MenuItem } from './Navbar.styled';

import { MenuItemLabel, MenuItemText } from './Navbar.styled';
interface NavbarMenuItemProps {
  open: boolean;
  openSubMenu: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const NavbarMenuItemAbout = ({
  open,
  openSubMenu,
  setOpen,
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
              openInNewTab('https://li.fi');
              setOpen(false);
            }}
          >
            <MenuItemLabel>
              <>
                <InfoOutlinedIcon />
                <MenuItemText className="menu-item-label__text">
                  <>{translate(`${i18Path}NavbarMenu.AboutLIFI`)}</>
                </MenuItemText>
              </>
            </MenuItemLabel>
          </MenuItem>
        )}
      </>
    )
  );
};

export default NavbarMenuItemAbout;
