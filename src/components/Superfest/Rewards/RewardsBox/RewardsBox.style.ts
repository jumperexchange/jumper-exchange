import type { BoxProps } from '@mui/material';
import { Box, alpha, styled } from '@mui/material';

export const RewardsdMainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: '#f8f3e0',
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
