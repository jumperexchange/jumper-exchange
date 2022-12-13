import { ChainsResponse, ExtendedChain } from '@lifi/types';
import { Dispatch, KeyboardEvent, SetStateAction } from 'react';
import NavbarWalletMenuDesktop from './NavbarWalletMenuDesktop';
import NavbarWalletMenuMobile from './NavbarWalletMenuMobile';

interface NavbarMenuProps {
  openSubMenu: string;
  anchorRef: any; // TODO: Replace this any with the correct type
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  activeChain: ExtendedChain;
  chainInfos: ChainsResponse;
  isSuccess: boolean;
  isTablet: boolean;
  walletManagement: any;
}
const NavbarWalletMenu = ({
  handleClose,
  open,
  setOpen,
  activeChain,
  anchorRef,
  openSubMenu,
  setOpenSubMenu,
  isSuccess,
  walletManagement,
  chainInfos,
  isTablet,
}: NavbarMenuProps) => {
  function handleListKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    !!open && (
      <>
        {!!isTablet ? (
          <NavbarWalletMenuDesktop
            handleClose={handleClose}
            anchorRef={anchorRef}
            open={open}
            handleListKeyDown={handleListKeyDown}
            walletManagement={walletManagement}
            activeChain={activeChain}
            isSuccess={isSuccess}
            setOpen={setOpen}
            chainInfos={chainInfos}
            openSubMenu={openSubMenu}
            setOpenSubMenu={setOpenSubMenu}
          />
        ) : (
          <NavbarWalletMenuMobile
            handleClose={handleClose}
            anchorRef={anchorRef}
            open={open}
            activeChain={activeChain}
            handleListKeyDown={handleListKeyDown}
            walletManagement={walletManagement}
            isSuccess={isSuccess}
            setOpen={setOpen}
            chainInfos={chainInfos}
            openSubMenu={openSubMenu}
            setOpenSubMenu={setOpenSubMenu}
          />
        )}
      </>
    )
  );
};

export default NavbarWalletMenu;
