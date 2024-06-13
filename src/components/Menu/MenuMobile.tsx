import { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import type { SxProps, Theme } from '@mui/material';
import { Typography } from '@mui/material';
import type { ReactNode } from 'react';
import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  MenuList,
  MenuPaper,
  MobileDrawer,
} from '.';

const paperProps = {
  sx: (theme: Theme) => ({
    position: 'absolute',
    backgroundImage: 'none',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  }),
};

interface MenuProps {
  isOpenSubMenu: boolean;
  keepMounted?: boolean;
  cardsLayout?: boolean;
  styles?: SxProps<Theme>;
  label?: string;
  open: boolean;
  children: ReactNode;
}

export const MenuMobile = ({
  open,
  cardsLayout,
  label,
  keepMounted,
  styles,
  isOpenSubMenu,
  children,
}: MenuProps) => {
  const { openSubMenu, closeAllMenus } = useMenuStore((state) => state);
  return (
    <MobileDrawer
      anchor="bottom"
      open={open}
      onClose={(_, reason) => {
        reason === 'backdropClick' && closeAllMenus();
      }}
      PaperProps={paperProps}
      keepMounted={keepMounted}
      disableScrollLock
    >
      <MenuPaper show={open} sx={{ height: '100vh' }}>
        <MenuList
          autoFocusItem={open}
          id="main-burger-menu"
          autoFocus={open}
          isOpenSubMenu={openSubMenu !== MenuKeysEnum.None}
          aria-labelledby="main-burger-menu"
          cardsLayout={cardsLayout}
          hasLabel={!!label}
          sx={styles}
          component={
            isOpenSubMenu && openSubMenu !== MenuKeysEnum.WalletSelect
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
    </MobileDrawer>
  );
};
