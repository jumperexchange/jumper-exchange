import { Chain } from '@lifi/types';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { WalletManagementButtons } from '@transferto/shared';
import { useSettings } from '@transferto/shared/src/hooks';
import { SyntheticEvent, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useChainInfos } from '../../providers/ChainInfosProvider';
import { useMenu } from '../../providers/MenuProvider';
import { useWallet } from '../../providers/WalletProvider';
import { ConnectedMenu, MainMenu, WalletMenu } from './index';
import {
  NavbarDropdownButton,
  NavbarManagement as NavbarManagementContainer,
} from './Navbar.styled';

const NavbarManagement = () => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const settings = useSettings();
  const theme = useTheme();
  const menu = useMenu();
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';

  const isDarkMode = theme.palette.mode === 'dark';
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
    menu.onCopyToClipboard(false);
  };

  !account.isActive ?? settings.onWalletDisconnect();

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(menu.openMainNavbarMenu);
  useEffect(() => {
    if (prevOpen.current === true && menu.openMainNavbarMenu === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = menu.openMainNavbarMenu;
  }, [menu.openMainNavbarMenu]);

  const { chains, isSuccess } = useChainInfos();

  const activeChain = useMemo(
    () => chains.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains.length, account.chainId],
  );

  return (
    <NavbarManagementContainer className="settings">
      <WalletManagementButtons
        walletManagement={walletManagement}
        menu={menu}
        color={
          !!account.isActive && !isDarkMode
            ? theme.palette.black.main
            : theme.palette.white.main
        }
        backgroundColor={
          !account.isActive
            ? theme.palette.accent1.main
            : !!isDarkMode
            ? theme.palette.alphaLight300.main
            : theme.palette.white.main
        }
        hoverBackgroundColor={'#31007a8c'}
        setOpenNavbarSubmenu={menu.onOpenNavbarSubMenu}
        activeChain={activeChain}
        connectButtonLabel={`${translate(`${i18Path}connectWallet`)}`}
        isSuccess={isSuccess}
      />
      <NavbarDropdownButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={menu.openMainNavbarMenu ? 'composition-menu' : undefined}
        aria-expanded={menu.openMainNavbarMenu ? 'true' : undefined}
        aria-haspopup="true"
        onClick={() => {
          menu.onOpenNavbarSubMenu('none');
          menu.onOpenNavbarWalletMenu(false);
          menu.onOpenNavbarMainMenu(!menu.openMainNavbarMenu);
        }}
        mainCol={!!isDarkMode ? '#653BA3' : theme.palette.primary.main}
      >
        <MenuIcon
          sx={{
            fontSize: '32px',
            color: !!isDarkMode ? theme.palette.white.main : 'inherit',
          }}
        />
      </NavbarDropdownButton>

      <MainMenu handleClose={handleClose} anchorRef={anchorRef} />

      {/* <WalletMenuWrapper
        anchorRef={anchorRef}
        supportedWallets={supportedWallets}
        handleClose={handleClose}
      /> */}

      <WalletMenu handleClose={handleClose} anchorRef={anchorRef} />

      <ConnectedMenu
        isSuccess={isSuccess}
        handleClose={handleClose}
        anchorRef={anchorRef}
      />
    </NavbarManagementContainer>
  );
};

export default NavbarManagement;
