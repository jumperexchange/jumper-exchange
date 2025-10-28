import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

export const TotalValue = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  textOverflow: 'ellipsis',
  fontWeight: '700',
  fontSize: '48px',
  lineHeight: '64px',
  fontFamily: 'var(--font-inter)',
  userSelect: 'none',
}));

export const VariationValue = styled(Typography)(({ theme }) => ({
  textOverflow: 'ellipsis',
  fontWeight: '500',
  fontSize: '0.75rem',
  lineHeight: '16px',
  display: 'flex',
  alignItems: 'center',
}));

export const PortfolioByAccountWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface1.main,
  }),
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.cardBorderRadius,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  transform: 'none',
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface2.main,
  }),
}));
