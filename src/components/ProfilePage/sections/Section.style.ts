import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const SectionContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: theme.spacing(4),
  flexDirection: 'column',
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
  },
}));
