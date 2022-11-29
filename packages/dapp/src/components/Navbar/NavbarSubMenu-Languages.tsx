import Paper from '@mui/material/Paper';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import CheckIcon from '@mui/icons-material/Check';
import { FlagGermany, FlagUSA } from '@transferto/shared/src/atoms/icons/flags';
import { useLocales, useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';
import { useIsDarkMode } from '../../providers/ThemeProvider';

import { MenuHeaderAppBar, MenuItem, MenuItemLabel } from './Navbar.styled';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
              borderRadius: isMobile ? '0' : '12px',

              '> ul': {
                padding: '16px 0',
              },
              paddingBottom: '12px',
            }}
          >
            <MenuHeaderAppBar elevation={0}>
              <IconButton
                size="medium"
                aria-label="settings"
                edge="start"
                className="menu-header__icon"
                sx={{
                  color: theme.palette.text.primary,
                  position: 'absolute',
                  marginLeft: '6px',
                }}
                onClick={() => {
                  setOpenSubMenu('none');
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                fontSize={'14px'}
                lineHeight={'20px'}
                width={'100%'}
                align={'center'}
                fontWeight="700"
                flex={1}
                noWrap
              >
                <>{translate(`${i18Path}NavbarMenu.Language`)}</>
              </Typography>
            </MenuHeaderAppBar>
            <MenuItem
              value={'en'}
              onClick={() => {
                handleSwitchLanguage('en');
              }}
            >
              <MenuItemLabel>
                <>
                  <FlagUSA />
                  <Typography fontSize={'14px'} lineHeight={'20px'} ml={'12px'}>
                    <>{translate(`${i18Path}Languages.English`)}</>
                  </Typography>
                </>
              </MenuItemLabel>
              {settings.languageMode === 'en' && <CheckIcon />}
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
                  <Typography fontSize={'14px'} lineHeight={'20px'} ml={'12px'}>
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
