import { ChainsResponse, ExtendedChain } from '@lifi/types';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
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

const NavbarWalletMenuDesktop = ({
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
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          sx={{
            zIndex: 2,
            bottom: '0 !important',
            left: '0 !important',
            top: 'unset !important',
            right: '0 !important',
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
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: 'right top',
              }}
            >
              <Paper
                sx={{
                  borderRadius: '12px',
                  background: isDarkMode ? '#121212' : '#fff',
                  p: `12px 0 ${openSubMenu === 'none' ? '24px' : '0'} 0`,
                  mt: theme.spacing(3),

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
            </Grow>
          )}
        </Popper>
      </>
    )
  );
};

export default NavbarWalletMenuDesktop;
