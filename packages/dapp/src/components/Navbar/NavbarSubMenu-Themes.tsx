import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Paper from '@mui/material/Paper';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import BrightnessAutoOutlinedIcon from '@mui/icons-material/BrightnessAutoOutlined';
import CheckIcon from '@mui/icons-material/Check';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import { useLocales, useSettings } from '@transferto/shared/src/hooks';

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

  return (
    !!open && (
      <>
        {openSubMenu === 'themes' && (
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
                  <>{translate(`${i18Path}NavbarMenu.Theme`)}</>
                </MenuHeaderText>
              </>
            </MenuHeader>
            <MenuItem
              value={'en'}
              onClick={() => {
                console.log('set to light mode');
              }}
              sx={{ justifyContent: 'space-between' }}
            >
              <>
                <MenuItemLabel>
                  <>
                    <LightModeIcon />
                    {translate(`${i18Path}Themes.Light`)}
                  </>
                </MenuItemLabel>
                {settings.themeMode === 'light' && <CheckIcon />}
              </>
            </MenuItem>
            <MenuItem
              onClick={() => {
                console.log('set to dark mode');
              }}
              sx={{ justifyContent: 'space-between' }}
            >
              <>
                <MenuItemLabel>
                  <>
                    <NightlightOutlinedIcon />
                    {translate(`${i18Path}Themes.Dark`)}
                  </>
                </MenuItemLabel>
                {settings.themeMode === 'dark' && <CheckIcon />}
              </>
            </MenuItem>
            <MenuItem
              onClick={() => {
                console.log('set to auto mode');
              }}
              sx={{ justifyContent: 'space-between' }}
            >
              <MenuItemLabel>
                <>
                  <BrightnessAutoOutlinedIcon />
                  {translate(`${i18Path}Themes.Auto`)}
                </>
              </MenuItemLabel>
              {settings.themeMode === 'dark' && <CheckIcon />}
            </MenuItem>
          </Paper>
        )}
      </>
    )
  );
};

export default NavbarSubMenuLanguages;
