import type { BoxProps, Breakpoint, TypographyProps } from '@mui/material';
import {
  alpha,
  Box,
  darken,
  Divider,
  Skeleton,
  styled,
  Typography,
} from '@mui/material';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { ButtonSecondary } from '../Button';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';

interface LeaderboardEntryWrapperProps extends BoxProps {
  isUserConnected?: boolean;
  isUserPosition?: boolean;
  isUserEntry?: boolean;
}

export const LeaderboardEntryWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'isUserEntry' &&
    prop !== 'isUserConnected' &&
    prop !== 'isUserPosition',
})<LeaderboardEntryWrapperProps>(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2, 0),
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  position: 'relative',
  zIndex: 1,
  variants: [
    {
      props: ({ isUserEntry }) => isUserEntry,
      style: {
        background: (theme.vars || theme).palette.surface1ActiveAccent,
        border: getSurfaceBorder(theme, 'surface1'),
        borderRadius: theme.shape.cardBorderRadiusLarge,
        boxShadow: (theme.vars || theme).shadows[2],
        marginTop: theme.spacing(3),
        padding: theme.spacing(2, 1),
        ...theme.applyStyles('light', {
          background: (theme.vars || theme).palette.white.main,
        }),
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          padding: theme.spacing(2, 3),
        },
      },
    },
    {
      props: ({ isUserConnected, isUserEntry }) =>
        isUserEntry && isUserConnected,
      style: {
        transition: 'background-color 250ms',
        border: getSurfaceBorder(theme, 'surface1'),
        ':hover': {
          cursor: 'pointer',
          backgroundColor: (theme.vars || theme).palette.rubyDark[100],
          ...theme.applyStyles('light', {
            background: darken(theme.palette.white.main, 0.04),
          }),
        },
      },
    },
    {
      props: ({ isUserPosition }) => isUserPosition,
      style: {
        '&:before': {
          content: '""',
          position: 'absolute',
          zIndex: -1,
          top: -1,
          bottom: -1,
          left: -2,
          right: -2,
          borderRadius: theme.shape.radius8,
          border: `1px solid`,
          borderColor: (theme.vars || theme).palette.borderActive,
          backgroundColor: (theme.vars || theme).palette.surface1ActiveAccent,
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            left: -12,
            right: -12,
          },
        },
      },
    },
  ],
}));

export const LeaderboardEntryDivider = styled(Divider)(({ theme }) => ({
  color: (theme.vars || theme).palette.alphaDark100.main,
  margin: theme.spacing(0, 3),
}));

export const LeaderboardEntryInfos = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  maxWidth: 'calc( 100% - 80px)',
  gap: theme.spacing(1),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    gap: theme.spacing(4),
    maxWidth: '80%',
  },
}));

export const LeaderboardEntryConnect = styled(ButtonSecondary)(({ theme }) => ({
  color: '#200052',
  height: 40,
}));

export const RankLabel = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'inline-block',
  backgroundColor: (theme.vars || theme).palette.alpha100.main,
  borderRadius: theme.shape.radius16,
  minWidth: 32,
  textAlign: 'center',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(1),
  },
}));

export const RankLabelSkeleton = styled(Skeleton)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'inline-block',
  borderRadius: theme.shape.radius16,
  height: 24,
  width: 48,
  minWidth: 84,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height: 32,
    padding: theme.spacing(1, 2),
    minWidth: 100,
  },
}));

interface RankWalletProps extends ImageProps {
  isUserEntry?: boolean;
}

export const RankWalletImage = styled(Image, {
  shouldForwardProp: (prop) => prop !== 'isUserEntry',
})<RankWalletProps>(({ theme }) => ({
  borderRadius: theme.shape.radiusRoundedFull,
  width: 24,
  height: 24,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    display: 'block',
    width: 48,
    height: 48,
  },
  variants: [
    {
      props: ({ isUserEntry }) => isUserEntry,
      style: {
        display: 'none',
      },
    },
  ],
}));

export const RankWalletImageSkeleton = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.shape.radiusRoundedFull,
  display: 'none',
  width: 24,
  height: 24,
  flexShrink: 0,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    display: 'block',
    width: 48,
    height: 48,
  },
}));

interface RankWalletAddressProps extends TypographyProps {
  hide?: boolean;
}

export const RankWalletAddress = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'hide',
})<RankWalletAddressProps>(({ theme }) => ({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  [theme.breakpoints.down('sm' as Breakpoint)]: {
    fontSize: '14px',
  },
  variants: [
    {
      props: ({ hide }) => hide,
      style: {
        [theme.breakpoints.down('sm' as Breakpoint)]: {
          display: 'none',
        },
      },
    },
  ],
}));

export const RankPointsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginRight: theme.spacing(1),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    gap: theme.spacing(2),
    marginRight: 0,
  },
}));
