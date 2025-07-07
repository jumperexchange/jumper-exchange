'use client';
import { Container as MuiContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

export const BlogCarouselContainer = styled(MuiContainer)(({ theme }) => ({
  position: 'relative',
  backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  borderRadius: '32px',
  boxShadow: (theme.vars || theme).shadows[1],
  margin: theme.spacing(6, 2, 0),
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1.25),
  width: 'auto',

  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(8, 8, 0),
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(2.25),
  },
  [theme.breakpoints.up('md')]: {
    margin: theme.spacing(12, 8, 0),
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(3.25),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(6),
    paddingBottom: theme.spacing(5.25),
  },
  [theme.breakpoints.up('xl')]: {
    margin: `${theme.spacing(12, 'auto', 0)}`,
    maxWidth: theme.breakpoints.values.xl,
  },
}));
