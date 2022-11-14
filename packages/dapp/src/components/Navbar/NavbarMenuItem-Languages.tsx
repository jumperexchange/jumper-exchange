import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LanguageIcon from '@mui/icons-material/Language';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import { FlagGermany, FlagUSA } from '@transferto/shared/src/atoms/icons/flags';
import { useLocales, useSettings } from '@transferto/shared/src/hooks';
import { getInitialProps } from 'react-i18next';

import { MenuItem, MenuItemLabel, MenuItemText } from './Navbar.styled';

interface NavbarMenuItemProps {
  open: boolean;
  openSubMenu: string;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
}

const NavbarMenuItemLanguage = ({
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
              setOpenSubMenu('language');
            }}
          >
            <>
              <MenuItemLabel>
                <>
                  <LanguageIcon className="menu-item-label__icon" />
                  <MenuItemText className="menu-item-label__text">
                    <>{translate(`${i18Path}NavbarMenu.Language`)}</>
                  </MenuItemText>
                </>
              </MenuItemLabel>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <>
                  {getInitialProps().initialLanguage === 'en' && (
                    <FlagUSA style={{ marginRight: '8px' }} />
                  )}
                  {getInitialProps().initialLanguage === 'de' && (
                    <FlagGermany style={{ marginRight: '8px' }} />
                  )}
                  <ChevronRightIcon />
                </>
              </div>
            </>
          </MenuItem>
        )}
      </>
    )
  );
};

export default NavbarMenuItemLanguage;
