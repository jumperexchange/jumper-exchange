import { Chain } from '@lifi/types';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { WalletManagementButtons } from '@transferto/shared';
import { useSettings } from '@transferto/shared/src/hooks';
import { SyntheticEvent, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useChainInfos } from '../../providers/ChainInfosProvider';
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
  const { t: translate } = useTranslation();
  const i18Path = 'Navbar.';

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
    settings.onCopyToClipboard(false);
  };

  !account.isActive ?? settings.onWalletDisconnect();

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(settings.openMainNavbarMenu);
  useEffect(() => {
    if (prevOpen.current === true && settings.openMainNavbarMenu === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = settings.openMainNavbarMenu;
  }, [settings.openMainNavbarMenu]);

  const { chains, isSuccess } = useChainInfos();

  const activeChain = useMemo(
    () => chains.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains.length, account.chainId],
  );

  return (
    <NavbarManagementContainer className="settings">
      <WalletManagementButtons
        walletManagement={walletManagement}
        color={
          !!account.isActive && !isDarkMode ? theme.palette.black.main : 'white'
        }
        backgroundColor={
          !account.isActive
            ? theme.palette.accent1.main
            : !!isDarkMode
            ? 'rgba(255, 255, 255, 0.12);'
            : 'white'
        }
        hoverBackgroundColor={'#31007a8c'}
        setOpenNavbarSubmenu={settings.onOpenNavbarSubMenu}
        activeChain={activeChain}
        connectButtonLabel={`${translate(`${i18Path}ConnectWallet`)}`}
        isSuccess={isSuccess}
      />
      <NavbarDropdownButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={
          settings.openMainNavbarMenu ? 'composition-menu' : undefined
        }
        aria-expanded={settings.openMainNavbarMenu ? 'true' : undefined}
        aria-haspopup="true"
        onClick={() => {
          settings.onOpenNavbarSubMenu('none');
          settings.onOpenNavbarWalletMenu(false);
          settings.onOpenNavbarMainMenu(!settings.openMainNavbarMenu);
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
