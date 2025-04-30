import type { Breakpoint } from '@mui/material';
import { alpha, Box, IconButton, styled } from '@mui/material';
import Link from 'next/link';

export const ZapProtocolActionBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(4),
  margin: theme.spacing(3, 'auto'),
  [theme.breakpoints.down('md' as Breakpoint)]: {
    flexDirection: 'column',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const ZapProtocolActionInfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(3),
  flexDirection: 'column',
  marginTop: theme.spacing(2),
  gap: theme.spacing(2),
  borderRadius: '24px',
  background: (theme.vars || theme).palette.surface1.main,
  boxShadow:
    '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    maxWidth: 640,
  },
  ...theme.applyStyles("light", {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
  })
}));

export const ZapActionProtocolIntro = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
}));

export const ZapActionProtocolCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  color: (theme.vars || theme).palette.text.primary,
  gap: theme.spacing(1.5),
  padding: theme.spacing(3),
  borderRadius: '24px',
  border: `1px solid ${(theme.vars || theme).palette.grey[800]}`,
  background:
    (theme.vars || theme).palette.surface2.main,
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
  ...theme.applyStyles("light", {
    border: `1px solid ${'#E5E1EB'}`,
    background: (theme.vars || theme).palette.white.main
  })
}));

export const ZapActionProtocolDisclaimer = styled(ZapActionProtocolCard)(
  ({ theme }) => ({
    background:
      alpha(theme.palette.text.primary, 0.48),
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '12px',
    ...theme.applyStyles("light", {
      background: (theme.vars || theme).palette.alphaLight100.main
    })
  }),
);

export const ZapActionProtocolShareLink = styled(Link)(() => ({
  color: 'inherit',
  textDecoration: 'none',
}));

export const ZapActionProtocolShare = styled(IconButton)(({ theme }) => ({
  background: alpha(theme.palette.text.primary, 0.08),
  color: (theme.vars || theme).palette.text.primary,
  transition: 'background-color 300ms ease-in-out',
  '&:hover': {
    background: alpha(theme.palette.text.primary, 0.16),
  },
}));

export const ZapTabsBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(3, 0),
  borderRadius: '24px',
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  boxShadow:
    '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    maxWidth: 432,
  },
  ...theme.applyStyles("light", {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
  })
}));
