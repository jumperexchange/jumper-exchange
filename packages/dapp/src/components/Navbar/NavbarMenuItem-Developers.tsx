import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import { Typography } from '@mui/material';
import { useLocales } from '@transferto/shared/src';
import { MenuItem, MenuItemLabel } from './Navbar.styled';
import { useTranslation } from 'react-i18next';

interface NavbarMenuItemProps {
  open: boolean;
  openSubMenu: string;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
}

const NavbarMenuItemDevelopers = ({
  open,
  openSubMenu,
  setOpenSubMenu,
}: NavbarMenuItemProps) => {
  const { t: translate } = useTranslation();
  const i18Path = 'Navbar.';

  return (
    !!open && (
      <>
        {openSubMenu === 'none' && (
          <MenuItem
            onClick={() => {
              setOpenSubMenu('devs');
            }}
          >
            <>
              <MenuItemLabel>
                <>
                  <DeveloperModeIcon className="menu-item-label__icon" />
                  <Typography
                    className="menu-item-label__text"
                    fontSize={'14px'}
                    fontWeight={500}
                    lineHeight={'20px'}
                    ml={'12px'}
                  >
                    <>{translate(`${i18Path}NavbarMenu.Developers`)}</>
                  </Typography>
                </>
              </MenuItemLabel>
              <ChevronRightIcon />
            </>
          </MenuItem>
        )}
      </>
    )
  );
};

export default NavbarMenuItemDevelopers;
