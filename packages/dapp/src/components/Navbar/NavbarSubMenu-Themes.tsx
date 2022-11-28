import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Paper from '@mui/material/Paper';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import BrightnessAutoOutlinedIcon from '@mui/icons-material/BrightnessAutoOutlined';
import CheckIcon from '@mui/icons-material/Check';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import { Typography } from '@mui/material';
import { useLocales, useSettings } from '@transferto/shared/src/hooks';
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
  const _isDarkMode = useIsDarkMode();
  const handleSwitchMode = (mode) => {
    settings.onChangeMode(mode);
  };

  return (
    !!open && (
      <>
        {openSubMenu === 'themes' && (
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
                  <>{translate(`${i18Path}NavbarMenu.Theme`)}</>
                </Typography>
              </>
            </MenuHeader>
            <MenuItem
              onClick={() => {
                handleSwitchMode('light');
              }}
              sx={{ justifyContent: 'space-between', p: 0 }}
            >
              <>
                <MenuItemLabel>
                  <>
                    <LightModeIcon />
                    <Typography fontSize={'14px'} lineHeight={'20px'}>
                      <>{translate(`${i18Path}Themes.Light`)}</>
                    </Typography>
                  </>
                </MenuItemLabel>
                {settings.themeMode === 'light' && <CheckIcon />}
              </>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSwitchMode('dark');
              }}
              sx={{ justifyContent: 'space-between', p: 0 }}
            >
              <>
                <MenuItemLabel>
                  <>
                    <NightlightOutlinedIcon />
                    <Typography fontSize={'14px'} lineHeight={'20px'}>
                      <>{translate(`${i18Path}Themes.Dark`)}</>
                    </Typography>
                  </>
                </MenuItemLabel>
                {settings.themeMode === 'dark' && <CheckIcon />}
              </>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSwitchMode('auto');
              }}
              sx={{ justifyContent: 'space-between', p: 0 }}
            >
              <MenuItemLabel>
                <>
                  <BrightnessAutoOutlinedIcon />
                  <Typography fontSize={'14px'} lineHeight={'20px'}>
                    <>{translate(`${i18Path}Themes.Auto`)}</>
                  </Typography>
                </>
              </MenuItemLabel>
              {settings.themeMode === 'auto' && <CheckIcon />}
            </MenuItem>
          </Paper>
        )}
      </>
    )
  );
};

export default NavbarSubMenuLanguages;
