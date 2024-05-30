import { MenuKeysEnum, MenuMain } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu/MenuStore';
import type { SxProps, Theme } from '@mui/material';
import { ClickAwayListener, Fade, Typography } from '@mui/material';
import type { KeyboardEvent } from 'react';
import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  MenuList,
  MenuPaper,
  MenuPopper,
} from './Menu.style';
interface MenuProps {
  isOpenSubMenu: boolean;
  label?: string;
  transformOrigin?: string;
  cardsLayout?: boolean;
  styles?: SxProps<Theme>;
  keepMounted?: boolean;
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
  keepMounted,
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

  return (
    <ClickAwayListener
      touchEvent={'onTouchStart'}
      mouseEvent={'onMouseDown'}
      onClickAway={(event) => {
        setTimeout(() => {
          event.stopPropagation();
          event.preventDefault();
          open && closeAllMenus();
        }, 150);
      }}
    >
      <MenuPopper
        open={open}
        anchorEl={anchorEl}
        keepMounted={keepMounted}
        transition
        placement="bottom-end"
      >
        {({ TransitionProps }) => (
          <Fade
            {...TransitionProps}
            in={open}
            style={{
              transformOrigin: transformOrigin || 'top',
            }}
          >
            <MenuPaper show={open} width={width} className="menu-paper">
              <MenuList
                autoFocusItem={open}
                id="main-burger-menu"
                autoFocus={open}
                isOpenSubMenu={openSubMenu !== MenuKeysEnum.None}
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
            </MenuPaper>
          </Fade>
        )}
      </MenuPopper>
    </ClickAwayListener>
  );
};
