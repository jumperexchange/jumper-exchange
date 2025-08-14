import { Box, styled } from '@mui/material';

export const ProfileButtonBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: theme.spacing(1.5),
  cursor: 'pointer',
}));
