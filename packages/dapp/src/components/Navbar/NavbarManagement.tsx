import MenuIcon from '@mui/icons-material/Menu';
import { Typography } from '@mui/material';
import { WalletManagementButtons } from '@transferto/shared/src';
import { ChainSwitch } from '@transferto/shared/src/atoms/ChainSwitch';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { useChainInfos } from '../../providers/ChainInfosProvider';
import { useWallet } from '../../providers/WalletProvider';
import { useMenuStore, useSettingsStore } from '../../stores';
import { ThemeSwitch } from '../ThemeSwitch';
import {
  NavbarDropdownButton,
  NavbarManagement as NavbarManagementContainer,
} from './Navbar.style';

const NavbarManagement = () => {
  const anchorRef = useRef<any>(null);

  const [onWalletDisconnect] = useSettingsStore(
    (state) => [state.onWalletDisconnect],
    shallow,
  );

  const [
    openMainNavbarMenu,
    onOpenNavbarMainMenu,
    openNavbarWalletSelectMenu,
    onOpenNavbarWalletSelectMenu,
    openNavbarWalletMenu,
    onOpenNavbarWalletMenu,
  ] = useMenuStore(
    (state) => [
      state.openMainNavbarMenu,
      state.onOpenNavbarMainMenu,
      state.openNavbarWalletSelectMenu,
      state.onOpenNavbarWalletSelectMenu,
      state.openNavbarWalletMenu,
      state.onOpenNavbarWalletMenu,
    ],
    shallow,
  );

  const toggleMenuHandlers = {
    openNavbarWalletSelectMenu,
    onOpenNavbarWalletSelectMenu,
    openNavbarWalletMenu,
    onOpenNavbarWalletMenu,
  };

  const onMenuInit = useMenuStore((state) => state.onMenuInit);

  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const walletManagement = useWallet();
  const { account } = useWallet();

  !account.isActive ?? onWalletDisconnect();

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(openMainNavbarMenu);
  useEffect(() => {
    if (prevOpen.current === true && openMainNavbarMenu === false) {
      anchorRef!.current.focus();
    }

    prevOpen.current = openMainNavbarMenu;
  }, [openMainNavbarMenu]);

  useLayoutEffect(() => {
    onMenuInit(anchorRef.current);
    // We want to run this once to avoid infinite re-render
    // FIXME: We need to fix how we manage menu state to avoid re-rendering of the whole app when we open the menu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isSuccess } = useChainInfos();

  const handleOnOpenNavbarMainMenu = () => {
    onOpenNavbarMainMenu(!openMainNavbarMenu);
  };

  return (
    <NavbarManagementContainer className="settings">
      <WalletManagementButtons
        walletManagement={walletManagement}
        toggleMenuHandlers={toggleMenuHandlers}
        connectButtonLabel={
          <Typography
            variant={'lifiBodyMediumStrong'}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {translate(`${i18Path}connectWallet`)}
          </Typography>
        }
        isSuccess={isSuccess}
      />
      {account.isActive ? <ChainSwitch /> : null}
      <ThemeSwitch />
      <NavbarDropdownButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={openMainNavbarMenu ? 'composition-menu' : undefined}
        aria-expanded={openMainNavbarMenu ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleOnOpenNavbarMainMenu}
      >
        <MenuIcon
          sx={{
            fontSize: '32px',
            color: 'inherit',
          }}
        />
      </NavbarDropdownButton>
    </NavbarManagementContainer>
  );
};

export default NavbarManagement;
