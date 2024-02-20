import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, darken } from '@mui/material';

import { styled } from '@mui/material/styles';

export const BlogCtaContainer = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  padding: theme.spacing(6),
  cursor: 'pointer',
  margin: theme.spacing(6, 0),
  borderRadius: '16px',
  background:
    theme.palette.mode === 'light'
      ? '#F6F0FF' //todo: add to theme
      : darken('#9747FF', 0.8),
}));

export const BlogCtaTitle = styled(Box)<BoxProps>(({ theme }) => ({
  fontFamily: 'Urbanist, Inter',
  fontWeight: 700,
  fontSize: '32px',
  lineHeight: '38px',
  userSelect: 'none',

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    fontSize: '48px',
    lineHeight: '58px',
  },
}));
