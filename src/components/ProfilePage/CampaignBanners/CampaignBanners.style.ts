import type { Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';

export const CampaignBannersContainer = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1.25),
  marginTop: theme.spacing(4),
  display: 'flex',
  gap: theme.spacing(3),
  borderRadius: '24px',
  flexDirection: 'column',
  boxShadow: theme.shadows[1],

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(3),
  },

  [theme.breakpoints.up('md' as Breakpoint)]: {
    flexDirection: 'row',
  },
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  }),
}));
