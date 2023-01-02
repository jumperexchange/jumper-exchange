import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Dispatch, KeyboardEvent, SetStateAction } from 'react';
import { NavbarMenuDesktop, NavbarMenuMobile } from './index';

interface NavbarMenuProps {
  openSubMenu?: string;
  anchorRef: any; // TODO: Replace this any with the correct type
  label?: string;
  bgColor?: string;
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
  scrollableMainLayer,
  setOpen,
  label,
  bgColor,
  anchorRef,
  openSubMenu,
  children,
}: NavbarMenuProps) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  function handleListKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    !!open &&
    (!!isMobile ? (
      <NavbarMenuMobile
        handleClose={handleClose}
        anchorRef={anchorRef}
        bgColor={bgColor}
        label={label}
        open={open}
        scrollableMainLayer={scrollableMainLayer}
        setOpen={setOpen}
        openSubMenu={openSubMenu}
        isScrollable={isScrollable}
      >
        {children}
      </NavbarMenuMobile>
    ) : (
      <NavbarMenuDesktop
        handleClose={handleClose}
        anchorRef={anchorRef}
        bgColor={bgColor}
        label={label}
        open={open}
        scrollableMainLayer={scrollableMainLayer}
        setOpen={setOpen}
        openSubMenu={openSubMenu}
        isScrollable={isScrollable}
      >
        {children}
      </NavbarMenuDesktop>
    ))
  );
};

export default NavbarMenu;
