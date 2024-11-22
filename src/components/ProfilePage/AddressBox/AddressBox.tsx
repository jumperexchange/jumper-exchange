import { useMenuStore } from '@/stores/menu';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LinkIcon from '@mui/icons-material/Link';
import { useTheme } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useMercleNft } from 'src/hooks/useMercleNft';
import { getAddressLabel } from 'src/utils/getAddressLabel';
import type { Address } from 'viem';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { NoSelectTypography } from '@/components/ProfilePage/ProfilePage.style';
import {
  AddressBoxContainer,
  AddressDisplayBox,
  PassImageBox,
  ProfileIconButton,
} from './AddressBox.style';
import { getSiteUrl } from '@/const/urls';
import { blo } from 'blo';
import useBlockieImg from '@/hooks/useBlockieImg';

interface AddressBoxProps {
  address?: string;
}

export const AddressBox = ({ address }: AddressBoxProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { imageLink } = useMercleNft({ userAddress: address });
  const { setSnackbarState } = useMenuStore((state) => state);
  const { data: ensName, isSuccess } = useEnsName({
    address: address as Address | undefined,
    chainId: mainnet.id,
  });
  const imgLink = useBlockieImg(address);

  const handleCopyButton = (textToCopy: string) => {
    address && navigator.clipboard.writeText(textToCopy);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
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
          alt={`${address} wallet Icon`}
          src={imgLink}
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
          {addressLabel}
        </NoSelectTypography>
        {address && (
          <ProfileIconButton onClick={() => handleCopyButton(address)}>
            <ContentCopyIcon sx={{ height: '16px' }} />
          </ProfileIconButton>
        )}
        {address && (
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
        )}
        {address && (
          <ProfileIconButton
            onClick={() =>
              handleCopyButton(`${getSiteUrl()}/profile/${address}`)
            }
          >
            <LinkIcon sx={{ height: '16px' }} />
          </ProfileIconButton>
        )}
      </AddressDisplayBox>
    </AddressBoxContainer>
  );
};
