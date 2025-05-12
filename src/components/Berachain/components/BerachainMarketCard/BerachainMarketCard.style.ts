import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const BerachainMarketCardTokenContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  '&:not(:first-of-type)': {
    marginLeft: theme.spacing(-1),
  },
}));
