import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import type { SyntheticEvent } from 'react';
import { SupportModal } from 'src/components';
import { useMenuStore } from 'src/stores';
import { MainMenu, WalletMenu, WalletSelectMenu } from '.';
export const Menus = () => {
  const [anchorRef, openSnackbar, onOpenSnackbar] = useMenuStore((state) => [
    state.anchorRef,
    state.openSnackbar,
    state.onOpenSnackbar,
  ]);
  const handleClose = (event: Event | SyntheticEvent) => {
    event.preventDefault();
    if (anchorRef.contains(event.target as HTMLElement)) {
      return;
    }
  };

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
    <>
      <MainMenu handleClose={handleClose} />
      <WalletMenu handleClose={handleClose} />
      <WalletSelectMenu handleClose={handleClose} />
      <SupportModal />
      <Snackbar
        open={openSnackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={openSnackbar.severity}
        >
          {openSnackbar.label}
        </MuiAlert>
      </Snackbar>
    </>
  );
};
