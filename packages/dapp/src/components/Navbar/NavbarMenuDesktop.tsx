import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import { useTheme } from '@mui/material/styles';
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
} from './Navbar.styled';
interface NavbarMenuProps {
  isOpenSubMenu: boolean;
  anchorRef: any; // TODO: Replace this any with the correct type
  bgColor: string;
  hideBackArrow: boolean;
  label?: string;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isScrollable?: boolean;
  scrollableMainLayer?: boolean;
  open: boolean;
  children: any;
}

const NavbarMenuDesktop = ({
  isOpenSubMenu,
  anchorRef,
  setOpen,
  bgColor,
  handleClose,
  hideBackArrow,
  isScrollable,
  scrollableMainLayer,
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
          anchorEl={anchorRef.current}
          role={undefined}
          // isScrollable={isScrollable}
          placement="bottom-start"
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
                scrollableMainLayer={scrollableMainLayer}
                isOpenSubMenu={isOpenSubMenu}
                openSubMenu={menu.openNavbarSubMenu}
                bgColor={bgColor}
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
                          scrollableMainLayer={scrollableMainLayer}
                          isScrollable={isScrollable}
                        >
                          {!hideBackArrow && (
                            <IconButton
                              size="medium"
                              aria-label="settings"
                              edge="start"
                              sx={{
                                color: theme.palette.text.primary,
                                position: 'absolute',
                              }}
                              onClick={() => {
                                menu.onOpenNavbarWalletMenu(
                                  !menu.openNavbarWalletMenu,
                                );
                              }}
                            >
                              <ArrowBackIcon />
                            </IconButton>
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
