import type { BoxProps } from '@mui/material';
import {
  alpha,
  Box,
  darken,
  Divider,
  Skeleton,
  styled,
  Typography,
} from '@mui/material';
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
      background: theme.palette.bgTertiary.main,
      borderRadius: '24px',
      margin: '10px 0',
      padding: theme.spacing(2, 3),
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
        left: -12,
        right: -12,
        borderRadius: '6px',
        backgroundColor: alpha(theme.palette.black.main, 0.04),
        boxShadow: `inset 0 0 0 1px ${theme.palette.grey[400]}`,
      },
    }),
  }),
);

export const LeaderboardEntryDivider = styled(Divider)(({ theme }) => ({
  color: theme.palette.alphaDark100.main,
  margin: theme.spacing(0, 3),
}));

export const RankLabel = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  display: 'inline-block',
  backgroundColor: theme.palette.alphaDark100.main,
  borderRadius: '32px',
  ':before': {
    content: '"#"',
    marginRight: theme.spacing(0.25),
  },
}));

export const RankLabelSkeleton = styled(Skeleton)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  display: 'inline-block',
  borderRadius: '16px',
  height: 32,
  width: 48,
}));

export const RankWalletImage = styled(Image)(({ theme }) => ({
  borderRadius: '100%',
  marginLeft: theme.spacing(3),
}));

export const RankWalletAddress = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(4),
}));

export const RankPointsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));
