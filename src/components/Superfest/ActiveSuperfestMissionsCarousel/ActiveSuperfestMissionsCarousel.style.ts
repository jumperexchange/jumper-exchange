import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';
import { ButtonPrimary } from '../../Button';

export const SuperfestCarouselContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fdfbef',
  borderRadius: '12px',
  width: '90%',
  padding: theme.spacing(2),
  boxShadow: (theme.vars || theme).shadows[1],
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(2, 4, 0),
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(4),
    margin: theme.spacing(12, 4, 0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    padding: theme.spacing(6, 4),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: `${theme.spacing(12, 'auto', 0)}`,
    maxWidth: theme.breakpoints.values.xl,
  },
}));

export interface SeeAllButtonContainerProps extends BoxProps {
  show: boolean;
}

export const SeeAllButtonContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'show',
})<SeeAllButtonContainerProps>(({
  theme
}) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: 0,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: theme.spacing(4),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    marginTop: theme.spacing(6),
  },
  variants: [{
    props: (
      {
        show
      }
    ) => show,
    style: {
      marginTop: theme.spacing(2)
    }
  }]
}));

export const SeeAllButton = styled(ButtonPrimary)(({ theme }) => ({
  color: 'inherit',
  backgroundColor:
    (theme.vars || theme).palette.alphaLight400.main,
  width: 320,
  '&:hover': {
    backgroundColor:
      (theme.vars || theme).palette.alphaLight500.main,
    ...theme.applyStyles("light", {
      backgroundColor: (theme.vars || theme).palette.alphaDark200.main
    })
  },
  ...theme.applyStyles("light", {
    backgroundColor: (theme.vars || theme).palette.alphaDark100.main
  })
}));
