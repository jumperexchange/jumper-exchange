'use client';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import { Container as MuiContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

export const BlogCarouselContainer = styled(MuiContainer)(({ theme }) => ({
  position: 'relative',
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  border: getSurfaceBorder(theme, 'surface2'),
  borderRadius: theme.shape.cardBorderRadiusXLarge,
  boxShadow: (theme.vars || theme).shadows[2],
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1.25),
  width: '100%',

  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(2.25),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(3.25),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(6),
    paddingBottom: theme.spacing(5.25),
  },
}));
