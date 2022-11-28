import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LanguageIcon from '@mui/icons-material/Language';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import { Typography } from '@mui/material';
import { FlagGermany, FlagUSA } from '@transferto/shared/src/atoms/icons/flags';
import { useLocales } from '@transferto/shared/src/hooks';
import { getInitialProps } from 'react-i18next';
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
  const { translate } = useLocales();
  const i18Path = 'Navbar.';
  // Dropdown-Menu - Source: https://mui.com/material-ui/react-menu/
  return !!open && openSubMenu === 'none' ? (
    <MenuItem
      sx={{ p: 0 }}
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
