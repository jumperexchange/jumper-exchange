import type {
  BoxProps,
  Breakpoint,
  GridProps,
  SkeletonProps,
} from '@mui/material';
import { Box, Grid, Skeleton, type CardProps } from '@mui/material';

import { alpha, styled } from '@mui/material/styles';
import { handleNavigationIndex } from 'src/utils';

export const BlogHightsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<BoxProps>(({ theme }) => ({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    // height: 600,
  },
}));

export interface BlogHighlightsCardProps extends Omit<GridProps, 'component'> {
  active?: boolean;
  index?: number;
  activePost?: number;
}

export const BlogHighlightsCard = styled(Grid, {
  shouldForwardProp: (prop) =>
    prop !== 'index' && prop !== 'activePost' && prop !== 'active',
})<BlogHighlightsCardProps>(({ theme, index, activePost }) => ({
  display: 'grid',
  gridColumn: 1,
  gridRow: 1,
  backgroundColor: alpha(theme.palette.primary.main, 0.25),
  // position: 'absolute',
  top: theme.spacing(-4),
  margin: theme.spacing(4, 2.5),
  gridColumnGap: theme.spacing(2),
  borderRadius: '36px',
  width: 'auto',
  padding: theme.spacing(4),
  gridRowGap: 4,
  gridTemplateRows: 'auto',
  gridTemplateColumns: '1fr',
  alignItems: 'center',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    margin: theme.spacing(4, 6),
    gridColumnGap: theme.spacing(4),
    gridTemplateColumns: '.75fr 1fr',
    gridTemplateRows: '1fr 80px',
    height: 600,
  },
  ...(activePost === index && {
    opacity: 1,
  }),
  ...(activePost !== index && {
    opacity: 0,
    zIndex: 100,
    pointerEvents: 'none',
  }),
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
  gridRow: '1',
  gridColumn: '1 / span 2',
  alignSelf: 'flex-start',
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  width: '100%',
  '&:hover': {
    cursor: 'pointer',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    gridRow: '1 / span 2',
    alignSelf: 'center',
    gridColumn: '2',
  },
}));

export const BlogHighlightsContent = styled(Box)(({ theme }) => ({
  gridRow: 2,
  display: 'flex',
  marginBottom: theme.spacing(10),
  flexDirection: 'column',
  alignSelf: 'flex-end',
  justifyContent: 'flex-end',
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginRight: theme.spacing(2),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    paddingBottom: theme.spacing(10),
    marginBottom: theme.spacing(0),
    gridRow: 'auto',
  },
}));
