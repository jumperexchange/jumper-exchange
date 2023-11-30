import type { CSSObject } from '@mui/material';
import { Slide, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {
  ExternalBackground,
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  MenuList,
  MenuPaper,
  MenuPopper,
} from 'src/components';
import { MenuKeys } from 'src/const';
import { useMenuStore } from 'src/stores';

interface MenuProps {
  isOpenSubMenu: boolean;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: (open: boolean, anchorRef: any) => void;
  cardsLayout?: boolean;
  styles?: CSSObject;
  label?: string;
  open: boolean;
  children: any;
}

export const MenuMobile = ({
  handleClose,
  open,
  setOpen,
  cardsLayout,
  label,
  styles,
  isOpenSubMenu,
  children,
}: MenuProps) => {
  const [openSubMenu, anchorRef, onCloseAllMenus] = useMenuStore((state) => [
    state.openSubMenu,
    state.anchorRef,
    state.onCloseAllMenus,
  ]);

  return (
    open && (
      <>
        <ExternalBackground />
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <MenuPopper
            open={open}
            anchorEl={anchorRef}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
          >
            <MenuPaper isMobile={true}>
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
                  cardsLayout={cardsLayout}
                  hasLabel={!!label}
                  sx={styles}
                  component={
                    isOpenSubMenu && openSubMenu !== MenuKeys.WalletSelect
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
          </MenuPopper>
        </Slide>
      </>
    )
  );
};
