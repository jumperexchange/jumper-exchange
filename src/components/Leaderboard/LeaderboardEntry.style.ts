import type { BoxProps, Breakpoint } from '@mui/material';
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

interface LeaderboardEntryWrapperProps extends BoxProps {
  isUserConnected?: boolean;
  isUserPosition?: boolean;
  isUserEntry?: boolean;
}

export const LeaderboardEntryWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'isUserPosition' &&
    prop !== 'isUserConnected' &&
    prop !== 'isUserEntry',
})<LeaderboardEntryWrapperProps>(
  ({ theme, isUserPosition, isUserConnected, isUserEntry }) => ({
    display: 'flex',
    padding: theme.spacing(2, 0),
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    ...(isUserEntry && {
      background:
        theme.palette.mode === 'light'
          ? theme.palette.white.main
          : theme.palette.bgTertiary.main,
      borderRadius: '24px',
      margin: '10px 0',
      padding: theme.spacing(2, 1),
      [theme.breakpoints.up('sm' as Breakpoint)]: {
        padding: theme.spacing(2, 3),
      },
    }),
    ...(isUserEntry &&
      isUserConnected && {
        transition: 'background-color 250ms',
        ':hover': {
          cursor: 'pointer',
          backgroundColor:
            theme.palette.mode === 'light'
              ? darken(theme.palette.white.main, 0.04)
              : theme.palette.alphaLight300.main,
        },
      }),
    ...(isUserPosition && {
      '&:before': {
        content: '""',
        position: 'absolute',
        top: -1,
        bottom: -1,
        left: -2,
        right: -2,
        borderRadius: '6px',
        backgroundColor: alpha(theme.palette.black.main, 0.04),
        boxShadow: `inset 0 0 0 1px ${theme.palette.grey[400]}`,
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          left: -12,
          right: -12,
        },
      },
    }),
  }),
);

export const LeaderboardEntryDivider = styled(Divider)(({ theme }) => ({
  color: theme.palette.alphaDark100.main,
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

export const RankLabel = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'inline-block',
  backgroundColor: theme.palette.alphaDark100.main,
  borderRadius: '32px',
  minWidth: 84,
  textAlign: 'center',
  ':before': {
    content: '"#"',
    marginRight: theme.spacing(0.25),
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(1, 2),
    minWidth: 100,
  },
}));

export const RankLabelSkeleton = styled(Skeleton)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'inline-block',
  borderRadius: '16px',
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
})<RankWalletProps>(({ theme, isUserEntry }) => ({
  ...(isUserEntry && {
    display: 'none',
  }),
  borderRadius: '100%',
  width: 24,
  height: 24,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    display: 'block',
    width: 48,
    height: 48,
  },
}));

export const RankWalletImageSkeleton = styled(Skeleton)(({ theme }) => ({
  borderRadius: '100%',
  width: 24,
  height: 24,
  flexShrink: 0,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    display: 'block',
    width: 48,
    height: 48,
  },
}));

export const RankWalletAddress = styled(Typography)(({ theme }) => ({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  [theme.breakpoints.down('sm' as Breakpoint)]: {
    fontSize: '14px',
  },
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
