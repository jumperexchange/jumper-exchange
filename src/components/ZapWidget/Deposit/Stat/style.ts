import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const BeraChainProgressCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

export const BeraChainProgressCardContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const BerachainMarketCardTokenContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  '&:not(:first-of-type)': {
    marginLeft: theme.spacing(-1),
  },
}));
