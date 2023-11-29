import type { CSSObject } from '@mui/material';
import { Slide, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
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
  cardsLayout?: boolean;
  styles?: CSSObject;
  label?: string;
  open: boolean;
  children: any;
}

export const PopperMenuMobile = ({
  handleClose,
  open,
  setOpen,
  cardsLayout,
  label,
  styles,
  isOpenSubMenu,
  children,
}: PopperMenuProps) => {
  const [openSubMenuPopper, anchorRef, onCloseAllPopperMenus] = useMenuStore(
    (state) => [
      state.openSubMenuPopper,
      state.anchorRef,
      state.onCloseAllPopperMenus,
    ],
  );

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
            <PopperPaper isMobile={true}>
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
                  cardsLayout={cardsLayout}
                  hasLabel={!!label}
                  sx={styles}
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
