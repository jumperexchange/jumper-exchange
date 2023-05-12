import { Box } from '@mui/material';
import { Breakpoint, styled } from '@mui/material/styles';
import { NavbarHeight } from '../Navbar/Navbar.style';

export const SupportModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: NavbarHeight.XS,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    top: NavbarHeight.SM,
    width: '100%',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    width: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));
