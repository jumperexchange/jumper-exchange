import { Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import { useTheme } from '@mui/material/styles';
import type { KeyboardEvent } from 'react';
import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  NavbarPopper,
  PopperExternalBackground,
  PopperMenuList,
  PopperPaper,
} from 'src/components';
import { MenuKeys, MenuMain } from 'src/const';
import { useMenuStore } from 'src/stores';
interface PopperMenuProps {
  isOpenSubMenu: boolean;
  label?: string;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  transformOrigin?: string;
  setOpen: (open: boolean, anchorRef: any) => void;
  open: boolean;
  children: any;
}

export const PopperMenuDesktop = ({
  isOpenSubMenu,
  setOpen,
  handleClose,
  transformOrigin,
  label,
  open,
  children,
}: PopperMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [
    openSubMenuPopper,
    onCloseAllPopperMenus,
    openWalletPopper,
    anchorRef,
  ] = useMenuStore((state) => [
    state.openSubMenuPopper,
    state.onCloseAllPopperMenus,
    state.openWalletPopper,
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
    open && (
      <>
        <PopperExternalBackground />
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
              <PopperPaper isDarkMode={isDarkMode} isWide={openWalletPopper}>
                <ClickAwayListener
                  onClickAway={(event) => {
                    handleClose(event);
                    onCloseAllPopperMenus();
                  }}
                >
                  <PopperMenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    autoFocus={open}
                    isOpenSubMenu={openSubMenuPopper !== MenuKeys.None}
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    hasLabel={!!label}
                    component={
                      isOpenSubMenu &&
                      openSubMenuPopper !== MenuMain.WalletSelect
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
                  </PopperMenuList>
                </ClickAwayListener>
              </PopperPaper>
            </Grow>
          )}
        </NavbarPopper>
      </>
    )
  );
};
