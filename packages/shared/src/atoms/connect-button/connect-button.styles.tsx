import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ConnectButtonBase = styled(Button)(({ theme }) => ({
  padding: '12px 16px',
  background: theme.palette.brandSecondary.main, //#D63CA3
  borderRadius: '28px',
  color: 'white',
  width: '190px',
  textTransform: 'none',
}));
