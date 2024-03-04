import type { LinkProps } from '@mui/material';
import { Link as MuiLink, styled } from '@mui/material';

export const Link = styled(MuiLink)<LinkProps>(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.accent1Alt.main,
  fontWeight: 600,
}));
