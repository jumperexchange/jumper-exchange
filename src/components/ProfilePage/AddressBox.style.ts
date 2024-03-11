import { Box, Container, Typography, alpha, styled } from '@mui/material';

export const ProfileIconButton = styled(Box)(({ theme, style }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#efebf5'
      : alpha(theme.palette.white.main, 0.08),
  borderRadius: '100%',
  width: '32px',
  height: '32px',
  padding: 1,
  marginLeft: 8,
  '&:hover': {
    cursor: 'pointer',
  },
  ...style,
}));

export const BackgroundBox = styled(Box)(() => ({
  height: '50%',
  backgroundColor: '#31007A',
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
}));

export const AddressDisplayBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50%',
  marginTop: 4,
}));
