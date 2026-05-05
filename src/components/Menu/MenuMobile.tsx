import { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import type { ReactNode } from 'react';
import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  MenuList,
  MenuPaper,
  MobileDrawer,
} from './Menu.style';

const paperProps = {
  sx: {
    position: 'absolute',
    backgroundImage: 'none',
  },
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
  const { openSubMenu, setMainMenuState } = useMenuStore((state) => state);
  return (
    <MobileDrawer
      anchor="bottom"
      open={open}
      onClose={(_, reason) => {
        if (reason === 'backdropClick') {
          setMainMenuState(false);
        }
      }}
      slots={{
        transition: Fade,
      }}
      slotProps={{
        paper: paperProps,
        transition: {
          timeout: 300,
        },
      }}
      keepMounted={keepMounted}
      disableScrollLock
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      inert={!open}
    >
      <MenuPaper show={open} sx={{ height: '100dvh' }}>
        <MenuList
          autoFocusItem={open}
          id="main-burger-menu"
          isOpenSubMenu={openSubMenu !== MenuKeysEnum.None}
          aria-labelledby="main-burger-menu"
          cardsLayout={cardsLayout}
          hasLabel={!!label}
          sx={styles}
          component={isOpenSubMenu ? 'div' : 'ul'}
        >
          {!!label ? (
            <MenuHeaderAppWrapper>
              <MenuHeaderAppBar as="div" elevation={0}>
                <Typography
                  variant={'bodyMediumStrong'}
                  align={'center'}
                  noWrap
                  sx={{
                    width: '100%',
                    flex: 1,
                  }}
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
