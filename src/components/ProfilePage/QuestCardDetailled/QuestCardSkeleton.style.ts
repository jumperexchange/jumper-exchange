import { Box, alpha, styled } from '@mui/material';

export const QuestCardSkeletonContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#f5f5f5'
      : alpha(theme.palette.white.main, 0.08), //todo: add to theme
  height: 450,
  width: 288,
  textAlign: 'center',
  borderRadius: '16px',
  border: 16,
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : alpha(theme.palette.white.main, 0.08),
}));
