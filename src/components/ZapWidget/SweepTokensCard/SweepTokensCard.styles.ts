import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const SweepTokensCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

interface SweepTokensCardTitleContainerProps {
  status: 'success' | 'error';
}

export const SweepTokensCardTitleContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<SweepTokensCardTitleContainerProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  variants: [
    {
      props: ({ status }) => status === 'success',
      style: {
        color: theme.palette.statusSuccess,
      },
    },
    {
      props: ({ status }) => status !== 'success',
      style: {
        color: theme.palette.statusError,
      },
    },
  ],
}));

export const SweepTokensCardContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export const SweepTokensContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const SweepTokenContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const SweepTokenAmountContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'end',
  gap: theme.spacing(0.25),
}));
