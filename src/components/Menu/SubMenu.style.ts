'use client';
import type { Breakpoint, TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';

import { styled } from '@mui/material/styles';
import type { ElementType } from 'react';

export interface SubMenuLabelProps extends Omit<TypographyProps, 'component'> {
  isPrefixIcon?: boolean;
  isSuffixIcon?: boolean;
  component?: ElementType;
}

export const SubMenuLabel = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== 'isPrefixIcon' && prop !== 'isSuffixIcon' && prop !== 'component',
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
