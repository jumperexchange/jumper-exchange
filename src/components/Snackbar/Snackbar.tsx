import { Snackbar as MuiSnackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { useMenuStore } from 'src/stores';

export const Snackbar = () => {
  const [openSnackbar, onOpenSnackbar] = useMenuStore((state) => [
    state.openSnackbar,
    state.onOpenSnackbar,
  ]);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    onOpenSnackbar(false);
  };

  return (
    <MuiSnackbar
      open={openSnackbar.open}
      autoHideDuration={2000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MuiAlert elevation={6} variant="filled" severity={openSnackbar.severity}>
        {openSnackbar.label}
      </MuiAlert>
    </MuiSnackbar>
  );
};
