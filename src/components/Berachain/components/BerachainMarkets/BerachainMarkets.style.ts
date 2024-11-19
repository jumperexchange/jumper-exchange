import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Grid } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { darken, styled } from '@mui/material/styles';
import { rotateAnimation } from 'src/components/AccordionFAQ';

export const BerachainMarketFilters = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

export const BerachainMarketFiltersButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  height: 40,
  color: theme.palette.text.primary,
  padding: theme.spacing(1.5),
  alignItems: 'center',
  gap: theme.spacing(1.5),
  borderRadius: '12px',
  border: '1px solid #554F4E',
  background: '#313131',
  transition: 'background-color 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: darken('#313131', 0.16),
  },
}));

export const BerachainMarketCards = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  justifyItems: 'center',
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
  [theme.breakpoints.up('md' as Breakpoint)]: {
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(4),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
}));

interface BerachainMarketFilterArrowProps {
  active: boolean;
}

export const BerachainMarketFilterArrow = styled(ArrowForwardIosIcon, {
  shouldForwardProp: (prop) => prop !== 'active',
})<BerachainMarketFilterArrowProps>(({ active }) => ({
  width: 24,
  height: 24,
  transition: 'transform 0.3s ease',
  transform: active ? 'rotate(90deg)' : 'rotate(270deg)',
  animation: `${active ? rotateAnimation : 'none'} 300ms ease-in-out`,
}));
