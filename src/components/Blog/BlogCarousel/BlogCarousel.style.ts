import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';
import type { BlogArticleData } from 'src/types';
import { ButtonPrimary } from '../../Button';

export const BlogCarouselContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#F9F5FF'
      : theme.palette.alphaDark500.main,
  padding: theme.spacing(1.5),
  margin: theme.spacing(6, 2),
  borderRadius: '32px',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(6, 4),
    margin: theme.spacing(0, 2, 8),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    padding: theme.spacing(6),
    margin: theme.spacing(12, 8, 8),
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
