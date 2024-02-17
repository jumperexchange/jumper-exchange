import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, darken } from '@mui/material';

import { styled } from '@mui/material/styles';

export const DiscordBanner = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#EDE0FF' : darken('#EDE0FF', 0.1), //todo: add to theme
  borderRadius: '32px',
  padding: theme.spacing(6),
  margin: theme.spacing(6, 2),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(12, 8),
    margin: theme.spacing(8),
  },
}));
