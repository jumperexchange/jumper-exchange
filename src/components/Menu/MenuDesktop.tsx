import type { CSSObject } from '@mui/material';
import { Fade, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import type { KeyboardEvent } from 'react';
import {
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
  transformOrigin?: string;
  cardsLayout?: boolean;
  styles?: CSSObject;
  setOpen: (open: boolean, anchorRef: any) => void;
  open: boolean;
  children: any;
  width?: string;
  anchorEl: any;
}

export const MenuDesktop = ({
  isOpenSubMenu,
  setOpen,
  styles,
  transformOrigin,
  cardsLayout,
  width,
  label,
  open,
  children,
  anchorEl,
}: MenuProps) => {
  const { openSubMenu, closeAllMenus } = useMenuStore((state) => state);

  function handleListKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      setOpen(false, null);
    }
  }

  return open ? (
    <>
      <MenuPopper
        open={open}
        anchorEl={anchorEl}
        popperOptions={{ strategy: 'fixed' }}
        transition
        disablePortal
        placement="bottom"
      >
        {({ TransitionProps }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: transformOrigin || 'top',
            }}
          >
            <MenuPaper width={width}>
              <ClickAwayListener
                onClickAway={(event) => {
                  closeAllMenus();
                }}
              >
                <MenuList
                  autoFocusItem={open}
                  id="main-burger-menu"
                  autoFocus={open}
                  isOpenSubMenu={openSubMenu !== MenuKeys.None}
                  aria-labelledby="main-burger-menu"
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
