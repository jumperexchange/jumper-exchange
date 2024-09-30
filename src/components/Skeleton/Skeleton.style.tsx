import { Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SkeletonWalletMenuButtonStyled = styled(Skeleton)(({ theme }) => ({
  fontSize: 24,
  minWidth: 25,
  marginRight: 1.1,
  marginLeft: 1.1,
}));
