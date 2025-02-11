import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { alpha, darken, styled } from '@mui/material/styles';
export const BerachainMarketFilters = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

export const BerachainMarketFiltersButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  height: 48,
  color: theme.palette.text.primary, // alpha(theme.palette.text.primary, 0.48),
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

export const BerachainMarketBaffleFormControlLabel = styled(FormControlLabel)(
  ({ theme }) => ({
    display: 'flex',
    height: 48,
    color: theme.palette.text.primary,
    padding: theme.spacing(1.5),
    alignItems: 'center',
    gap: theme.spacing(1.5),
    borderRadius: '12px',
    border: '1px solid #554F4E',
    background: '#313131',
    transition: 'background-color 0.3s ease-in-out',
    margin: 0,
    '&:hover': {
      backgroundColor: darken('#313131', 0.16),
    },
  }),
);

export const BerachainMarketCards = styled(Grid)(({ theme }) => ({
  justifyItems: 'center',
  marginTop: theme.spacing(3),
}));

interface BerachainMarketFilterArrowProps {
  active: boolean;
}

export const BerachainMarketFilterArrow = styled(KeyboardArrowDownIcon, {
  shouldForwardProp: (prop) => prop !== 'active',
})<BerachainMarketFilterArrowProps>(({ active, theme }) => ({
  color: alpha(theme.palette.text.primary, 0.24),
  marginTop: theme.spacing(0.25),
  width: 24,
  height: 24,
  transition: 'transform 0.3s ease',
  transform: `rotate(${active ? '180deg' : '0deg'})`,
}));
