import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SupportModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '64px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  [theme.breakpoints.up('sm')]: { top: '72px', width: '100%' },
  [theme.breakpoints.up('md')]: {
    width: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));
