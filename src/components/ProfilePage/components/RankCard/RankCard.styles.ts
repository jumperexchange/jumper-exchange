import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { ButtonSecondary } from 'src/components/Button';

export const RankCardContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: (theme.vars || theme).shadows[1],
  background: (theme.vars || theme).palette.surface1.main,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  width: '100%',
  [theme.breakpoints.up('lg')]: {
    maxWidth: 256,
  },
}));

interface RankUserPositionProps extends TypographyProps {
  isGtMillion: boolean;
}

export const RankUserPosition = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isGtMillion',
})<RankUserPositionProps>(({ theme, isGtMillion }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(0, 1),
  textDecoration: 'none',
  position: 'relative',
  height: 64,
  color: (theme.vars || theme).palette.text.primary,
  ...(isGtMillion && { fontSize: '38px !important' }),
}));

export const RankButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
}));

export const RankButton = styled(ButtonSecondary)(({ theme }) => ({
  fontSize: 14,
  width: '100%',
  lineHeight: '18px',
  height: 40,
  color: (theme.vars || theme).palette.text.primary,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.primary.main,
  }),
}));

export const BaseStyledSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
}));
