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
})<LeaderboardEntryWrapperProps>(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2, 0),
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  position: 'relative',
  variants: [
    {
      props: ({ isUserEntry }) => isUserEntry,
      style: {
        background:
          theme.palette.mode === 'light'
            ? theme.palette.white.main
            : theme.palette.bgTertiary.main,
        borderRadius: '24px',
        boxShadow: theme.shadows[2],
        marginTop: theme.spacing(3),
        padding: theme.spacing(2, 1),
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
        ':hover': {
          cursor: 'pointer',
          backgroundColor:
            theme.palette.mode === 'light'
              ? darken(theme.palette.white.main, 0.04)
              : theme.palette.alphaLight300.main,
        },
      },
    },
    {
      props: ({ isUserPosition }) => isUserPosition,
      style: {
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
        ':last-of-type': {
          borderBottomRightRadius: '16px',
          borderBottomLeftRadius: '16px',
          backgroundColor: 'red',
        },
      },
    },
  ],
}));

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

export const LeaderboardEntryConnect = styled(ButtonSecondary)(({ theme }) => ({
  color: '#200052',
  height: 40,
}));

export const RankLabel = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'inline-block',
  backgroundColor: alpha(theme.palette.text.primary, 0.04),
  borderRadius: '16px',
  minWidth: 32,
  textAlign: 'center',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(1),
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
})<RankWalletProps>(({ theme }) => ({
  borderRadius: '100%',
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
  borderRadius: '100%',
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
