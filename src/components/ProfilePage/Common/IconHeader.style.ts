import { Box, Typography, styled } from '@mui/material';

export const IconHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#5c4286',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingRight: '6px',
  paddingLeft: '6px',
  borderRadius: '32px',
  ...theme.applyStyles('light', {
    backgroundColor: '#f5f5f5',
  }),
}));

export const IconHeaderTitle = styled(Typography)(({ theme }) => ({
  marginLeft: '8px',
  userSelect: 'none',
  color: theme.palette.text.primary,
}));
