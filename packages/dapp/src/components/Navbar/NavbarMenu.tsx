import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { NavbarMenuDesktop, NavbarMenuMobile } from './index';

interface NavbarMenuProps {
  isOpenSubMenu?: boolean;
  label?: string;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: (open: boolean, anchorRef: any) => void;
  cardsLayout?: boolean;
  open: boolean;
  transformOrigin?: string;
  children: any;
}

const NavbarMenu = ({
  handleClose,
  open,
  setOpen,
  transformOrigin,
  cardsLayout,
  label,
  isOpenSubMenu,
  children,
}: NavbarMenuProps) => {
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up('sm' as Breakpoint));

  return (
    open &&
    (isDesktop ? (
      <NavbarMenuDesktop
        handleClose={handleClose}
        label={label}
        transformOrigin={transformOrigin}
        open={open}
        cardsLayout={cardsLayout}
        setOpen={setOpen}
        isOpenSubMenu={isOpenSubMenu || false}
      >
        {children}
      </NavbarMenuDesktop>
    ) : (
      <NavbarMenuMobile
        handleClose={handleClose}
        label={label}
        open={open}
        cardsLayout={cardsLayout}
        setOpen={setOpen}
        isOpenSubMenu={isOpenSubMenu || false}
      >
        {children}
      </NavbarMenuMobile>
    ))
  );
};

export default NavbarMenu;
