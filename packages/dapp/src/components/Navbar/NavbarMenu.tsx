import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { NavbarMenuDesktop, NavbarMenuMobile } from './index';

interface NavbarMenuProps {
  isOpenSubMenu?: boolean;
  label?: string;
  hideBackArrow?: boolean;
  setOpen: (open: boolean) => void;
  open: boolean;
  isScrollable?: boolean;
  children: any;
}

const NavbarMenu = ({
  open,
  isScrollable,
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
        hideBackArrow={hideBackArrow}
        label={label}
        open={open}
        setOpen={setOpen}
        isOpenSubMenu={isOpenSubMenu}
        isScrollable={isScrollable}
      >
        {children}
      </NavbarMenuDesktop>
    ) : (
      <NavbarMenuMobile
        hideBackArrow={hideBackArrow}
        label={label}
        open={open}
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
