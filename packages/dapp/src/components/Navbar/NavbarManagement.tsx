import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { WalletManagementButtons } from '@transferto/shared';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useWallet } from '../../providers/WalletProvider';
import { NavbarMenu } from './index';

import {
  NavbarDropdownButton,
  NavbarManagement as NavbarManagementContainer,
} from './Navbar.styled';

const NavbarManagement = () => {
  const anchorRef = useRef<HTMLButtonElement>(null);

  // Dropdown-Menu - Source: https://mui.com/material-ui/react-menu/
  const [open, setOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState('none');

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    setOpenSubMenu('none');
  };

  const handleClose = (event: Event | SyntheticEvent) => {
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
        backgroundColor={'#31007A'}
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
      >
        <MoreHorizIcon />
      </NavbarDropdownButton>
      <NavbarMenu
        handleClose={handleClose}
        anchorRef={anchorRef}
        open={open}
        setOpen={setOpen}
        openSubMenu={openSubMenu}
        setOpenSubMenu={setOpenSubMenu}
      />
    </NavbarManagementContainer>
  );
};

export default NavbarManagement;
