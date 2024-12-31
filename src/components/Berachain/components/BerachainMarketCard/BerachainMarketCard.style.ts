import type { TypographyProps } from '@mui/material';
import { Box, Card, Skeleton, Typography } from '@mui/material';
import { alpha, lighten, styled } from '@mui/material/styles';
import Image from 'next/image';
import type { BerachainProtocolType } from '../../berachain.types';

export const BerachainMarketCardWrapper = styled(Card)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  padding: theme.spacing(2),
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  width: 384,
  borderRadius: '16px',
  border: '1px solid #383433',
  background: '#1E1D1C',
  transition:
    'background ease-in-out 300ms, border ease-in-out 300ms, box-shadow ease-in-out 300ms',
  '&:hover': {
    background: lighten('#1E1D1C', 0.02),
    boxShadow: `0px 0px 28px 2px ${alpha('#F47226', 0.14)}`,
    border: `1px solid ${lighten('#383433', 0.2)}`,
  },
}));

export const BerachainMarketCardTokenContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  '&:not(:first-of-type)': {
    marginLeft: theme.spacing(-1),
  },
}));

export const BerachainMarketCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  height: 48,
  width: '100%',
}));

export const BerchainMarketCardInfos = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: theme.spacing(1.5),
}));

export const BerchainMarketCardAvatar = styled(Image)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '16px',
  border: `6px solid ${alpha(theme.palette.white.main, 0.08)}`,
  backgroundColor: alpha(theme.palette.black.main, 0.08),
}));

export const BerchainMarketCardAvatarSkeleton = styled(Skeleton)(
  ({ theme }) => ({
    width: 32,
    height: 32,
    borderRadius: '16px',
    border: `6px solid ${alpha(theme.palette.white.main, 0.08)}`,
  }),
);

export const BerchainMarketCardTokenBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  height: 32,
  borderRadius: '16px',
  backgroundColor: alpha(theme.palette.white.main, 0.08),
  padding: theme.spacing(0.75),
}));

interface BerachainMarketCardBadgeProps extends TypographyProps {
  type?: BerachainProtocolType | string;
}

export const BerachainMarketCardBadge = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<BerachainMarketCardBadgeProps>(({ theme, type }) => ({
  borderRadius: '12px',
  border: `1px solid ${alpha(theme.palette.white.main, 0.48)}`,
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  padding: theme.spacing(0.5, 1),
}));
