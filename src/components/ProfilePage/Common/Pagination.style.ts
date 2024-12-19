import type { Breakpoint, ButtonProps } from '@mui/material';
import { alpha, Box, Button, styled } from '@mui/material';
import Link from 'next/link';

export const PaginationContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  width: '100%',
  display: 'flex',
  height: 40,
  padding: theme.spacing(0.5),
  marginTop: theme.spacing(3),
  justifyContent: 'space-between',
  pointerEvents: 'none',
  borderRadius: '20px',
  background: alpha(theme.palette.text.primary, 0.04),
}));

export interface PaginationButtonProps extends ButtonProps {
  activePage?: boolean;
}

export const PaginationLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  // margin: theme.spacing(0, 1),
  // width: 34,
  '&:hover': {
    textDecoration: 'none',
  },
  pointerEvents: 'auto',
}));

export const PaginationButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'activePage',
})<PaginationButtonProps>(({ theme, activePage }) => ({
  backgroundColor: activePage ? theme.palette.white.main : 'transparent',
  color: activePage ? theme.palette.black.main : theme.palette.text.primary,
  height: 34,
  display: activePage ? 'flex' : 'none',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: activePage ? 'unset' : 'pointer',
  pointerEvents: 'auto',
  minWidth: 34,
  padding: theme.spacing(1),
  borderRadius: '16px',
  ...(activePage && {
    boxShadow: theme.palette.shadowLight.main,
    '&:hover': {
      backgroundColor: theme.palette.white.main,
    },
  }),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    display: 'flex',
  },
}));

export const PaginationClosestPages = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('lg' as Breakpoint)]: {
    display: 'none',
  },
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));
