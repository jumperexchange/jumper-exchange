import { alpha, Box, styled } from '@mui/material';

export const ColoredStatBox = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  alignItems: 'flex-start',
  borderRadius: '16px',
  paddingRight: '16px',
  paddingLeft: '16px',
  paddingTop: '8px',
  paddingBottom: '8px',
  flex: 1,
}));
