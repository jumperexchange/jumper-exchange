import { Box, alpha, styled } from '@mui/material';

export const QuestCardCompletedSkeletonContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#f5f5f5'
      : alpha(theme.palette.white.main, 0.08),
  height: '416px',
  width: '272px',
  borderRadius: '20px',
  border: 16,
  borderColor:
    theme.palette.mode === 'light'
      ? '#ffffff'
      : alpha(theme.palette.white.main, 0.08),
}));
