import { Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import { useTheme } from '@mui/material/styles';
import { ButtonBackArrow } from '@transferto/shared/src/atoms/ButtonArrowBack';
import { Dispatch, KeyboardEvent, SetStateAction } from 'react';
import { SubMenuKeys } from '../../const/';
import { useMenu } from '../../providers/MenuProvider';
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
  hideBackArrow: boolean;
  label?: string;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isScrollable?: boolean;
  open: boolean;
  children: any;
}

const NavbarMenuDesktop = ({
  isOpenSubMenu,
  setOpen,
  handleClose,
  hideBackArrow,
  isScrollable,
  label,
  open,
  children,
}: NavbarMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const menu = useMenu();

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
        <NavbarPopper
          open={open}
          anchorEl={menu?.anchorRef?.current}
          role={undefined}
          placement="bottom-start"
          popperOptions={{ strategy: 'fixed' }}
          transition
          disablePortal
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: 'right top',
              }}
            >
              <NavbarPaper
                isDarkMode={isDarkMode}
                isOpenSubMenu={isOpenSubMenu}
                openSubMenu={menu.openNavbarSubMenu}
                isScrollable={!!label || isScrollable}
              >
                <ClickAwayListener
                  onClickAway={(event) => {
                    handleClose(event);
                    menu.onCloseAllNavbarMenus();
                  }}
                >
                  <NavbarMenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    className={
                      isOpenSubMenu
                        ? 'navbar-menu-list open'
                        : 'navbar-menu-list'
                    }
                    component={
                      !!isOpenSubMenu &&
                      menu.openNavbarSubMenu !== SubMenuKeys.wallets
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
                          {!hideBackArrow && (
                            <ButtonBackArrow
                              onClick={() => {
                                menu.onOpenNavbarWalletMenu(
                                  !menu.openNavbarWalletMenu,
                                );
                              }}
                            />
                          )}
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
            </Grow>
          )}
        </NavbarPopper>
      </>
    )
  );
};

export default NavbarMenuDesktop;
