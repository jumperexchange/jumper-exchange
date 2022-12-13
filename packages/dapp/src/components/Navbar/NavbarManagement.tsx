import { Chain, ChainsResponse } from '@lifi/types';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { WalletManagementButtons } from '@transferto/shared';
import { useChainInfo, useSettings } from '@transferto/shared/src/hooks';

import { screenSize } from '@transferto/shared/src/style';
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useIsDarkMode } from '../../providers/ThemeProvider';
import { useWallet } from '../../providers/WalletProvider';
import { NavbarMenuDesktop, NavbarMenuMobile, NavbarWalletMenu } from './index';
import {
  NavbarDropdownButton,
  NavbarManagement as NavbarManagementContainer,
} from './Navbar.styled';

const NavbarManagement = () => {
  const anchorRef = useRef<HTMLButtonElement>(null);

  // Dropdown-Menu - Source: https://mui.com/material-ui/react-menu/
  const [open, setOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState('none');
  const [openWalletMenu, setOpenWalletMenu] = useState(false);
  const [openWalletSubMenu, setOpenWalletSubMenu] = useState('none');
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('sm'));
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    setOpenSubMenu('none');
    setOpenWalletMenu(false);
    setOpenWalletSubMenu('none');
  };
  const settings = useSettings();

  const walletManagement = useWallet();
  const { account } = useWallet();
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
    setOpenWalletSubMenu('none');
    setOpenWalletMenu(false);
  };

  !account.isActive ?? settings.onWalletDisconnect();

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const { data: chainStats, isSuccess } = useChainInfo();
  const chainInfos: ChainsResponse = useMemo(
    () => (!!chainStats ? chainStats : null),
    [chainStats],
  );

  const activeChain = useMemo(
    () =>
      chainInfos?.chains.find(
        (chainEl: Chain) => chainEl.id === account.chainId,
      ),
    [chainInfos, account.chainId],
  );

  return (
    <NavbarManagementContainer className="settings">
      <WalletManagementButtons
        walletManagement={walletManagement}
        backgroundColor={theme.palette.accent1.main}
        hoverBackgroundColor={'#31007a8c'}
        activeChain={activeChain}
        isSuccess={isSuccess}
        openWalletMenu={openWalletMenu}
        setOpenWalletMenu={setOpenWalletMenu}
        openWalletSubMenu={openWalletSubMenu}
        setOpenWalletSubMenu={setOpenWalletSubMenu}
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

      <NavbarWalletMenu
        isTablet={isTablet}
        activeChain={activeChain}
        chainInfos={chainInfos}
        isSuccess={isSuccess}
        handleClose={handleClose}
        anchorRef={anchorRef}
        open={openWalletMenu}
        walletManagement={useWallet()}
        setOpen={setOpenWalletMenu}
        openSubMenu={openWalletSubMenu}
        setOpenSubMenu={setOpenWalletSubMenu}
      />
    </NavbarManagementContainer>
  );
};

export default NavbarManagement;
