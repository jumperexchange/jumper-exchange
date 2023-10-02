import { Slide, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
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
import { MenuKeys } from 'src/const';
import { useMenuStore } from 'src/stores';

interface PopperMenuProps {
  isOpenSubMenu: boolean;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: (open: boolean, anchorRef: any) => void;
  label?: string;
  open: boolean;
  children: any;
}

export const PopperMenuMobile = ({
  handleClose,
  open,
  setOpen,
  label,
  isOpenSubMenu,
  children,
}: PopperMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [openSubMenuPopper, anchorRef, onCloseAllPopperMenus] = useMenuStore(
    (state) => [
      state.openSubMenuPopper,
      state.anchorRef,
      state.onCloseAllPopperMenus,
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
    open && (
      <>
        <PopperExternalBackground />
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <NavbarPopper
            open={open}
            anchorEl={anchorRef}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
          >
            <PopperPaper isDarkMode={isDarkMode}>
              <ClickAwayListener
                onClickAway={(event) => {
                  handleClose(event);
                  onCloseAllPopperMenus();
                }}
              >
                <PopperMenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  isOpenSubMenu={openSubMenuPopper !== MenuKeys.None}
                  onKeyDown={handleListKeyDown}
                  autoFocus={open}
                  hasLabel={!!label}
                  component={
                    isOpenSubMenu && openSubMenuPopper !== MenuKeys.WalletSelect
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
          </NavbarPopper>
        </Slide>
      </>
    )
  );
};
