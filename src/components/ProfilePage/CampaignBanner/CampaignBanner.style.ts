import { Box, Breakpoint, styled } from '@mui/material';

export const CampaignBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '24px',
  flexDirection: 'row',
  boxShadow: theme.shadows[1],
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(3),
  },

  [theme.breakpoints.up('lg' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));
