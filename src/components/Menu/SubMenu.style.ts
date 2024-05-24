'use client';
import type { Breakpoint, TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';

import { styled } from '@mui/material/styles';
import type { ElementType } from 'react';

export interface SubMenuLabelProps extends Omit<TypographyProps, 'component'> {
  prefixIcon?: boolean;
  suffixIcon?: boolean;
  component?: ElementType;
}

export const SubMenuLabel = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== 'prefixIcon' && prop !== 'suffixIcon' && prop !== 'component',
})<SubMenuLabelProps>(({ theme, prefixIcon, suffixIcon }) => ({
  maxWidth: 'inherit',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginLeft: prefixIcon ? theme.spacing(1.5) : 'inherit',
  marginRight: suffixIcon ? theme.spacing(1.5) : 'inherit',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: prefixIcon ? 188 : 'inherit',
  },
}));
