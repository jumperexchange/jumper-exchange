import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Dispatch, SetStateAction } from 'react';
import { NavbarMenuDesktop, NavbarMenuMobile } from './index';

interface NavbarMenuProps {
  isOpenSubMenu?: boolean;
  label?: string;
  hideBackArrow?: boolean;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  children: any;
}

const NavbarMenu = ({
  handleClose,
  open,
  hideBackArrow,
  setOpen,
  label,
  isOpenSubMenu,
  children,
}: NavbarMenuProps) => {
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up('sm' as Breakpoint));

  return (
    !!open &&
    (!!isDesktop ? (
      <NavbarMenuDesktop
        handleClose={handleClose}
        hideBackArrow={hideBackArrow}
        label={label}
        open={open}
        setOpen={setOpen}
        isOpenSubMenu={isOpenSubMenu}
      >
        {children}
      </NavbarMenuDesktop>
    ) : (
      <NavbarMenuMobile
        handleClose={handleClose}
        hideBackArrow={hideBackArrow}
        label={label}
        open={open}
        setOpen={setOpen}
        isOpenSubMenu={isOpenSubMenu}
      >
        {children}
      </NavbarMenuMobile>
    ))
  );
};

export default NavbarMenu;
