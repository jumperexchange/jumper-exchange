import Box from '@mui/material/Box';
import MuiButton, {
  type ButtonProps as MuiButtonProps,
} from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import { brandColors } from '@/theme/brandColors';

export const RankCardContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('lg')]: {
    maxWidth: theme.spacing(32),
  },
}));

export const rankCardSx: SxProps<Theme> = (theme: Theme) => {
  const palette = (theme.vars ?? theme).palette;
  return {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    overflow: 'hidden',
    border: 'none',
    minHeight: theme.spacing(28.75),
    color: palette.white.main,
    // Always use the light-scheme accents so the gradient matches in dark mode.
    background: `radial-gradient(100% 102.09% at 100% 100%, ${brandColors.light.accent1} 29.33%, ${brandColors.light.accent2} 100%)`,
  };
};

export const RankCardContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(3),
}));

export const RankLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyXSmallStrong,
  color: (theme.vars || theme).palette.white.main,
}));

interface RankUserPositionProps extends TypographyProps {
  isGtMillion: boolean;
}

export const RankUserPosition = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isGtMillion',
})<RankUserPositionProps>(({ theme, isGtMillion }) => ({
  textDecoration: 'none',
  color: (theme.vars || theme).palette.white.main,
  // Clamp very large ranks so they don't overflow the narrow card
  ...(isGtMillion && { fontSize: '38px !important' }),
}));

export const RankJoinedDate = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyXSmall,
  color: (theme.vars || theme).palette.alphaLight700.main,
}));

export const RankButton = styled(MuiButton)<MuiButtonProps>(({ theme }) => ({
  ...theme.typography.bodySmallStrong,
  width: '100%',
  height: theme.spacing(6),
  flexShrink: 0,
  borderRadius: 0,
  textTransform: 'none',
  color: (theme.vars || theme).palette.white.main,
  backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
  transition: 'background-color 250ms',
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
  },
}));

export const BaseStyledSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
}));
