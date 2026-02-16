import Box, { type BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { ProcessingTransactionCardStatus } from './types';

interface ProcessingTransactionCardContainerProps extends BoxProps {
  status: ProcessingTransactionCardStatus;
}

export const ProcessingTransactionCardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<ProcessingTransactionCardContainerProps>(({ theme, onClick }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.cardBorderRadiusMedium,
  boxShadow: theme.shadows[2],
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  cursor: onClick ? 'pointer' : 'default',
  variants: [
    {
      props: ({ status }) => status === 'pending',
      style: {
        backgroundColor: (theme.vars || theme).palette.surface1ActiveAccent,
      },
    },
    {
      props: ({ status }) => status === 'success',
      style: {
        backgroundColor: (theme.vars || theme).palette.statusSuccessBg,
      },
    },
    {
      props: ({ status }) => status === 'failed',
      style: {
        backgroundColor: (theme.vars || theme).palette.statusErrorBg,
      },
    },
  ],
}));
