'use client';

import type { AppBarProps } from '@mui/material';
import { AppBar } from '@mui/material';

import { HeaderHeight } from '@/const/headerHeight';
import { Link } from '@/components/Link';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

interface NavbarContainerProps extends AppBarProps {
  hasBlurredNavigation?: boolean;
}

export const NavbarContainer = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'hasBlurredNavigation',
})<NavbarContainerProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  backdropFilter: 'blur(12px)',
  boxShadow: 'unset',
  background: 'transparent',
  alignItems: 'center',
  height: HeaderHeight.XS,
  padding: theme.spacing(1, 2),
  zIndex: 1300,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height: HeaderHeight.SM,
    padding: theme.spacing(2, 3),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(3),
    height: HeaderHeight.MD,
  },
  variants: [
    {
      props: ({ hasBlurredNavigation }) => !hasBlurredNavigation,
      style: {
        backdropFilter: 'blur(12px)',
      },
    },
  ],
}));

export const LogoLink = styled(Link)(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  height: '32px',
  alignContent: 'center',
}));
