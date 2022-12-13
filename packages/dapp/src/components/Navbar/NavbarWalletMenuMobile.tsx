import { ChainsResponse, ExtendedChain } from '@lifi/types';
import { Slide } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { useTheme } from '@mui/material/styles';
import { WalletContextProps } from '@transferto/shared/src/types/wallet';
import { Dispatch, SetStateAction } from 'react';
import { useIsDarkMode } from '../../providers/ThemeProvider';

import {
  NavbarWalletMenuItemActiveWallet,
  NavbarWalletMenuItemChains,
  NavbarWalletMenuItemDisconnect,
  NavbarWalletSubMenuChains,
} from './index';
import { NavbarExternalBackground } from './Navbar.styled';
interface NavbarMenuProps {
  openSubMenu: string;
  anchorRef: any; // TODO: Replace this any with the correct type
  chainInfos: ChainsResponse;
  activeChain: ExtendedChain;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isSuccess: boolean;
  open: boolean;
  walletManagement: WalletContextProps;
  handleListKeyDown: any;
}

const NavbarWalletMenuMobile = ({
  handleClose,
  open,
  activeChain,
  setOpen,
  anchorRef,
  chainInfos,
  isSuccess,
  openSubMenu,
  setOpenSubMenu,
  walletManagement,
  handleListKeyDown,
}: NavbarMenuProps) => {
  const theme = useTheme();
  const { disconnect } = walletManagement;
  const isDarkMode = useIsDarkMode();

  return (
    !!open && (
      <>
        <NavbarExternalBackground />
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            sx={{
              // TODO: Can we get rid of those !important´s?
              zIndex: 2,
              bottom: '0 !important',
              left: '0 !important',
              top: 'unset !important',
              right: '0 !important',
              // transform: 'unset !important',
              margin: '0px',
              [theme.breakpoints.up('sm')]: {
                bottom: 'unset !important',
                left: 'unset !important',
                top: 'unset !important',
                right: '1.5rem !important',
                transform: 'unset !important',
              },
            }}
            transition
            disablePortal
          >
            <Paper
              sx={{
                background: isDarkMode ? '#121212' : '#fff',
                borderRadius: '12px 12px 0 0',
                p: openSubMenu === 'none' ? '12px 0 24px' : '12px 0 0',
                '& ul': {
                  padding: 0,
                },
                width: '100%',
                transformOrigin: 'bottom',
                transition:
                  'opacity 307ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 204ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

                [theme.breakpoints.up('sm')]: {
                  width: '288px',
                },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  sx={{ pt: openSubMenu === 'none' ? 0 : '48px !important' }}
                >
                  <NavbarWalletMenuItemChains
                    open={open}
                    activeChain={activeChain}
                    openSubMenu={openSubMenu}
                    setOpenSubMenu={setOpenSubMenu}
                    walletManagement={walletManagement}
                  />
                  <NavbarWalletMenuItemActiveWallet
                    open={open}
                    setOpen={setOpen}
                    openSubMenu={openSubMenu}
                    walletManagement={walletManagement}
                  />
                  <NavbarWalletMenuItemDisconnect
                    open={open}
                    openSubMenu={openSubMenu}
                    setOpen={setOpen}
                    disconnect={disconnect}
                  />
                  <NavbarWalletSubMenuChains
                    open={open}
                    activeChain={activeChain}
                    walletManagement={walletManagement}
                    chainInfos={chainInfos}
                    isSuccess={isSuccess}
                    openSubMenu={openSubMenu}
                    setOpenSubMenu={setOpenSubMenu}
                  />
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Popper>
        </Slide>
      </>
    )
  );
};

export default NavbarWalletMenuMobile;
