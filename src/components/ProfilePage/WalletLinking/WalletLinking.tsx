import { useAccount } from '@lifi/wallet-management';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import { checkActiveSvmAndEvm } from 'src/utils/hasSvmAndEvmConnected';
import { ProfileIconButton } from '../AddressCard/AddressCard.style';
import { WalletLinkingMenu } from './WalletLinkingMenu/WalletLinkingMenu';

export const WalletLinking = ({
  anchorEl,
  setAnchorEl,
}: {
  anchorEl: HTMLElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
}) => {
  const [openWalletLinkMenu, setOpenWalletLinkMenu] = useState(false);
  const { accounts } = useAccount();
  const handleWalletLinkMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (openWalletLinkMenu) {
      setAnchorEl(null);
      setOpenWalletLinkMenu(false);
    }
    setAnchorEl(event.currentTarget);
    setOpenWalletLinkMenu(true);
  };

  const hasSvmAndEvmConnected = checkActiveSvmAndEvm(accounts);
  if (!hasSvmAndEvmConnected) {
    return;
  }

  return (
    <>
      <ProfileIconButton
        onClick={handleWalletLinkMenu}
        id="wallet-linking-menu-button"
        aria-controls={'wallet-linking'}
        aria-haspopup="true"
        aria-expanded={openWalletLinkMenu ? 'true' : undefined}
      >
        <XPIcon />
      </ProfileIconButton>
      {openWalletLinkMenu ? (
        <WalletLinkingMenu
          open={openWalletLinkMenu}
          setOpen={setOpenWalletLinkMenu}
          anchorEl={anchorEl}
        />
      ) : null}
    </>
  );
};
