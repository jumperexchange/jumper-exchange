import type { Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';
import { SectionTitle } from '../ProfilePage.style';

export const QuestsOverviewContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(288px, 1fr))',
  gridColumnGap: theme.spacing(1),
  gridRowGap: theme.spacing(2),
  backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  borderRadius: '24px',
  padding: theme.spacing(2, 1),
  paddingBottom: theme.spacing(1.25),
  boxShadow: (theme.vars || theme).shadows[1],
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
