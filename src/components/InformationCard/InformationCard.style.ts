'use client';

import type { BoxProps, Breakpoint, TableCellProps } from '@mui/material';
import { styled, TableCell } from '@mui/material';
import { DynamicPagesContainer } from '../DynamicPagesContainer';

interface InformationCardContainerProps extends BoxProps {
  fullWidth?: boolean;
}

export const InformationCardContainer = styled(DynamicPagesContainer, {
  shouldForwardProp: (prop) => prop !== 'fullWidth',
})<InformationCardContainerProps>(({ theme }) => ({
  [theme.breakpoints.up('md' as Breakpoint)]: {},
  variants: [
    {
      props: ({ fullWidth }) => !fullWidth,
      style: {
        [theme.breakpoints.up('md' as Breakpoint)]: {
          maxWidth: 'calc(50% - 16px)',
        },
      },
    },
  ],
}));

interface InformationCardCellProps extends TableCellProps {
  fullWidth?: boolean;
}

export const InformationCardCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'fullWidth',
})<InformationCardCellProps>(({ theme }) => ({
  '.MuiLink-root': {
    color: (theme.vars || theme).palette.text.primary,
  },
  borderBottom: `1px solid ${(theme.vars || theme).palette.alphaLight300.main}`,
  ...theme.applyStyles('light', {
    borderBottom: `1px solid ${(theme.vars || theme).palette.alphaDark300.main}`,
  }),
  [theme.breakpoints.up('md' as Breakpoint)]: {
    width: '30%',
  },
  variants: [
    {
      props: ({ fullWidth }) => fullWidth,
      style: {
        [theme.breakpoints.up('md' as Breakpoint)]: {
          width: '160px',
        },
      },
    },
  ],
}));
