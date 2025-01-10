import { Box, alpha, styled } from '@mui/material';

export const QuestCardSkeletonContainer = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.white.main, 0.08),
  height: 450,
  width: 288,
  textAlign: 'center',
  borderRadius: '16px',
  border: 16,
  borderColor: alpha(theme.palette.white.main, 0.08),
  ...theme.applyStyles('light', {
    backgroundColor: '#f5f5f5',
    borderColor: '#ffffff',
  }),
}));
