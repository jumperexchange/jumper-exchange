import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ProgressContainer = styled(Box)(({ theme }) => ({
  width: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));
