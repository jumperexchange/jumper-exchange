import { MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

export const OrderMenuItemContainer = styled(MenuItem)(({ theme }) => ({
  height: 40,
  borderRadius: theme.shape.radius12,
  padding: theme.spacing(1, 1.5),
  '&:hover, &:focus, &:active, &.Mui-selected': {
    backgroundColor: (theme.vars || theme).palette.alpha100.main,
  },
}));
