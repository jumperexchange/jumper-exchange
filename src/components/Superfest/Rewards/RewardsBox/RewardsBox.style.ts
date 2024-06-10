import type { BoxProps } from '@mui/material';
import { Box, alpha, styled } from '@mui/material';

export const RewardsdMainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#FFFFFF'
      : alpha(theme.palette.white.main, 0.08),
  height: '316px',
  width: '832px',
  borderRadius: '24px',
  textAlign: 'center',
  overflow: 'hidden',
  padding: theme.spacing(2),
}));

export const RewardsRightBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
}));
