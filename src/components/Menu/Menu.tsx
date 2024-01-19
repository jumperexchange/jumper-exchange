import type { Breakpoint, SxProps, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MenuDesktop, MenuMobile } from '.';

interface MenuProps {
  isOpenSubMenu?: boolean;
  label?: string;
  setOpen: (open: boolean, anchorRef: any) => void;
  cardsLayout?: boolean;
  styles?: SxProps<Theme>;
  open: boolean;
  children: any;
  width?: string;
  anchorEl: any;
}

export const Menu = ({
  open,
  setOpen,
  cardsLayout,
  styles,
  width,
  label,
  isOpenSubMenu,
  children,
  anchorEl,
}: MenuProps) => {
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up('sm' as Breakpoint));

  return isDesktop ? (
    <MenuDesktop
      label={label}
      open={open}
      styles={styles}
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
      cardsLayout={cardsLayout}
      setOpen={setOpen}
      isOpenSubMenu={isOpenSubMenu || false}
    >
      {children}
    </MenuMobile>
  );
};
