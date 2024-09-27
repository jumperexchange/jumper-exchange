import { useMenuStore } from '@/stores/menu';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTheme } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { NoSelectTypography } from '../ProfilePage.style';
import {
  AddressBoxContainer,
  AddressDisplayBox,
  PassImageBox,
  ProfileIconButton,
} from './AddressBox.style';
import useImageStatus from 'src/hooks/useImageStatus';
import { DEFAULT_EFFIGY } from 'src/const/urls';

interface AddressBoxProps {
  address?: string;
  isEVM?: boolean;
  imageLink?: string;
}

export const AddressBox = ({ address, isEVM, imageLink }: AddressBoxProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { setSnackbarState } = useMenuStore((state) => state);
  const { data: ensName, isSuccess } = useEnsName({
    address: address as Address | undefined,
    chainId: mainnet.id,
  });
  const imgLink = `https://effigy.im/a/${address}.png`;
  const isImageValid = useImageStatus(imgLink);

  const handleCopyButton = () => {
    address && navigator.clipboard.writeText(address);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
  };

  const getAddressOrENSString = (): string => {
    if (isSuccess && ensName) {
      return String(ensName).length > 20
        ? `${ensName.slice(0, 13)}...eth`
        : ensName;
    }
    return address && isEVM
      ? address?.slice(0, 6) +
          '...' +
          address?.slice(address.length - 4, address.length)
      : '0x0000...0000';
  };

  return (
    <AddressBoxContainer imgUrl={isImageValid ? imgLink : DEFAULT_EFFIGY}>
      <PassImageBox>
        <Image
          alt="Effigy Wallet Icon"
          src={isImageValid ? imgLink : DEFAULT_EFFIGY}
          width={128}
          height={128}
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
      <AddressDisplayBox>
        <NoSelectTypography
          fontWeight={700}
          fontSize={20}
          lineHeight={'32px'}
          width={'100%'}
          textAlign={'center'}
        >
          {getAddressOrENSString()}
        </NoSelectTypography>
        <ProfileIconButton onClick={() => handleCopyButton()}>
          <ContentCopyIcon sx={{ height: '16px' }} />
        </ProfileIconButton>
        <a
          href={`https://etherscan.io/address/${address}`}
          target="_blank"
          style={{ textDecoration: 'none', color: 'inherit' }}
          rel="noreferrer"
        >
          <ProfileIconButton>
            <OpenInNewIcon sx={{ height: '16px' }} />
          </ProfileIconButton>
        </a>
      </AddressDisplayBox>
    </AddressBoxContainer>
  );
};
