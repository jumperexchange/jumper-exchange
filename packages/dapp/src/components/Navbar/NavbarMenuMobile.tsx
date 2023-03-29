import { Slide, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useTheme } from '@mui/material/styles';
import { MenuContextProps } from '@transferto/shared/src/types';
import { Dispatch, KeyboardEvent, SetStateAction } from 'react';
import { SubMenuKeys } from '../../const';
import { useMenuStore } from '../../stores/menu';
import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  NavbarExternalBackground,
  NavbarMenuList,
  NavbarPaper,
  NavbarPopper,
} from './Navbar.style';

interface NavbarMenuProps {
  isOpenSubMenu: boolean;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isScrollable?: boolean;
  label?: string;
  open: boolean;
  children: any;
}

const NavbarMenuMobile = ({
  isScrollable,
  handleClose,
  open,
  setOpen,
  label,
  isOpenSubMenu,
  children,
}: NavbarMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const openNavbarSubMenu = useMenuStore(
    (state: MenuContextProps) => state.openNavbarSubMenu,
  );
  const anchorRef = useMenuStore((state: MenuContextProps) => state.anchorRef);
  const onCloseAllNavbarMenus = useMenuStore(
    (state: MenuContextProps) => state.onCloseAllNavbarMenus,
  );

  function handleListKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    !!open && (
      <>
        <NavbarExternalBackground />
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <NavbarPopper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
          >
            <NavbarPaper
              isDarkMode={isDarkMode}
              isOpenSubMenu={isOpenSubMenu}
              openSubMenu={openNavbarSubMenu}
              isScrollable={!!label || isScrollable}
            >
              <ClickAwayListener
                onClickAway={(event) => {
                  handleClose(event);
                  onCloseAllNavbarMenus();
                }}
              >
                <NavbarMenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  className={
                    isOpenSubMenu ? 'navbar-menu-list open' : 'navbar-menu-list'
                  }
                  component={
                    !!isOpenSubMenu && openNavbarSubMenu !== SubMenuKeys.wallets
                      ? 'div'
                      : 'ul'
                  }
                >
                  {!!label ? (
                    <MenuHeaderAppWrapper>
                      <MenuHeaderAppBar
                        component="div"
                        elevation={0}
                        isScrollable={isScrollable}
                      >
                        <Typography
                          variant={'lifiBodyMediumStrong'}
                          width={'100%'}
                          align={'center'}
                          flex={1}
                          noWrap
                        >
                          {label}
                        </Typography>
                      </MenuHeaderAppBar>
                    </MenuHeaderAppWrapper>
                  ) : null}
                  {children}
                </NavbarMenuList>
              </ClickAwayListener>
            </NavbarPaper>
          </NavbarPopper>
        </Slide>
      </>
    )
  );
};

export default NavbarMenuMobile;
