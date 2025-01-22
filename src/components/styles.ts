import type { Breakpoint } from '@mui/material';
import { Box, Container, styled, Typography } from '@mui/material';

export const PageContainer = styled(Container)(({ theme }) => ({
  marginTop: 16,
  fontFamily: 'var(--font-inter)',
  background: 'transparent',
  borderRadius: '8px',
  position: 'relative',
  width: '100% !important',
  overflow: 'visible', //'hidden',
  paddingBottom: 20,
  [theme.breakpoints.down('md' as Breakpoint)]: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

export const SectionContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '32px',
  width: '100%',
  padding: theme.spacing(4, 2),
  boxShadow: theme.shadows[1],
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(4),
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '32px',
  margin: theme.spacing(0, 1.5, 0),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(0, 1.5, 0),
  },
}));
