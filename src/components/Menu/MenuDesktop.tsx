import type { CSSObject } from '@mui/material';
import { Fade, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import type { KeyboardEvent } from 'react';
import {
  ExternalBackground,
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  MenuList,
  MenuPaper,
  MenuPopper,
} from 'src/components';
import { MenuKeys, MenuMain } from 'src/const';
import { useMenuStore } from 'src/stores';
interface MenuProps {
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

export const MenuDesktop = ({
  isOpenSubMenu,
  setOpen,
  handleClose,
  styles,
  transformOrigin,
  cardsLayout,
  label,
  open,
  children,
}: MenuProps) => {
  const [openSubMenu, onCloseAllMenus, openWalletMenu, anchorRef] =
    useMenuStore((state) => [
      state.openSubMenu,
      state.onCloseAllMenus,
      state.openWalletMenu,
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
      <ExternalBackground />
      <MenuPopper
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
            <MenuPaper isWide={openWalletMenu}>
              <ClickAwayListener
                onClickAway={(event) => {
                  handleClose(event);
                  onCloseAllMenus();
                }}
              >
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  autoFocus={open}
                  isOpenSubMenu={openSubMenu !== MenuKeys.None}
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  cardsLayout={cardsLayout}
                  hasLabel={!!label}
                  sx={styles}
                  component={
                    isOpenSubMenu && openSubMenu !== MenuMain.WalletSelect
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
                </MenuList>
              </ClickAwayListener>
            </MenuPaper>
          </Fade>
        )}
      </MenuPopper>
    </>
  ) : null;
};
