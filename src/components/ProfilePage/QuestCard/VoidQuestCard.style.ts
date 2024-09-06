import { Box, alpha, styled } from '@mui/material';

export const VoidQuestCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#FFFFFF'
      : alpha(theme.palette.white.main, 0.08),
  height: '416px',
  width: '272px',
  borderRadius: '24px',
  border: 16,
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : alpha(theme.palette.white.main, 0.08),
}));
