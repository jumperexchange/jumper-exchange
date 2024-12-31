import { MenuItem } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const BerachainMarketFilterItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: '8px',
  background: alpha(theme.palette.white.main, 0.08),
  marginTop: theme.spacing(0.5),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  '&:hover': {
    background: alpha(theme.palette.white.main, 0.16),
  },
  ':first-of-type': {
    marginTop: 0,
  },
}));
