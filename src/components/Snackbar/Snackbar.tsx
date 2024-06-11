'use client';
import MuiAlert from '@mui/material/Alert';

import { useMenuStore } from '@/stores/menu';
import { SnackbarStyled } from './Snackbar.style';

export const Snackbar = () => {
  const [openSnackbar, setSnackbarState] = useMenuStore((state) => [
    state.openSnackbar,
    state.setSnackbarState,
  ]);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarState(false);
  };

  return (
    <SnackbarStyled
      open={openSnackbar.open}
      autoHideDuration={2000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MuiAlert elevation={6} variant="filled" severity={openSnackbar.severity}>
        {openSnackbar.label}
      </MuiAlert>
    </SnackbarStyled>
  );
};
