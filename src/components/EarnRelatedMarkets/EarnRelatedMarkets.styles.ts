import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export const EarnRelatedMarketsContainer = styled(Stack)(({ theme }) => ({
  overflowX: 'auto',
  padding: theme.spacing(2, 1),
  margin: theme.spacing(-2, -1),
}));

export const EarnRelatedMarketWrapper = styled(Box)({
  flexShrink: 0,
  width: '328px',
});

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  transform: 'none',
  backgroundColor: (theme.vars || theme).palette.grey[100],
  borderRadius: theme.shape.buttonBorderRadius,
}));
