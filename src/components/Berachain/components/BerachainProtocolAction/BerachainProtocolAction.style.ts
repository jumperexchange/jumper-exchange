import { IconButton } from '@mui/material';
import { alpha, Box, styled } from '@mui/system';
import Link from 'next/link';

export const BerachainProtocolActionBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(4),
}));

export const BerachainProtocolActionInfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(3),
  flexDirection: 'column',
  marginTop: theme.spacing(3),
  gap: theme.spacing(2),
  borderRadius: '24px',
  background: '#121214',
  boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
}));

export const BerachainActionProtocolIntro = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
}));

export const BerachainActionProtocolCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.primary,
  gap: theme.spacing(1.5),
  padding: theme.spacing(3),
  borderRadius: '24px',
  background: '#1E1D1C',
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
}));

export const BerachainActionProtocolShareLink = styled(Link)(() => ({
  color: 'inherit',
  textDecoration: 'none',
}));

export const BerachainActionProtocolShare = styled(IconButton)(({ theme }) => ({
  background: alpha(theme.palette.text.primary, 0.08),
  color: theme.palette.text.primary,
}));
