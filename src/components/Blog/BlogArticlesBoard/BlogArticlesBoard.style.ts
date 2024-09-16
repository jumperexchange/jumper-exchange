import type { Breakpoint, GridProps } from '@mui/material';
import { Grid } from '@mui/material';

import { styled } from '@mui/material/styles';
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
  padding: theme.spacing(6),
  transition: 'background-color 250ms',
  margin: theme.spacing(6, 2),
  marginBottom: theme.spacing(14.5),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(12, 8),
    margin: theme.spacing(8),
    marginBottom: theme.spacing(14.5),
    gap: theme.spacing(4),
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

interface ArticlesGridProps extends GridProps {
  active: boolean;
}

export const ArticlesGrid = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'active',
})<ArticlesGridProps>(({ theme, active }) => ({
  ...(active && {
    margin: theme.spacing(2, 'auto'),
    display: 'grid',
    // marginTop: `calc(${theme.spacing(5)} + ${theme.spacing(8)} + ${theme.spacing(6)} )`, // title height + tabs container + actual offset
    paddingBottom: 0,
    gridTemplateColumns: '1fr',
    justifyItems: 'center',
    gap: theme.spacing(3),
    [theme.breakpoints.up('md' as Breakpoint)]: {
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing(4),
    },
    [theme.breakpoints.up('xl' as Breakpoint)]: {
      gridTemplateColumns: '1fr 1fr 1fr',
      maxWidth: theme.breakpoints.values.xl,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  }),
}));

export const BlogArticlesBoardTitle = styled(CarouselTitle)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const BlogArticlesBoardHeader = styled(CarouselHeader)(() => ({}));
