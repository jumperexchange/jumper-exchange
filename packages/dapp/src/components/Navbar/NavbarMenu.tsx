import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Dispatch, SetStateAction } from 'react';
import { NavbarMenuDesktop, NavbarMenuMobile } from './index';

interface NavbarMenuProps {
  isOpenSubMenu?: boolean;
  anchorRef: any; // TODO: Replace this any with the correct type
  label?: string;
  bgColor?: string;
  hideBackArrow?: boolean;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  scrollableMainLayer?: boolean;
  isScrollable?: boolean;
  children: any;
}

const NavbarMenu = ({
  handleClose,
  open,
  isScrollable,
  hideBackArrow,
  scrollableMainLayer,
  setOpen,
  label,
  bgColor,
  anchorRef,
  isOpenSubMenu,
  children,
}: NavbarMenuProps) => {
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  return (
    !!open &&
    (!!isDesktop ? (
      <NavbarMenuDesktop
        handleClose={handleClose}
        anchorRef={anchorRef}
        bgColor={bgColor}
        hideBackArrow={hideBackArrow}
        label={label}
        open={open}
        scrollableMainLayer={scrollableMainLayer}
        setOpen={setOpen}
        isOpenSubMenu={isOpenSubMenu}
        isScrollable={isScrollable}
      >
        {children}
      </NavbarMenuDesktop>
    ) : (
      <NavbarMenuMobile
        handleClose={handleClose}
        anchorRef={anchorRef}
        bgColor={bgColor}
        hideBackArrow={hideBackArrow}
        label={label}
        open={open}
        scrollableMainLayer={scrollableMainLayer}
        setOpen={setOpen}
        isOpenSubMenu={isOpenSubMenu}
        isScrollable={isScrollable}
      >
        {children}
      </NavbarMenuMobile>
    ))
  );
};

export default NavbarMenu;
