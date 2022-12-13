import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Dispatch, KeyboardEvent, SetStateAction } from 'react';
import { NavbarMenuDesktop, NavbarMenuMobile } from './index';

interface NavbarMenuProps {
  openSubMenu?: string;
  anchorRef: any; // TODO: Replace this any with the correct type
  label?: string;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  scrollableMainLayer?: boolean;
  stickyLabel?: boolean;
  children: any;
}

const NavbarMenu = ({
  handleClose,
  open,
  stickyLabel,
  scrollableMainLayer,
  setOpen,
  label,
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
        label={label}
        open={open}
        scrollableMainLayer={scrollableMainLayer}
        setOpen={setOpen}
        openSubMenu={openSubMenu}
        stickyLabel={stickyLabel}
      >
        {children}
      </NavbarMenuMobile>
    ) : (
      <NavbarMenuDesktop
        handleClose={handleClose}
        anchorRef={anchorRef}
        label={label}
        open={open}
        scrollableMainLayer={scrollableMainLayer}
        setOpen={setOpen}
        openSubMenu={openSubMenu}
        stickyLabel={stickyLabel}
      >
        {children}
      </NavbarMenuDesktop>
    ))
  );
};

export default NavbarMenu;
