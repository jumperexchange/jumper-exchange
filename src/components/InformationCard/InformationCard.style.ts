'use client';

import type { TableCellProps } from '@mui/material';
import { TableCell } from '@mui/material';
import type { BoxProps, Breakpoint } from '@mui/system';
import { styled } from '@mui/system';
import { SeoPageContainer } from '../SeoPageContainer.style';

interface InformationCardContainerProps extends BoxProps {
  fullWidth?: boolean;
}

export const InformationCardContainer = styled(SeoPageContainer, {
  shouldForwardProp: (prop) => prop !== 'fullWidth',
})<InformationCardContainerProps>(({ theme, fullWidth }) => ({
  [theme.breakpoints.up('md' as Breakpoint)]: {
    ...(!fullWidth && { maxWidth: 'calc(50% - 16px)' }),
  },
}));

interface InformationCardCellProps extends TableCellProps {
  fullWidth?: boolean;
}

export const InformationCardCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'fullWidth',
})<InformationCardCellProps>(({ theme, fullWidth }) => ({
  [theme.breakpoints.up('md' as Breakpoint)]: {
    width: fullWidth ? '160px' : '30%',
  },
}));
