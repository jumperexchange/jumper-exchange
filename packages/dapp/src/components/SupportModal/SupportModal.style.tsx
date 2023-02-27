import { Box } from '@mui/material';
import { Breakpoint, styled } from '@mui/material/styles';

export const SupportModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '64px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  [theme.breakpoints.up('sm' as Breakpoint)]: { top: '72px', width: '100%' },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    width: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));
