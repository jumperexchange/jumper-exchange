import { useMenuStore } from '@/stores/menu';
import { useWalletMenu } from '@lifi/wallet-management';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Typography } from '@mui/material';
import { FC, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletAddressImg } from 'src/hooks/useAddressImg';
import { useMercleNft } from 'src/hooks/useMercleNft';
import { getAddressLabel } from 'src/utils/getAddressLabel';
import type { Address } from 'viem';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
// import { AddressMenu } from '../AddressMenu/AddressMenu';
import {
  ImageForeground,
  AddressBox,
  AddressBoxContainer,
  AddressButton,
  AddressButtonLabel,
  AddressConnectButton,
  AddressContentContainer,
  ImageBackground,
  AddressMenuToggle,
  AddressButtonGroup,
} from './AddressCard.style';
import { AddressMenu } from './AddressMenu';
import { AddressCardSkeleton } from './AddressCardSkeleton';
import { ProfileContext } from 'src/providers/ProfileProvider';

interface AddressCardProps {}

export const AddressCard: FC<AddressCardProps> = () => {
  const { walletAddress: address, isLoading } = useContext(ProfileContext);
  const addressButtonRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const [openAddressMenu, setOpenAddressMenu] = useState(false);
  const { imageLink: nftImageLink } = useMercleNft({ userAddress: address });
  const { data: ensName, isSuccess } = useEnsName({
    address: address as Address | undefined,
    chainId: mainnet.id,
  });
  const walletAddressImageLink = useWalletAddressImg({
    userAddress: address,
  });
  const { setSnackbarState } = useMenuStore((state) => state);
  const { openWalletMenu } = useWalletMenu();

  const handleConnectWallet = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openWalletMenu();
  };

  const handleCopyButton = (textToCopy?: string) => {
    if (!textToCopy) {
      return;
    }
    navigator.clipboard.writeText(textToCopy);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
  };

  const toggleAddressMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (openAddressMenu) {
      setOpenAddressMenu(false);
    }
    setOpenAddressMenu(true);
  };

  const addressLabel = getAddressLabel({
    isSuccess,
    ensName,
    address,
  });

  if (isLoading) {
    return <AddressCardSkeleton />;
  }

  return (
    <AddressBoxContainer>
      <AddressContentContainer>
        <ImageBackground imgUrl={walletAddressImageLink} />
        <ImageForeground
          alt="Blockie Wallet Icon"
          src={nftImageLink || walletAddressImageLink}
          width={128}
          height={128}
          priority={false}
          unoptimized={true}
        />
        <>
          {address ? (
            <>
              <AddressButtonGroup ref={addressButtonRef}>
                <AddressButton
                  aria-label="Copy wallet address"
                  onClick={() => handleCopyButton(address)}
                >
                  <AddressButtonLabel variant="bodyMediumStrong">
                    {addressLabel}
                  </AddressButtonLabel>
                </AddressButton>
                <AddressMenuToggle
                  onClick={toggleAddressMenu}
                  role="button"
                  id="address-menu-button"
                  aria-controls={'address-menu'}
                  aria-haspopup="true"
                  aria-expanded={openAddressMenu ? 'true' : undefined}
                >
                  <KeyboardArrowDownIcon />
                </AddressMenuToggle>
              </AddressButtonGroup>
            </>
          ) : (
            <AddressConnectButton
              id="connect-wallet-button-address-card"
              onClick={handleConnectWallet}
            >
              <Typography variant={'bodySmallStrong'}>
                {t('leaderboard.connectWallet')}
              </Typography>
            </AddressConnectButton>
          )}
        </>
      </AddressContentContainer>
      <AddressMenu
        open={openAddressMenu}
        setOpen={setOpenAddressMenu}
        anchorEl={addressButtonRef.current}
      />
    </AddressBoxContainer>
  );
};
