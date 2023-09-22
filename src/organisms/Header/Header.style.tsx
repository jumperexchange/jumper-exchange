import { AppBar } from '@mui/material';

import { Link } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { NavbarHeight } from 'src/const';

export const HeaderContainer = styled(AppBar)<{ sticky?: boolean }>(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    backdropFilter: 'blur(12px)',
    boxShadow: 'unset',
    background: 'transparent',
    alignItems: 'center',
    height: NavbarHeight.XS,
    padding: theme.spacing(2, 4),
    zIndex: 1500,
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      height: NavbarHeight.SM,
      padding: theme.spacing(4, 6),
    },
    [theme.breakpoints.up('md' as Breakpoint)]: {
      padding: theme.spacing(6),
      height: NavbarHeight.MD,
    },
  }),
);

export const HeaderLogoLink = styled(Link)(({ theme }) => ({
  height: '48px',
  cursor: 'pointer',
  alignItems: 'center',
  display: 'flex',
}));
