import type { Breakpoint } from '@mui/material';
import { Typography, styled } from '@mui/material';

export const DescriptionTitleTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('md' as Breakpoint)]: {
    fontSize: '32px',
    fontWeight: 700,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    fontSize: '48px',
    fontWeight: 700,
  },
}));
