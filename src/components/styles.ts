import type { Breakpoint } from '@mui/material';
import { Container, styled } from '@mui/material';

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
