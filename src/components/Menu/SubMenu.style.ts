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
    prop !== 'isPrefixIcon' && prop !== 'isSuffixIcon' && prop !== 'component',
})<SubMenuLabelProps>(({ theme }) => ({
  maxWidth: 'inherit',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginLeft: 'inherit',
  marginRight: 'inherit',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: 'inherit',
  },
  variants: [
    {
      props: ({ isPrefixIcon }) => isPrefixIcon,
      style: {
        marginLeft: theme.spacing(1.5),
      },
    },
    {
      props: ({ isSuffixIcon }) => isSuffixIcon,
      style: {
        marginRight: theme.spacing(1.5),
      },
    },
    {
      props: ({ isPrefixIcon }) => isPrefixIcon,
      style: {
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          maxWidth: 188,
        },
      },
    },
  ],
}));
