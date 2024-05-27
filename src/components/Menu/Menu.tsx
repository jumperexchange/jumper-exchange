import type { SxProps, Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { LegacyRef } from 'react';
import { MenuDesktop, MenuMobile } from '.';

interface MenuProps {
  isOpenSubMenu?: boolean;
  label?: string;
  setOpen: (open: boolean, anchorRef: LegacyRef<HTMLDivElement>) => void;
  cardsLayout?: boolean;
  styles?: SxProps<Theme>;
  keepMounted?: boolean;
  open: boolean;
  children: React.ReactNode;
  width?: string;
  anchorEl?: HTMLDivElement;
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
