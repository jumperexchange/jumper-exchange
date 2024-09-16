import type { BoxProps, CardProps } from '@mui/material';
import { Avatar, Badge, Box, Card, Typography } from '@mui/material';

import { darken, styled } from '@mui/material/styles';
import { IconButtonSecondary } from '../IconButton.style';
import { avatarMask12 } from '../Mask.style';

export const FlexibleFeeContainer = styled(Card)<CardProps>(({ theme }) => ({
  boxShadow: theme.palette.shadow.main,
  backgroundColor: theme.palette.surface2.main,
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0, 2),
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
  color: theme.palette.secondary.main, //'#747474',
  width: '100%',
  flexDirection: 'column',
  marginLeft: theme.spacing(2),
}));

export const FlexibleFeeAmountDetails = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
  marginTop: theme.spacing(0.75),
  lineHeight: 1,
}));

export const FlexibleFeeAmountsBadge = styled(IconButtonSecondary)<BoxProps>(
  ({ theme }) => ({
    width: 48,
    height: 24,
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.secondary.main
        : theme.palette.accent1Alt.main,
    padding: theme.spacing(0.5, 1),
    borderRadius: 16,
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'light'
          ? darken(theme.palette.secondary.main, 0.08)
          : darken(theme.palette.accent1Alt.main, 0.16),
    },
  }),
);

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
