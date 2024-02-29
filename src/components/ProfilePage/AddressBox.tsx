import { Box, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useMenuStore } from 'src/stores';
import { useTranslation } from 'react-i18next';

export const AddressBox = ({ address }: any) => {
  const { t } = useTranslation();
  const { setSnackbarState } = useMenuStore((state) => state);

  const handleCopyButton = () => {
    address && navigator.clipboard.writeText(address);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Box
        sx={{
          height: '50%',
          backgroundColor: '#de85ff',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50%',
          marginTop: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontSize: '24px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '32px' /* 125% */,
          }}
        >
          {address
            ? address?.slice(0, 6) +
              '...' +
              address?.slice(address.length - 4, address.length)
            : null}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#efebf5',
            borderRadius: '100%',
            width: '32px',
            height: '32px',
            padding: 1,
            marginLeft: 1,
            '&:hover': {
              cursor: 'pointer',
            },
          }}
          onClick={() => handleCopyButton()}
        >
          <ContentCopyIcon sx={{ height: '16px' }} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#efebf5',
            borderRadius: '100%',
            width: '32px',
            height: '32px',
            padding: 1,
            marginLeft: 1,
            '&:hover': {
              cursor: 'pointer',
            },
          }}
        >
          <OpenInNewIcon sx={{ height: '16px' }} />
        </Box>
      </Box>
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
              : `https://effigy.im/a/${'vitalik.eth'}.png`
          }
          width={'128px'}
          height={'128px'}
          style={{
            borderRadius: '100%',
            border: 10,
            borderColor: '#FFFFFF',
          }}
        />
      </Box>
    </Box>
  );
};
