import { Box, Typography, styled } from '@mui/material';

export const IconHeaderContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const IconHeaderTitle = styled(Typography)(({ theme }) => ({
  userSelect: 'none',
  color: theme.palette.text.primary,
  lineHeight: '18px',
}));
