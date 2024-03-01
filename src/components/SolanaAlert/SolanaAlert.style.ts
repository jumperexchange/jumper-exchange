import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';

import { styled } from '@mui/material/styles';
import { InfoMessageCard } from '../MessageCard';

export const SolanaAlertContainer = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  position: 'fixed',
  left: 0,
  padding: theme.spacing(1.5),
  bottom: 0,
  zIndex: 2,
}));

export const SolanaMessageCard = styled(InfoMessageCard)(({ theme }) => ({
  backgroundColor: '#EBF3FF', //todo: add to theme
  width: 384,
}));
