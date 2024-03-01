import { Box, Typography, alpha, useTheme } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useMenuStore } from 'src/stores';
import { useTranslation } from 'react-i18next';
import {
  AddressDisplayBox,
  BackgroundBox,
  IconButton,
} from './AddressBox.style';
import { ProfilePageTypography } from './ProfilePage.style';

interface AddressBoxProps {
  address?: string;
}

export const AddressBox = ({ address }: AddressBoxProps) => {
  const { t } = useTranslation();
  const { setSnackbarState } = useMenuStore((state) => state);

  const handleCopyButton = () => {
    address && navigator.clipboard.writeText(address);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
  };

  return (
    <Box sx={{ height: '100%' }}>
      <BackgroundBox />
      <AddressDisplayBox>
        {address ? (
          <>
            <ProfilePageTypography fontSize={'24px'} lineHeight={'32px'}>
              {address
                ? address?.slice(0, 6) +
                  '...' +
                  address?.slice(address.length - 4, address.length)
                : null}
            </ProfilePageTypography>
            <IconButton onClick={() => handleCopyButton()}>
              <ContentCopyIcon sx={{ height: '16px' }} />
            </IconButton>
            <a
              href={`https://etherscan.io/address/${address}`}
              target="_blank"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <IconButton>
                <OpenInNewIcon sx={{ height: '16px' }} />
              </IconButton>
            </a>
          </>
        ) : null}
      </AddressDisplayBox>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          bottom: '75%',
        }}
      >
        <img
          src={
            address
              ? `https://effigy.im/a/${address}.png`
              : `https://effigy.im/a/${'jumperexchange.eth'}.png`
          }
          width={'128px'}
          height={'128px'}
          style={{
            borderRadius: '100%',
            borderStyle: 'solid',
            borderWidth: '5px',
            borderColor: '#FFFFFF',
          }}
        />
      </Box>
    </Box>
  );
};
