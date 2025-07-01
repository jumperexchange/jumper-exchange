import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const MissionWidgetColumnContainer = styled(Box)(({ theme }) => ({
  maxWidth: theme.spacing(83),
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: 'auto',
  },
}));
