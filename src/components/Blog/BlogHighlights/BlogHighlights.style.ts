import type { BoxProps, Breakpoint, TypographyProps } from '@mui/material';
import { Box, Typography, darken, lighten } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const BlogHightsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<BoxProps>(({ theme }) => ({
  position: 'relative',
  borderRadius: 32,
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#F9F5FF'
      : alpha(theme.palette.white.main, 0.08),
  transition: 'background-color 250ms',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  margin: theme.spacing(6, 2),
  '&:hover': {
    cursor: 'pointer',
    backgroundColor:
      theme.palette.mode === 'light'
        ? darken(theme.palette.white.main, 0.04)
        : theme.palette.alphaLight300.main,
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(8),
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(4),
  },

  [theme.breakpoints.up('lg' as Breakpoint)]: {
    padding: theme.spacing(8),
    flexDirection: 'row',
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: `${theme.spacing(8, 'auto')}`,
    maxWidth: theme.breakpoints.values.xl,
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

export const BlogHighlightsMetaContainer = styled(Box)<BoxProps>(
  ({ theme }) => ({
    display: 'flex',
    fontSize: '14px',
    color:
      theme.palette.mode === 'light'
        ? theme.palette.grey[800]
        : theme.palette.grey[300],
    marginLeft: theme.spacing(3),
    [theme.breakpoints.up('lg' as Breakpoint)]: {
      marginTop: 0,
      marginLeft: theme.spacing(3),
    },
  }),
);

export const BlogHighlightsMetaDate = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    display: 'none',
    fontSize: 'inherit',
    [`@media (min-width: 400px)`]: {
      display: 'block',
    },
    '&:after': {
      content: '"•"',
      margin: '0 4px',
    },
  }),
);

export const BlogHighlightsImage = styled('img')(({ theme }) => ({
  borderRadius: '20px',
  userSelect: 'none',
  alignSelf: 'flex-start',
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
  color: theme.palette.mode === 'light' ? '#525252' : lighten('#525252', 0.8), //todo: add to theme
  flexDirection: 'column',
  alignSelf: 'center',
  justifyContent: 'flex-end',
  paddingBottom: theme.spacing(2),
  margin: theme.spacing(3, 0),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(2),
    paddingTop: 0,
    margin: theme.spacing(4, 0),
    marginBottom: 0,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: 0,
    margin: theme.spacing(4, 0),
    marginBottom: 0,
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    margin: theme.spacing(4),
    width: '46%',
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
    color:
      theme.palette.mode === 'light'
        ? theme.palette.black.main
        : theme.palette.white.main,
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    overflow: 'hidden',
    fontFamily: 'Urbanist, Inter', //todo: use typography
    lineHeight: '40px',
    fontSize: '40px',
    fontWeight: 700,
    maxHeight: 168,
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',

    [theme.breakpoints.up('sm' as Breakpoint)]: {
      fontSize: '48px',
      lineHeight: '56px',
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
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
  }),
);
