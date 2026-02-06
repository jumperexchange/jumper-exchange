import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const PercentagesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: theme.zIndex.drawer,
}));
