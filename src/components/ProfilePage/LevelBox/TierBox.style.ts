import { alpha, Box, styled, Typography } from '@mui/material';

export const TierBadgeBox = styled(Box)(({ theme }) => ({
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor: alpha(theme.palette.white.main, 0.08),
  padding: '15px 40px',
  borderRadius: '48px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('light', {
    borderColor: '#F9F5FF',
  }),
}));

export const TierInfoBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const TierboxInfoTitles = styled(Typography)(({ theme }) => ({
  userSelect: 'none',
  color: (theme.vars || theme).palette.text.primary,
  marginTop: theme.spacing(1),
}));
