import type { BoxProps, Breakpoint } from '@mui/material';
import { Box } from '@mui/material';

import { styled } from '@mui/material/styles';

export const DiscordBanner = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#F9F5FF' //todo: add to theme
      : theme.palette.alphaDark600.main,
  borderRadius: '32px',
  padding: theme.spacing(6),
  margin: theme.spacing(6, 2),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(12, 8),
    margin: theme.spacing(8, 2),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(12, 8),
    margin: theme.spacing(8),
  },
}));
