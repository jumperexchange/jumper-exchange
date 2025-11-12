import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledDrawerHeader = styled(Box)(({ theme }) => ({
  height: 40,
  position: 'relative',
}));

export const StyledDrawerContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  gap: theme.spacing(3),
}));
