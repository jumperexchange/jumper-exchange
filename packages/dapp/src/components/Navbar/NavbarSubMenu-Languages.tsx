import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Paper from '@mui/material/Paper';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import { FlagGermany, FlagUSA } from '@transferto/shared/src/atoms/icons/flags';
import { useLocales, useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';

import {
  MenuHeader,
  MenuHeaderText,
  MenuItem,
  MenuItemLabel,
} from './Navbar.styled';

interface NavbarSubMenuProps {
  open: boolean;
  openSubMenu: string;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
}

const NavbarSubMenuLanguages = ({
  open,
  openSubMenu,
  setOpenSubMenu,
}: NavbarSubMenuProps) => {
  const { translate } = useLocales();
  const i18Path = 'Navbar.';
  const settings = useSettings();
  const { i18n } = useTranslation();

  // Dropdown-Menu - Source: https://mui.com/material-ui/react-menu/

  const handleSwitchLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    settings.onChangeLanguage(newLanguage);
  };

  return (
    !!open && (
      <>
        {openSubMenu === 'language' && (
          <Paper
            sx={{
              width: '288px',
              borderRadius: '12px',
              paddingTop: '16px',
              paddingBottom: '16px',
              '> ul': {
                padding: '16px 0',
              },
            }}
          >
            <MenuHeader
              onClick={() => {
                setOpenSubMenu('none');
              }}
            >
              <>
                <ChevronLeftIcon className="menu-header__icon" />
                <MenuHeaderText>
                  <>{translate(`${i18Path}NavbarMenu.Language`)}</>
                </MenuHeaderText>
              </>
            </MenuHeader>
            <MenuItem
              value={'en'}
              onClick={() => {
                handleSwitchLanguage('en');
              }}
            >
              <MenuItemLabel>
                <>
                  <FlagUSA />
                  {translate(`${i18Path}Languages.English`)}
                </>
              </MenuItemLabel>
            </MenuItem>
            <MenuItem
              value={'de'}
              onClick={() => {
                handleSwitchLanguage('de');
              }}
            >
              <MenuItemLabel>
                <>
                  <FlagGermany />
                  {translate(`${i18Path}Languages.German`)}
                </>
              </MenuItemLabel>
            </MenuItem>
          </Paper>
        )}
      </>
    )
  );
};

export default NavbarSubMenuLanguages;
