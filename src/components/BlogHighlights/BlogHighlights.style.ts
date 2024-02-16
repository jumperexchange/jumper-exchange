import type { Breakpoint, TypographyProps } from '@mui/material';
import { Typography, darken } from '@mui/material';

import { styled } from '@mui/material/styles';

import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';

import { alpha } from '@mui/material/styles';

export const BlogHightsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<BoxProps>(({ theme }) => ({
  position: 'relative',
  borderRadius: 32,
  backgroundColor: '#F9F5FF', //todo: add to theme
  transition: 'background-color 250ms',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1.5),
  margin: theme.spacing(6, 2),
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: darken('#F9F5FF', 0.04),
  },
  // ':before': {
  //   content: "' '",
  //   position: 'absolute',
  //   left: 0,
  //   right: 0,
  //   top: 0,
  //   bottom: 0,
  //   borderRadius: 32,
  //   transition: 'background-color 250ms',
  //   backgroundColor: 'transparent',
  // },
  // '&:hover:before': {
  //   backgroundColor: getContrastAlphaColor(theme, 0.04),
  // },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(8),
    // padding: theme.spacing(0),
    // padding: theme.spacing(6),
    // margin: theme.spacing(12, 8, 8),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    margin: theme.spacing(8),
    padding: theme.spacing(8),
    // padding: theme.spacing(6),
    // margin: theme.spacing(12, 8, 8),
  },

  [theme.breakpoints.up('lg' as Breakpoint)]: {
    flexDirection: 'row',
    margin: theme.spacing(8),
    padding: theme.spacing(8),
    // padding: theme.spacing(6),
    // margin: theme.spacing(12, 8, 8),
  },
}));

export const BlogHighlightsCard = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  backgroundColor: alpha(theme.palette.primary.main, 0.25),
  top: theme.spacing(-4),
  margin: theme.spacing(4, 2.5),
  padding: theme.spacing(4),
  borderRadius: '36px',
  width: 'auto',
  alignItems: 'center',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    margin: theme.spacing(4, 2.5),
    padding: theme.spacing(4),
    height: 576,
  },
}));

export const BlogHighlightsImage = styled('img')(({ theme }) => ({
  borderRadius: '20px',
  userSelect: 'none',
  alignSelf: 'flex-start',
  // margin: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    borderRadius: '14px',
    width: '54%',
    alignSelf: 'center',
    boxShadow:
      theme.palette.mode === 'light'
        ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
        : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  },
}));

export const BlogHighlightsContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: '#525252', //todo: add to theme
  flexDirection: 'column',
  alignSelf: 'flex-end',
  justifyContent: 'flex-end',
  paddingBottom: theme.spacing(2),
  margin: theme.spacing(4, 0),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginBottom: 0,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    margin: theme.spacing(4, 0),
    marginBottom: 0,
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    margin: theme.spacing(4),
  },
}));

export const BlogHighlightsDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 400,

  [theme.breakpoints.up('lg' as Breakpoint)]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const BlogHighlightsTitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    userSelect: 'none',
    color: theme.palette.black.main,
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    overflow: 'hidden',
    fontFamily: 'Urbanist, Inter', //todo: use typography
    fontSize: '48px',
    lineHeight: '56px',
    fontWeight: 700,
    maxHeight: 168,
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',

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
    fontSize: '18px',
    lineHeight: '32px',
    overflow: 'hidden',
    maxHeight: 96,
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': '4',
    '-webkit-box-orient': 'vertical',
    // [theme.breakpoints.up('sm' as Breakpoint)]: {
    //   marginBottom: theme.spacing(3),
    // },
  }),
);
