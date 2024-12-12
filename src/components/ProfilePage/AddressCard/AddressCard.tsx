import { useMenuStore } from '@/stores/menu';
import { useWalletMenu } from '@lifi/wallet-management';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMercleNft } from 'src/hooks/useMercleNft';
import { getAddressLabel } from 'src/utils/getAddressLabel';
import type { Address } from 'viem';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { AddressMenu } from '../AddressMenu/AddressMenu';
import {
  AddressBox,
  AddressBoxContainer,
  AddressButton,
  AddressButtonLabel,
  AddressConnectButton,
  AddressBlockiesImage,
  AddressBlockiesImageSkeleton,
  ImageBackground,
  PassImageBox,
  ProfileIconButton,
} from './AddressCard.style';
import { useWalletAddressImg } from 'src/hooks/useAddressImg';

interface AddressBoxProps {
  address?: string;
}

export const AddressCard = ({ address }: AddressBoxProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  const [openAddressMenu, setOpenAddressMenu] = useState(false);
  const { imageLink } = useMercleNft({ userAddress: address });
  const { data: ensName, isSuccess } = useEnsName({
    address: address as Address | undefined,
    chainId: mainnet.id,
  });
  const imgLink = useWalletAddressImg(address);
  const { setSnackbarState } = useMenuStore((state) => state);
  const { openWalletMenu } = useWalletMenu();

  const handleCopyButton = (textToCopy?: string) => {
    if (!textToCopy) {
      return;
    }
    navigator.clipboard.writeText(textToCopy);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
  };

  const handleAddressMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (openAddressMenu) {
      setAnchorEl(null);
      setOpenAddressMenu(false);
    }
    setAnchorEl(event.currentTarget);
    setOpenAddressMenu(true);
  };

  const addressLabel = getAddressLabel({
    isSuccess,
    ensName,
    address,
  });

  return (
    <AddressBoxContainer>
      <PassImageBox>
        <ImageBackground imgUrl={imgLink} />
        {address ? (
          <AddressBlockiesImage
            alt="Blockie Wallet Icon"
            src={imageLink || imgLink}
            width={140}
            height={140}
            priority={false}
            unoptimized={true}
          />
        ) : (
          <AddressBlockiesImageSkeleton variant="circular" />
        )}
      </PassImageBox>
      <AddressBox>
        {address ? (
          <AddressButton
            aria-label="Copy wallet address"
            onClick={() => handleCopyButton(address)}
          >
            <AddressButtonLabel variant="bodyMediumStrong">
              {addressLabel}
            </AddressButtonLabel>
          </AddressButton>
        ) : (
          <AddressConnectButton
            id="connect-wallet-button-address-card"
            onClick={(event) => {
              event.stopPropagation();
              openWalletMenu();
            }}
          >
            <Typography variant={'bodySmallStrong'}>
              {t('leaderboard.connectWallet')}
            </Typography>
          </AddressConnectButton>
        )}
        {address && (
          <>
            <ProfileIconButton
              onClick={handleAddressMenu}
              id="address-menu-button"
              aria-controls={'address-menu'}
              aria-haspopup="true"
              aria-expanded={openAddressMenu ? 'true' : undefined}
            >
              <KeyboardArrowDownIcon />
            </ProfileIconButton>
            <AddressMenu
              open={openAddressMenu}
              setOpen={setOpenAddressMenu}
              anchorEl={anchorEl}
            />
          </>
        )}
      </AddressBox>
    </AddressBoxContainer>
  );
};
