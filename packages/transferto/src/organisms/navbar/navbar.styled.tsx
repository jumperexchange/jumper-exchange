import { styled } from '@mui/material/styles';
import { AppBar, Link } from '@mui/material';
import { NotFoundError } from '@transferto/dashboard-old/src/types';

export const MenuBrand = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  margin: `auto ${theme.spacing(4)} auto ${theme.spacing(2)}`,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.brandPrimary.main,
  },
}));

export const NavBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.default,
  boxShadow: 'none',
  // color: theme.palette.text.primary,
}));
