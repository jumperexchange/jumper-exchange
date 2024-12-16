import { Box, styled } from '@mui/material';

export const BannerContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  alignItems: 'center',
  width: '100%',
  padding: '10px',
  background:
    theme.palette.mode === 'dark' ? '#30007A' : 'rgb(101 0 254 / 10%)',
  fontWeight: 700,
  cursor: 'pointer',
}));
