import { Box, Modal as MUIModal } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { NavbarHeight } from 'src/const';

export const Modal = styled(MUIModal)(({ theme }) => ({
  paddingTop: NavbarHeight.XS,
  zIndex: 1500,
  overflow: 'auto',
}));

export const SupportModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  top: `calc( ${NavbarHeight.XS} + ${theme.spacing(3)} )`,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    top: NavbarHeight.SM,
    width: '100%',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    width: '50%',
    maxHeight: `calc( 100vh - ${NavbarHeight.MD} - ${theme.spacing(4)} )`,
    overflow: 'auto',
    borderRadius: '12px',
    top: NavbarHeight.MD,
  },
}));
