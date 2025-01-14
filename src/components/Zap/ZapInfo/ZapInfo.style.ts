import { alpha, Box, Breakpoint, styled, IconButton } from '@mui/material';
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
  maxWidth: 640,
  gap: theme.spacing(2),
  borderRadius: '24px',
  background: theme.palette.surface1.main,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
}));

export const ZapActionProtocolIntro = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
}));

export const ZapActionProtocolCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.primary,
  gap: theme.spacing(1.5),
  padding: theme.spacing(3),
  borderRadius: '24px',
  border: `1px solid ${theme.palette.mode === 'light' ? '#E5E1EB' : theme.palette.grey[800]}`,
  background:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : theme.palette.surface2.main,
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
}));

export const ZapActionProtocolDisclaimer = styled(ZapActionProtocolCard)(
  ({ theme }) => ({
    background:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.white.main, 0.04)
        : alpha(theme.palette.text.primary, 0.48),
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '12px',
  }),
);

export const ZapActionProtocolShareLink = styled(Link)(() => ({
  color: 'inherit',
  textDecoration: 'none',
}));

export const ZapActionProtocolShare = styled(IconButton)(({ theme }) => ({
  background: alpha(theme.palette.text.primary, 0.08),
  color: theme.palette.text.primary,
  transition: 'background-color 300ms ease-in-out',
  '&:hover': {
    background: alpha(theme.palette.text.primary, 0.16),
  },
}));

export const ZapTabsBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(3, 1),
  borderRadius: '24px',
  backgroundColor: theme.palette.surface1.main,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
}));

export const ZapWidgetSizeBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(3, 1),
  borderRadius: '24px',
  backgroundColor: theme.palette.surface1.main,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
}));

export const ZapStyledAccordionItem = styled('div')(({ theme }) => ({
  padding: '0px 8px',
  backgroundColor: 'transparent',
  '.MuiAccordionSummary-root': {
    padding: 0,
  },
  '.accordion-items': {
    gap: '4px',
  },
  '.MuiAccordionDetails-root': {
    padding: '20px 16px 16px',
  },
}));
