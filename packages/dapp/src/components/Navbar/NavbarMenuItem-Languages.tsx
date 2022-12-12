import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LanguageIcon from '@mui/icons-material/Language';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import { Typography } from '@mui/material';
import { FlagGermany, FlagUSA } from '@transferto/shared/src';
import { useLocales } from '@transferto/shared/src';
import { getInitialProps, useTranslation } from 'react-i18next';
import { MenuItem, MenuItemLabel } from './Navbar.styled';

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
  const { t: translate } = useTranslation();
  const i18Path = 'Navbar.';

  return !!open && openSubMenu === 'none' ? (
    <MenuItem
      onClick={() => {
        setOpenSubMenu('language');
      }}
    >
      <>
        <MenuItemLabel>
          <>
            <LanguageIcon className="menu-item-label__icon" />
            <Typography
              className="menu-item-label__text"
              fontSize={'14px'}
              fontWeight={500}
              lineHeight={'20px'}
              ml={'12px'}
            >
              <>{translate(`${i18Path}NavbarMenu.Language`)}</>
            </Typography>
          </>
        </MenuItemLabel>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {getInitialProps().initialLanguage === 'en' && (
            <FlagUSA style={{ marginRight: '8px' }} />
          )}
          {getInitialProps().initialLanguage === 'de' && (
            <FlagGermany style={{ marginRight: '8px' }} />
          )}
          <ChevronRightIcon />
        </div>
      </>
    </MenuItem>
  ) : null;
};

export default NavbarMenuItemLanguage;
