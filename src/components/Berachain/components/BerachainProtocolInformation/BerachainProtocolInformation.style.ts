import type { Breakpoint } from '@mui/material';
import { IconButton } from '@mui/material';
import { alpha, Box, styled } from '@mui/material';
import Link from 'next/link';

export const BerachainProtocolActionBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  marginTop: theme.spacing(3),
  [theme.breakpoints.down('md' as Breakpoint)]: {
    flexDirection: 'column',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const BerachainProtocolActionInfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  borderRadius: '24px',
  background: '#121214',
  boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
  [theme.breakpoints.down('md' as Breakpoint)]: {
    maxWidth: 380,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    maxWidth: 640,
    padding: theme.spacing(3),
  },
}));

export const BerachainInformationProtocolIntro = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
}));

export const BerachainInformationProtocolCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.primary,
  gap: theme.spacing(1.5),
  padding: theme.spacing(3),
  borderRadius: '24px',
  background: '#1E1D1C',
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
}));

export const BerachainInformationProtocolShareLink = styled(Link)(() => ({
  color: 'inherit',
  textDecoration: 'none',
}));

export const BerachainInformationProtocolShare = styled(IconButton)(
  ({ theme }) => ({
    background: alpha(theme.palette.text.primary, 0.08),
    color: theme.palette.text.primary,
    transition: 'background-color 300ms ease-in-out',
    '&:hover': {
      background: alpha(theme.palette.text.primary, 0.16),
    },
  }),
);
