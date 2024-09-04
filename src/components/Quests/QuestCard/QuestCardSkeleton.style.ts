import { Box, alpha, styled } from '@mui/material';

export const QuestCardSkeletonContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#FFFFFF'
      : alpha(theme.palette.white.main, 0.08),
  height: 450,
  width: 288,
  textAlign: 'center',
  borderRadius: '8px',
  border: 16,
  borderColor:
    theme.palette.mode === 'light'
      ? '#ffffff'
      : alpha(theme.palette.white.main, 0.08),
}));
