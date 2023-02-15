import { Chain } from '@lifi/types';
import MenuIcon from '@mui/icons-material/Menu';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { WalletManagementButtons } from '@transferto/shared';
import { useSettings } from '@transferto/shared/src/hooks';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SubMenuKeys } from '../../const';
import { useChainInfos } from '../../providers/ChainInfosProvider';
import { useMenu } from '../../providers/MenuProvider';
import { useWallet } from '../../providers/WalletProvider';
import {
  NavbarDropdownButton,
  NavbarManagement as NavbarManagementContainer,
} from './Navbar.style';

const NavbarManagement = () => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const settings = useSettings();
  const theme = useTheme();
  const menu = useMenu();
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const walletManagement = useWallet();
  const { account } = useWallet();

  !account.isActive ?? settings.onWalletDisconnect();

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(menu.openMainNavbarMenu);
  useEffect(() => {
    if (prevOpen.current === true && menu.openMainNavbarMenu === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = menu.openMainNavbarMenu;
  }, [menu.openMainNavbarMenu]);

  useEffect(() => {
    menu.onMenuInit(anchorRef);
  }, []);

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
        setOpenNavbarSubmenu={menu.onOpenNavbarSubMenu}
        activeChain={activeChain}
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
      <NavbarDropdownButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={menu.openMainNavbarMenu ? 'composition-menu' : undefined}
        aria-expanded={menu.openMainNavbarMenu ? 'true' : undefined}
        aria-haspopup="true"
        onClick={() => {
          menu.onOpenNavbarSubMenu(SubMenuKeys.none);
          menu.onOpenNavbarWalletMenu(false);
          menu.onOpenNavbarMainMenu(!menu.openMainNavbarMenu);
        }}
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
