import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Paper from '@mui/material/Paper';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import Github from '@transferto/shared/src/atoms/icons/Github';
import { useLocales, useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';

import {
  MenuHeader,
  MenuHeaderText,
  MenuItemLabel,
  MenuLinkItem,
} from './Navbar.styled';

interface NavbarSubMenuProps {
  open: boolean;
  openSubMenu: string;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
}

const NavbarSubMenuDevelopers = ({
  open,
  openSubMenu,
  setOpenSubMenu,
}: NavbarSubMenuProps) => {
  const { translate } = useLocales();
  const i18Path = 'Navbar.';
  const settings = useSettings();
  const { i18n } = useTranslation();

  const handleSwitchLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    settings.onChangeLanguage(newLanguage);
  };

  return (
    !!open && (
      <>
        {openSubMenu === 'devs' && (
          <Paper
            sx={{
              width: '100%',
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
                  <>{translate(`${i18Path}NavbarMenu.Developers`)}</>
                </MenuHeaderText>
              </>
            </MenuHeader>
            <MenuLinkItem
              href={'https://github.com/lifinance/'}
              target="_blank"
              rel="noreferrer"
            >
              <MenuItemLabel>
                <>
                  <Github />
                  {translate(`${i18Path}Developers.Github`)}
                </>
              </MenuItemLabel>
            </MenuLinkItem>
            <MenuLinkItem href={'https://docs.li.fi/'} target="_blank">
              <MenuItemLabel>
                <>
                  <DescriptionOutlinedIcon />
                  {translate(`${i18Path}Developers.Documentation`)}
                </>
              </MenuItemLabel>
            </MenuLinkItem>
            <MenuLinkItem href={'#'} target="_blank">
              <MenuItemLabel>
                <>
                  <SlideshowIcon />
                  {translate(`${i18Path}Developers.Showcases`)}
                </>
              </MenuItemLabel>
            </MenuLinkItem>
          </Paper>
        )}
      </>
    )
  );
};

export default NavbarSubMenuDevelopers;
