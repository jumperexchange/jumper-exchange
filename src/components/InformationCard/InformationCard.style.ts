'use client';

import type { BoxProps, Breakpoint, TableCellProps } from '@mui/material';
import { alpha, styled, TableCell } from '@mui/material';
import { DynamicPagesContainer } from '../DynamicPagesContainer';

interface InformationCardContainerProps extends BoxProps {
  fullWidth?: boolean;
}

export const InformationCardContainer = styled(DynamicPagesContainer)<InformationCardContainerProps>(({
  theme
}) => ({
  [theme.breakpoints.up('md' as Breakpoint)]: {},
  variants: [{
    props: (
      {
        fullWidth
      }
    ) => !fullWidth,
    style: {
      [theme.breakpoints.up('md' as Breakpoint)]: { maxWidth: 'calc(50% - 16px)' }
    }
  }]
}));

interface InformationCardCellProps extends TableCellProps {
  fullWidth?: boolean;
}

export const InformationCardCell = styled(TableCell)<InformationCardCellProps>(({
  theme
}) => ({
  borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
  [theme.breakpoints.up('md' as Breakpoint)]: {
    width: '30%',
  },
  variants: [{
    props: (
      {
        fullWidth
      }
    ) => fullWidth,
    style: {
      [theme.breakpoints.up('md' as Breakpoint)]: {
        width: '160px'
      }
    }
  }]
}));
