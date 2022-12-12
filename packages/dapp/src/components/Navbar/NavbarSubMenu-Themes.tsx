import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Paper from '@mui/material/Paper';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import BrightnessAutoOutlinedIcon from '@mui/icons-material/BrightnessAutoOutlined';
import CheckIcon from '@mui/icons-material/Check';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import { IconButton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '@transferto/shared/src';
import { useIsDarkMode } from '../../providers/ThemeProvider';
import { MenuHeaderAppBar, MenuItem, MenuItemLabel } from './Navbar.styled';
import { useTranslation } from 'react-i18next';

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
  const { t: translate } = useTranslation();
  const i18Path = 'Navbar.';
  const settings = useSettings();
  const _isDarkMode = useIsDarkMode();
  const handleSwitchMode = (mode) => {
    settings.onChangeMode(mode);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    !!open && (
      <>
        {openSubMenu === 'themes' && (
          <Paper
            sx={{
              paddingBottom: '12px',
              background: !!_isDarkMode ? '#121212' : '#fff',
              borderRadius: isMobile ? '0' : '12px',
              '> ul': {
                padding: '16px 0',
              },
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
                <>{translate(`${i18Path}NavbarMenu.Theme`)}</>
              </Typography>
            </MenuHeaderAppBar>
            <MenuItem
              sx={{ p: '0 24px', justifyContent: 'space-between' }}
              onClick={() => {
                handleSwitchMode('light');
              }}
            >
              <>
                <MenuItemLabel>
                  <>
                    <LightModeIcon />
                    <Typography
                      fontSize={'14px'}
                      lineHeight={'20px'}
                      ml={'12px'}
                    >
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
              sx={{ p: '0 24px', justifyContent: 'space-between' }}
            >
              <>
                <MenuItemLabel>
                  <>
                    <NightlightOutlinedIcon />
                    <Typography
                      fontSize={'14px'}
                      lineHeight={'20px'}
                      ml={'12px'}
                    >
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
              sx={{ p: '0 24px', justifyContent: 'space-between' }}
            >
              <MenuItemLabel>
                <>
                  <BrightnessAutoOutlinedIcon />
                  <Typography fontSize={'14px'} lineHeight={'20px'} ml={'12px'}>
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
