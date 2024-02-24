import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, alpha, styled } from '@mui/material';
import type { BlogArticleData } from 'src/types';
import { ButtonPrimary } from '../../Button';

export const BlogCarouselContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#F9F5FF'
      : alpha(theme.palette.white.main, 0.08),
  // marginTop: theme.spacing(6),
  padding: theme.spacing(2),
  borderRadius: '32px',
  margin: theme.spacing(6, 2),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(8),
    padding: theme.spacing(6, 3),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(8, 4),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    padding: theme.spacing(6),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: `${theme.spacing(8, 'auto')}`,
    maxWidth: theme.breakpoints.values.xl,
  },
}));

export interface SeeAllButtonContainerProps
  extends Omit<BoxProps, 'component'> {
  data: BlogArticleData[];
}

export const SeeAllButtonContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'data',
})<SeeAllButtonContainerProps>(({ theme, data }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: !!data?.length ? theme.spacing(1) : 0,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: theme.spacing(4.5),
  },
}));

export const SeeAllButton = styled(ButtonPrimary)(({ theme }) => ({
  color: 'inherit',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.alphaDark100.main
      : theme.palette.alphaLight400.main,
  width: 320,
  margin: theme.spacing(2, 'auto'),
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.alphaDark200.main
        : theme.palette.alphaLight500.main,
  },
}));
