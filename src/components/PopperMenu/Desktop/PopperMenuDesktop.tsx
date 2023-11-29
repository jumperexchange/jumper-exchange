import type { CSSObject } from '@mui/material';
import { Fade, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
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
  cardsLayout?: boolean;
  styles?: CSSObject;
  setOpen: (open: boolean, anchorRef: any) => void;
  open: boolean;
  children: any;
}

export const PopperMenuDesktop = ({
  isOpenSubMenu,
  setOpen,
  handleClose,
  styles,
  transformOrigin,
  cardsLayout,
  label,
  open,
  children,
}: PopperMenuProps) => {
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

  return open ? (
    <>
      <PopperExternalBackground />
      <NavbarPopper
        open={open}
        anchorEl={anchorRef}
        role={undefined}
        popperOptions={{ strategy: 'fixed' }}
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: transformOrigin || 'top',
            }}
          >
            <PopperPaper isWide={openWalletPopper}>
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
                  cardsLayout={cardsLayout}
                  hasLabel={!!label}
                  sx={styles}
                  component={
                    isOpenSubMenu && openSubMenuPopper !== MenuMain.WalletSelect
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
          </Fade>
        )}
      </NavbarPopper>
    </>
  ) : null;
};
