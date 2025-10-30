import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const CircularBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  position: 'relative',
  placeItems: 'center',
}));
