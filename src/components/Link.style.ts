import type { LinkProps } from '@mui/material';
import { Link as MuiLink, styled } from '@mui/material';

export const Link = styled(MuiLink)<LinkProps>(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
}));
