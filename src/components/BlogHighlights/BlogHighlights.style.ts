import type { Breakpoint, TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';

import { styled } from '@mui/material/styles';

import type { BoxProps, SkeletonProps } from '@mui/material';
import { Box, Skeleton, type CardProps } from '@mui/material';

import { alpha } from '@mui/material/styles';
import { handleNavigationIndex } from 'src/utils';

export const BlogHightsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<BoxProps>(({ theme }) => ({
  position: 'relative',
  margin: theme.spacing(8),
  padding: theme.spacing(8),
  borderRadius: 32,
  backgroundColor: '#F9F5FF', //todo: add to theme
  display: 'flex',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    // height: 600,
  },
}));

export const BlogHighlightsCard = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  backgroundColor: alpha(theme.palette.primary.main, 0.25),
  top: theme.spacing(-4),
  margin: theme.spacing(4, 2.5),
  borderRadius: '36px',
  width: 'auto',
  padding: theme.spacing(4),
  alignItems: 'center',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    margin: theme.spacing(4, 6),
    height: 576,
  },
}));

export interface CircleProps extends Omit<CardProps, 'component'> {
  active: boolean;
  'data-index': number;
  swipeDeltaX?: number | null;
  paginationIndex: number;
  activePost: number;
  maxHighlights: number;
}
export const Circle = styled('span', {
  shouldForwardProp: (prop) =>
    prop !== 'active' &&
    prop !== 'swipeDeltaX' &&
    prop !== 'paginationIndex' &&
    prop !== 'activePost' &&
    prop !== 'maxHighlights',
})<CircleProps>(
  ({
    theme,
    active,
    swipeDeltaX,
    paginationIndex,
    activePost,
    maxHighlights,
  }) => ({
    display: 'block',
    width: 8,
    height: 8,
    borderRadius: 4,
    cursor: 'pointer',
    opacity: active ? 1 : 0.16,
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.alphaDark800.main
        : theme.palette.alphaLight800.main,
    '&:not(:first-of-type)': {
      marginLeft: theme.spacing(0.5),
    },
    '&:not(:last-of-type)': {
      marginRight: theme.spacing(0.5),
    },
    ':hover': {
      backgroundColor: theme.palette.alphaDark600,
    },

    ...(swipeDeltaX &&
      swipeDeltaX > 0 &&
      paginationIndex ===
        handleNavigationIndex({
          direction: 'prev',
          active: activePost,
          max: maxHighlights,
        }) && {
        opacity: Math.abs(swipeDeltaX) / 250 + 0.16,
      }),
    ...(swipeDeltaX &&
      swipeDeltaX < 0 &&
      paginationIndex ===
        handleNavigationIndex({
          direction: 'next',
          active: activePost,
          max: maxHighlights,
        }) && {
        opacity: Math.abs(swipeDeltaX) / 250 + 0.16,
      }),
    ...(swipeDeltaX &&
      swipeDeltaX > 0 &&
      paginationIndex === activePost && {
        opacity: Math.max(
          0.16,
          1 - Math.abs(swipeDeltaX < 250 ? swipeDeltaX / 250 : 0.84),
        ),
      }),
    ...(swipeDeltaX &&
      swipeDeltaX < 0 &&
      paginationIndex === activePost && {
        opacity: Math.max(
          0.16,
          1 - Math.abs(swipeDeltaX < 250 ? swipeDeltaX / 250 : 0.84),
        ),
      }),
  }),
);

export const SkeletonCircle = styled(Skeleton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<SkeletonProps>(({ theme }) => ({
  display: 'block',
  width: 8,
  height: 8,
  '&:not(:first-of-type)': {
    marginLeft: theme.spacing(0.5),
  },
  '&:not(:last-of-type)': {
    marginRight: theme.spacing(0.5),
  },
}));

export const BlogHighlightsImage = styled('img')(({ theme }) => ({
  borderRadius: '14px',
  userSelect: 'none',
  alignSelf: 'flex-start',
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  width: '60%',
  '&:hover': {
    cursor: 'pointer',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    alignSelf: 'center',
  },
}));

export const BlogHighlightsContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(10),
  color: '#525252', //todo: add to theme
  flexDirection: 'column',
  alignSelf: 'flex-end',
  justifyContent: 'flex-end',
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(8),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    paddingBottom: theme.spacing(10),
    marginBottom: theme.spacing(0),
  },
}));

export const BlogHighlightsDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 400,
}));

export const BlogHighlightsTitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    userSelect: 'none',
    color: theme.palette.black.main,
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    maxHeight: 156,
    overflow: 'hidden',
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      marginTop: theme.spacing(2),
    },
    [theme.breakpoints.up('md' as Breakpoint)]: {
      marginTop: theme.spacing(4),
    },
  }),
);

export const BlogHighlightsSubtitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    userSelect: 'none',
    marginBottom: theme.spacing(3),
    maxHeight: 172,
    overflow: 'hidden',
  }),
);
