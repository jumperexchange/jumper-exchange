import { Slide, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useTheme } from '@mui/material/styles';
import { KeyboardEvent } from 'react';
import { MenuKeys } from '../../const';
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
  setOpen: (open: boolean, anchorRef: any) => void;
  label?: string;
  open: boolean;
  children: any;
}

const NavbarMenuMobile = ({
  handleClose,
  open,
  setOpen,
  label,
  isOpenSubMenu,
  children,
}: NavbarMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [openNavbarSubMenu, anchorRef, onCloseAllNavbarMenus] = useMenuStore(
    (state) => [
      state.openNavbarSubMenu,
      state.anchorRef,
      state.onCloseAllNavbarMenus,
    ],
  );

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
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <NavbarPopper
            open={open}
            anchorEl={anchorRef}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
          >
            <NavbarPaper isDarkMode={isDarkMode}>
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
                  isOpenSubMenu={openNavbarSubMenu !== MenuKeys.None}
                  onKeyDown={handleListKeyDown}
                  autoFocus={open}
                  hasLabel={!!label}
                  component={
                    !!isOpenSubMenu &&
                    openNavbarSubMenu !== MenuKeys.WalletSelect
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
          </NavbarPopper>
        </Slide>
      </>
    )
  );
};

export default NavbarMenuMobile;
