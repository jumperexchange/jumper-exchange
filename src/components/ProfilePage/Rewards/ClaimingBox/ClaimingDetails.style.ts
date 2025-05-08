import { Typography, styled } from '@mui/material';

export const ClaimingAmountLabel = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.white.main,

  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.black.main,
  }),
}));
