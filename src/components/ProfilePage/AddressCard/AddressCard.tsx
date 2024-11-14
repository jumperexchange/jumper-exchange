import { useMenuStore } from '@/stores/menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTheme } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useImageStatus from 'src/hooks/useImageStatus';
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
  PassImageBox,
  ProfileIconButton,
} from './AddressCard.style';

interface AddressBoxProps {
  address?: string;
}

export const AddressCard = ({ address }: AddressBoxProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const theme = useTheme();
  const [openAddressMenu, setOpenAddressMenu] = useState(false);
  const { imageLink } = useMercleNft({ userAddress: address });
  const { data: ensName, isSuccess } = useEnsName({
    address: address as Address | undefined,
    chainId: mainnet.id,
  });
  const imgLink = useImageStatus(address);
  const { setSnackbarState } = useMenuStore((state) => state);

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
    <AddressBoxContainer imgUrl={imgLink}>
      <PassImageBox>
        <Image
          alt="Effigy Wallet Icon"
          src={imgLink}
          width={140}
          height={140}
          priority={false}
          unoptimized={true}
          style={{
            backgroundColor: imageLink
              ? theme.palette.mode === 'light'
                ? '#F9F5FF'
                : theme.palette.accent1Alt.main
              : undefined,
            borderRadius: '100%',
            borderStyle: 'solid',
            borderWidth: '5px',
            borderColor: theme.palette.white.main,
            zIndex: 1,
          }}
        />
      </PassImageBox>
      <AddressBox>
        <AddressButton
          aria-label="Copy wallet address"
          onClick={() => handleCopyButton(address)}
        >
          <AddressButtonLabel variant="bodyMediumStrong">
            {addressLabel}
          </AddressButtonLabel>
        </AddressButton>
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
