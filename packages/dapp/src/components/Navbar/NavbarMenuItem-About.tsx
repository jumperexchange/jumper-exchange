// import {default as NavbarLinks} from './NavbarLinks'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useLocales, useSettings } from '@transferto/shared/src/hooks';

import { MenuItemLabel, MenuItemText, MenuLinkItem } from './Navbar.styled';
interface NavbarMenuItemProps {
  open: boolean;
  openSubMenu: string;
}

const NavbarMenuItemAbout = ({ open, openSubMenu }: NavbarMenuItemProps) => {
  const { translate } = useLocales();
  const i18Path = 'Navbar.';
  const settings = useSettings();

  // Dropdown-Menu - Source: https://mui.com/material-ui/react-menu/
  return (
    !!open && (
      <>
        {openSubMenu == 'none' && (
          <MenuLinkItem target="_blank" href={'https://li.fi'}>
            <>
              <MenuItemLabel>
                <>
                  <InfoOutlinedIcon />
                  <MenuItemText className="menu-item-label__text">
                    <>{translate(`${i18Path}NavbarMenu.AboutLIFI`)}</>
                  </MenuItemText>
                </>
              </MenuItemLabel>
            </>
          </MenuLinkItem>
        )}
      </>
    )
  );
};

export default NavbarMenuItemAbout;
