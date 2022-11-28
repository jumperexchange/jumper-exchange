import Paper from '@mui/material/Paper';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { Typography } from '@mui/material';
import { FlagGermany, FlagUSA } from '@transferto/shared/src/atoms/icons/flags';
import { useLocales, useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';
import { useIsDarkMode } from '../../providers/ThemeProvider';

import { MenuHeader, MenuItem, MenuItemLabel } from './Navbar.styled';

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
  const _isDarkMode = useIsDarkMode();

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
              background: !!_isDarkMode ? '#121212' : '#fff',
              borderRadius: '12px',
              padding: '12px 24px 24px',

              '> ul': {
                padding: '16px 0',
              },
            }}
          >
            <MenuHeader
              sx={{ height: '48px' }}
              onClick={() => {
                setOpenSubMenu('none');
              }}
            >
              <>
                <ArrowBackIcon className="menu-header__icon" />
                <Typography
                  fontSize={'14px'}
                  fontWeight={700}
                  lineHeight={'20px'}
                  width={'100%'}
                >
                  <>{translate(`${i18Path}NavbarMenu.Language`)}</>
                </Typography>
              </>
            </MenuHeader>
            <MenuItem
              sx={{ p: 0 }}
              value={'en'}
              onClick={() => {
                handleSwitchLanguage('en');
              }}
            >
              <MenuItemLabel>
                <>
                  <FlagUSA />
                  <Typography fontSize={'14px'} lineHeight={'20px'}>
                    <>{translate(`${i18Path}Languages.English`)}</>
                  </Typography>
                </>
              </MenuItemLabel>
              {settings.languageMode === 'en' && <CheckIcon />}
            </MenuItem>
            <MenuItem
              sx={{ p: 0 }}
              value={'de'}
              onClick={() => {
                handleSwitchLanguage('de');
              }}
            >
              <MenuItemLabel>
                <>
                  <FlagGermany />
                  <Typography fontSize={'14px'} lineHeight={'20px'}>
                    <>{translate(`${i18Path}Languages.German`)}</>
                  </Typography>
                </>
              </MenuItemLabel>
              {settings.languageMode === 'de' && <CheckIcon />}
            </MenuItem>
          </Paper>
        )}
      </>
    )
  );
};

export default NavbarSubMenuLanguages;
