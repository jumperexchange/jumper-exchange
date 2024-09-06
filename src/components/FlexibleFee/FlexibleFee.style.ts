import type { BoxProps, CardProps } from '@mui/material';
import { Avatar, Badge, Box, Card, Typography } from '@mui/material';

import { styled } from '@mui/material/styles';
import { avatarMask12 } from '../Mask.style';

export const FlexibleFeeContainer = styled(Card)<CardProps>(({ theme }) => ({
  boxShadow: theme.palette.shadow.main,
  backgroundColor: theme.palette.surface1.main,
  padding: theme.spacing(2),
}));

export const FlexibleFeeHeader = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

export const FlexibleFeeContent = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(2),
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const FlexibleFeeAmountsBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: theme.spacing(2),
}));

export const FlexibleFeeAmountDetails = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
}));

export const FlexibleFeeAmountsBadge = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  padding: theme.spacing(0.5, 1),
  borderRadius: 16,
}));

export const FlexibleFeeChainBadge = styled(Badge)(({ theme }) => ({
  borderRadius: '50%',
  '> .MuiAvatar-root': {
    mask: avatarMask12,
  },
}));

export const FlexibleFeeChainAvatar = styled(Avatar)(({ theme }) => ({
  margin: 'auto',
  height: 40,
  width: 40,
  '> img': {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
  mask: avatarMask12,
}));
