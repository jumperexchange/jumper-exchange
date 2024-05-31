import type { SxProps, Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MenuDesktop, MenuMobile } from '.';

interface MenuProps {
  isOpenSubMenu?: boolean;
  label?: string;
  setOpen: (open: boolean, anchorRef: HTMLAnchorElement | null) => void;
  cardsLayout?: boolean;
  styles?: SxProps<Theme>;
  keepMounted?: boolean;
  open: boolean;
  children: React.ReactNode;
  width?: string;
  anchorEl?: HTMLAnchorElement;
}

export const Menu = ({
  open,
  setOpen,
  cardsLayout,
  styles,
  keepMounted,
  width,
  label,
  isOpenSubMenu,
  children,
  anchorEl,
}: MenuProps) => {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  return isDesktop ? (
    <MenuDesktop
      label={label}
      open={open}
      styles={styles}
      keepMounted={keepMounted}
      width={width}
      cardsLayout={cardsLayout}
      setOpen={setOpen}
      isOpenSubMenu={isOpenSubMenu || false}
      anchorEl={anchorEl}
    >
      {children}
    </MenuDesktop>
  ) : (
    <MenuMobile
      label={label}
      open={open}
      styles={styles}
      keepMounted={keepMounted}
      cardsLayout={cardsLayout}
      isOpenSubMenu={isOpenSubMenu || false}
    >
      {children}
    </MenuMobile>
  );
};
