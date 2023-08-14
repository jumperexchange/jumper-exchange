import { Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import { useTheme } from '@mui/material/styles';
import { KeyboardEvent } from 'react';
import { MenuKeys, MenuMain } from '../../const/';
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
  label?: string;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  transformOrigin?: string;
  setOpen: (open: boolean, anchorRef: any) => void;
  open: boolean;
  children: any;
}

const NavbarMenuDesktop = ({
  isOpenSubMenu,
  setOpen,
  handleClose,
  transformOrigin,
  label,
  open,
  children,
}: NavbarMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [
    openNavbarSubMenu,
    onCloseAllNavbarMenus,
    openNavbarWalletMenu,
    anchorRef,
  ] = useMenuStore((state) => [
    state.openNavbarSubMenu,
    state.onCloseAllNavbarMenus,
    state.openNavbarWalletMenu,
    state.anchorRef,
  ]);

  function handleListKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false, null);
    } else if (event.key === 'Escape') {
      setOpen(false, null);
    }
  }

  return (
    !!open && (
      <>
        <NavbarExternalBackground />
        <NavbarPopper
          open={open}
          anchorEl={anchorRef}
          role={undefined}
          // placement="bottom"
          popperOptions={{ strategy: 'fixed' }}
          transition
          disablePortal
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: transformOrigin || 'top',
              }}
            >
              <NavbarPaper
                isDarkMode={isDarkMode}
                isWide={openNavbarWalletMenu}
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
                    autoFocus={open}
                    isOpenSubMenu={openNavbarSubMenu !== MenuKeys.None}
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    hasLabel={!!label}
                    component={
                      !!isOpenSubMenu &&
                      openNavbarSubMenu !== MenuMain.WalletSelect
                        ? 'div'
                        : 'ul'
                    }
                  >
                    {!!label ? (
                      <MenuHeaderAppWrapper>
                        <MenuHeaderAppBar component="div" elevation={0}>
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
