import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';
import { ButtonPrimary } from '../../Button';
import { SectionTitle } from '../ProfilePage.style';

export const QuestsOverviewContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(288px, 1fr))',
  gridColumnGap: theme.spacing(1),
  gridRowGap: theme.spacing(2),
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '32px',
  paddingY: theme.spacing(2),
  paddingX: theme.spacing(1),
  boxShadow: theme.palette.shadow.main,
  marginTop: theme.spacing(4),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(3),
  },
}));

export const QuestsOverviewTitle = styled(SectionTitle)(({ theme }) => ({
  gridColumn: '1 / -1',
  marginBottom: '8px',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginBottom: '8px',
  },
}));

export interface SeeAllButtonContainerProps
  extends Omit<BoxProps, 'component'> {
  show: boolean;
}

export const SeeAllButtonContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'show',
})<SeeAllButtonContainerProps>(({ theme, show }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: show ? theme.spacing(2) : 0,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: theme.spacing(4),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    marginTop: theme.spacing(6),
  },
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
