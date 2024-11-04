import { Typography, styled } from '@mui/material';

export const IconHeaderTitle = styled(Typography)(({ theme }) => ({
  userSelect: 'none',
  color: theme.palette.text.primary,
  lineHeight: '18px',
}));
