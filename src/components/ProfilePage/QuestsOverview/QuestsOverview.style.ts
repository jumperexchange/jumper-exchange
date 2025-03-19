import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';
import { SectionTitle } from 'src/components/styles';
import { ButtonPrimary } from '../../Button';

export const QuestsOverviewContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(288px, 1fr))',
  gridColumnGap: theme.spacing(1),
  gridRowGap: theme.spacing(2),
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '32px',
  padding: theme.spacing(2, 1),
  paddingBottom: theme.spacing(1.25),
  boxShadow: theme.shadows[1],
  marginTop: theme.spacing(4),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(4, 3, 3.25),
  },
}));

export const QuestsOverviewTitle = styled(SectionTitle)(({ theme }) => ({
  gridColumn: '1 / -1',
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1.5),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: 0,
    marginBottom: '8px',
  },
}));

export interface SeeAllButtonContainerProps extends BoxProps {
  show: boolean;
}

export const SeeAllButtonContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'show',
})<SeeAllButtonContainerProps>(({ theme }) => ({
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
  variants: [
    {
      props: ({ show }) => show,
      style: {
        marginTop: theme.spacing(2),
      },
    },
  ],
}));

export const SeeAllButton = styled(ButtonPrimary)(({ theme }) => ({
  color: 'inherit',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.alphaDark100.main
      : theme.palette.alphaLight400.main,
  width: 320,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.alphaDark200.main
        : theme.palette.alphaLight500.main,
  },
}));
