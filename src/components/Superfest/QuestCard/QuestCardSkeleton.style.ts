import { Box, alpha, styled } from '@mui/material';

export const QuestCardSkeletonContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#F8F3E0',
  height: '450px',
  width: '288px',
  textAlign: 'center',
  borderRadius: '8px',
  border: 16,
  borderColor:
    theme.palette.mode === 'light'
      ? '#ffffff'
      : alpha(theme.palette.white.main, 0.08),
}));
