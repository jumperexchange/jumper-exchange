import type { Breakpoint } from '@mui/material';
import { Box, Grid } from '@mui/material';

import { alpha, styled } from '@mui/material/styles';
import { CarouselHeader, CarouselTitle } from '../BlogCarousel';

export const BlogArticlesBoardContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  textDecoration: 'unset',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  alignItems: 'center',
  backgroundColor: theme.palette.bgSecondary.main,
  boxShadow: theme.palette.shadow.main,
  borderRadius: '32px',
  cursor: 'pointer',
  padding: theme.spacing(6),
  transition: 'background-color 250ms',
  margin: theme.spacing(6, 2),
  marginBottom: theme.spacing(10),
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    margin: theme.spacing(8),
  },
}));

export const ArticlesGrid = styled(Grid)(({ theme }) => ({
  margin: theme.spacing(2, 'auto'),
  display: 'grid',
  marginTop: `calc(${theme.spacing(5)} + ${theme.spacing(8)} + ${theme.spacing(6)} )`, // title height + tabs container + actual offset
  paddingBottom: theme.spacing(13),
  gridTemplateColumns: '1fr',
  justifyItems: 'center',
  gap: theme.spacing(3),
  [theme.breakpoints.up('md' as Breakpoint)]: {
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(4),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    maxWidth: 'fit-content',
    paddingBottom: theme.spacing(14.5),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    gridTemplateColumns: '1fr 1fr 1fr',
    paddingBottom: theme.spacing(14.5),
    maxWidth: theme.breakpoints.values.xl,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export const BlogArticlesBoardTitle = styled(CarouselTitle)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const BlogArticlesBoardHeader = styled(CarouselHeader)(() => ({}));

export const CategoryTabPanelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  textDecoration: 'unset',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  alignItems: 'center',
  backgroundColor: theme.palette.bgSecondary.main,
  boxShadow: theme.palette.shadow.main,
  borderRadius: '32px',
  cursor: 'pointer',
  padding: theme.spacing(6),
  transition: 'background-color 250ms',
  margin: theme.spacing(6, 2),
  marginBottom: theme.spacing(14.5),
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.white.main, 1)
        : alpha(theme.palette.white.main, 0.2),
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(12, 8),
    margin: theme.spacing(8),
    marginBottom: theme.spacing(14.5),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(12, 8),
    marginTop: theme.spacing(12),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: theme.spacing(12, 'auto'),
    marginBottom: theme.spacing(14.5),
    maxWidth: theme.breakpoints.values.xl,
  },
}));
