import { Box, alpha, styled } from '@mui/material';

export const QuestCardSkeletonContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#F8F3E0',
  height: 450,
  width: 288,
  textAlign: 'center',
  borderRadius: '8px',
  border: 16,
  borderColor:
    alpha(theme.palette.white.main, 0.08),
  ...theme.applyStyles("light", {
    borderColor: theme.palette.white.main
  })
}));
