import { Box, darken, lighten, styled } from '@mui/material';

export const BannerContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  alignItems: 'center',
  width: '100%',
  padding: '10px',
  background: theme.palette.mode === 'light' ? '#CEADFF' : '#30007A',
  fontWeight: 700,
  cursor: 'pointer',
  ':hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? darken('#CEADFF', 0.04)
        : lighten('#30007A', 0.04),
  },
}));
