import { Box, darken, lighten, styled } from '@mui/material';

export const BannerContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  alignItems: 'center',
  width: '100%',
  padding: '10px',
  background: '#CEADFF',
  fontWeight: 700,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: darken('#CEADFF', 0.04),
    ...theme.applyStyles('dark', {
      backgroundColor: lighten('#30007A', 0.04),
    }),
  },
  ...theme.applyStyles('dark', {
    background: '#30007A',
  }),
}));
