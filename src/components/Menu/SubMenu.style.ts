'use client';
import type { Breakpoint, TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';

import { styled } from '@mui/material/styles';

export interface SubMenuLabelProps extends TypographyProps {
  isPrefixIcon?: boolean;
  isSuffixIcon?: boolean;
}

export const SubMenuLabel = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== 'isPrefixIcon' && prop !== 'isSuffixIcon',
})<SubMenuLabelProps>(({ theme, isPrefixIcon, isSuffixIcon }) => ({
  maxWidth: 'inherit',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginLeft: isPrefixIcon ? theme.spacing(1.5) : 'inherit',
  marginRight: isSuffixIcon ? theme.spacing(1.5) : 'inherit',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: isPrefixIcon ? 188 : 'inherit',
  },
}));
