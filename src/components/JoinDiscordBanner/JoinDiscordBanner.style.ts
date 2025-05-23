import type { Breakpoint } from '@mui/material';
import { Typography, alpha } from '@mui/material';

import { urbanist } from '@/fonts/fonts';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { IconButtonPrimary } from '../IconButton.style';

export const DiscordBannerLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  color: (theme.vars || theme).palette.text.primary,
  textDecoration: 'unset',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  alignItems: 'center',
  backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  boxShadow: (theme.vars || theme).shadows[1],
  borderRadius: '32px',
  cursor: 'pointer',
  padding: theme.spacing(6),
  transition: 'background-color 250ms',
  margin: theme.spacing(6, 2),
  marginBottom: theme.spacing(14.5),
  '&:hover': {
    backgroundColor:
      alpha(theme.palette.white.main, 0.2),
    ...theme.applyStyles("light", {
      backgroundColor: (theme.vars || theme).palette.white.main
    })
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(12, 8),
    margin: theme.spacing(8),
    marginBottom: theme.spacing(14.5),
    flexDirection: 'row',
    gap: theme.spacing(4),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(12, 8),
    marginTop: theme.spacing(12),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: theme.spacing(12, 'auto'),
    marginBottom: theme.spacing(14.5),
    maxWidth: theme.breakpoints.values.xl,
  },
}));

export const DiscordBannerLabel = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontFamily: urbanist.style.fontFamily,
  fontSize: '32px',
  lineHeight: '44px',
  fontWeight: 700,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    fontSize: '40px',
    lineHeight: '56px',
    textDecoration: 'auto',
  },
}));

export const DiscordBannerButton = styled(IconButtonPrimary)(() => ({
  display: 'flex',
}));
