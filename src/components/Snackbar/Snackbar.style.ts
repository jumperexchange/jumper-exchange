import { Snackbar as MuiMuiSnackbar } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SnackbarStyled = styled(MuiMuiSnackbar)(({ theme }) => ({
  zIndex: 9999,
  '.MuiAlert-message:first-letter': {
    textTransform: 'capitalize',
  },
}));
