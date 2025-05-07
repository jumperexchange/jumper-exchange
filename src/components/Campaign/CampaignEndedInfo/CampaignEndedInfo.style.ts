'use client';
import { Box } from '@mui/material'; //ButtonProps
import { Breakpoint, styled } from '@mui/material/styles';

export const CampaignEndedInfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  color: (theme.vars || theme).palette.white.main,
  backgroundColor: (theme.vars || theme).palette.alphaLight500.main,
  borderRadius: '24px',
  boxShadow: theme.shadows[1],
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(3),
  },
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.black.main,
    backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  }),
}));
