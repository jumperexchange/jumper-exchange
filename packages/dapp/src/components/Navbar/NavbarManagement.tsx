import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { WalletManagementButtons } from '@transferto/shared';
import { screenSize } from '@transferto/shared/src/style';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useIsDarkMode } from '../../providers/ThemeProvider';
import { useWallet } from '../../providers/WalletProvider';
import { NavbarMenuDesktop, NavbarMenuMobile } from './index';

import {
  NavbarDropdownButton,
  NavbarManagement as NavbarManagementContainer,
} from './Navbar.styled';

const NavbarManagement = () => {
  const anchorRef = useRef<HTMLButtonElement>(null);

  // Dropdown-Menu - Source: https://mui.com/material-ui/react-menu/
  const [open, setOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState('none');
  const theme = useTheme();
  const isTablet = useMediaQuery(`(${screenSize.minTablet})`);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    setOpenSubMenu('none');
  };
  console.log('THEME:', theme.palette.accent1);

  const handleClose = (event: Event | SyntheticEvent) => {
    event.preventDefault();
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenSubMenu('none');
    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <NavbarManagementContainer className="settings">
      <WalletManagementButtons
        backgroundColor={theme.palette.accent1.main}
        hoverBackgroundColor={'#31007a8c'}
        walletManagement={useWallet()}
      />
      <NavbarDropdownButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        mainCol={!!useIsDarkMode() ? '#653BA3' : '#31007A'}
      >
        <MenuIcon sx={{ fontSize: '32px' }} />
      </NavbarDropdownButton>
      {!!isTablet ? (
        <NavbarMenuDesktop
          handleClose={handleClose}
          anchorRef={anchorRef}
          open={open}
          setOpen={setOpen}
          openSubMenu={openSubMenu}
          setOpenSubMenu={setOpenSubMenu}
        />
      ) : (
        <NavbarMenuMobile
          handleClose={handleClose}
          anchorRef={anchorRef}
          open={open}
          setOpen={setOpen}
          openSubMenu={openSubMenu}
          setOpenSubMenu={setOpenSubMenu}
        />
      )}
    </NavbarManagementContainer>
  );
};

export default NavbarManagement;
