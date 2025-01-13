import { alpha, Box, styled } from '@mui/material';

export const ColoredStatBox = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  alignItems: 'flex-start',
  borderRadius: 1,
  paddingX: 2,
  paddingY: 1,
  flex: 1,
}));
