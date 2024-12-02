import { Box, Typography, styled } from '@mui/material';

export const IconHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#5c4286',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingRight: '6px',
  paddingLeft: '6px',
  borderRadius: '32px',
}));

export const IconHeaderTitle = styled(Typography)(({ theme }) => ({
  marginLeft: '8px',
  userSelect: 'none',
  color: theme.palette.text.primary,
}));
