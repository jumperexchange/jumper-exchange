import type { Breakpoint, TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';

import { styled } from '@mui/material/styles';

export const BlogHighlightsTitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    userSelect: 'none',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    maxHeight: 156,
    overflow: 'hidden',
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      marginTop: theme.spacing(2),
    },
    [theme.breakpoints.up('md' as Breakpoint)]: {
      marginTop: theme.spacing(0),
    },
  }),
);

export const BlogHighlightsSubtitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    userSelect: 'none',
    marginBottom: theme.spacing(3),
    maxHeight: 172,
    overflow: 'hidden',
  }),
);
