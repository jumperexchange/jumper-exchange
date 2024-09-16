import type { Breakpoint } from '@mui/material';
import { Grid } from '@mui/material';

import { styled } from '@mui/material/styles';
import { CarouselHeader, CarouselTitle } from '../BlogCarousel';

export const BlogArticlesCollectionsContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  textDecoration: 'unset',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  alignItems: 'center',
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '32px',
  transition: 'background-color 250ms',
  marginBottom: theme.spacing(14.5),
  padding: theme.spacing(2),
  margin: theme.spacing(6, 2, 0),
  boxShadow: theme.palette.shadow.main,
  ':last-of-type': {
    marginBottom: theme.spacing(6),
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(2, 8, 0),
    padding: theme.spacing(3),
    ':last-of-type': {
      marginBottom: theme.spacing(2),
    },
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(4),
    margin: theme.spacing(12, 8, 0),
    ':last-of-type': {
      marginBottom: theme.spacing(12),
    },
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    padding: theme.spacing(6),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: `${theme.spacing(12, 'auto', 0)}`,
    maxWidth: theme.breakpoints.values.xl,
    ':last-of-type': {
      marginBottom: theme.spacing(12),
    },
  },
}));

export const BlogArticlesCollectionsTitle = styled(CarouselTitle)(
  ({ theme }) => ({
    color: theme.palette.text.primary,
    // fontFamily: urbanist.style.fontFamily,
    // textAlign: 'center',
    // color: theme.palette.text.primary,
  }),
);

export const BlogArticlesCollectionsHeader = styled(CarouselHeader)(() => ({}));
