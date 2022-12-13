import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DisconnectButtonBase = styled(Button)(({ theme }) => ({
  padding: '8px',
  paddingRight: '16px',
  color: theme.palette.grey[900],
  height: '48px',
  background: theme.palette.grey[100],
  borderRadius: '28px',
  textTransform: 'none',
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  '&:hover': {
    background:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[500],
  },
  [theme.breakpoints.up('sm')]: {
    position: 'relative',
    left: 'unset',
    transform: 'unset',
  },
}));
