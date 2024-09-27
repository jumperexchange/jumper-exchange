import { useAccounts } from '@/hooks/useAccounts';
import { useMenuStore } from '@/stores/menu';
import {
  alpha,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomDrawer, WalletButton } from '.';
import { WalletCardV2 } from './WalletCardV2';
import Portfolio from '@/components/Portfolio/Portfolio';
import CloseIcon from '@mui/icons-material/Close';

interface WalletMenuProps {
  anchorEl?: HTMLAnchorElement;
}

export const WalletMenu = ({ anchorEl }: WalletMenuProps) => {
  const { t } = useTranslation();
  const { accounts } = useAccounts();
  const theme = useTheme();
  const [, setOpen] = useState(false);
  const {
    openWalletMenu,
    setWalletMenuState,
    setSnackbarState,
    setWalletSelectMenuState,
  } = useMenuStore((state) => state);

  useEffect(() => {
    openWalletMenu! && setSnackbarState(false);
  }, [setSnackbarState, openWalletMenu]);

  useEffect(() => {
    if (
      openWalletMenu &&
      accounts.every((account) => account.status === 'disconnected')
    ) {
      setWalletMenuState(false);
    }
  }, [accounts, setWalletMenuState, openWalletMenu]);

  return (
    <CustomDrawer
      variant="persistent"
      anchor="right"
      open={openWalletMenu}
      onClose={() => {
        setWalletMenuState(false);
        setOpen(false);
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <IconButton
          aria-label="close"
          onClick={() => setWalletMenuState(false)}
          sx={{
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.text.primary, 0.04),
            },
          }}
          color="primary"
        >
          <CloseIcon />
        </IconButton>
        <WalletButton
          sx={{ width: 'auto' }}
          onClick={() => {
            setWalletSelectMenuState(true, false);
          }}
        >
          <Typography
            sx={{
              color: theme.palette.text.primary,
            }}
            variant="bodySmallStrong"
          >
            {t('navbar.walletMenu.connectAnotherWallet')}
          </Typography>
        </WalletButton>
      </Stack>
      {accounts.map(
        (account) =>
          account.isConnected && (
            <WalletCardV2 key={account.address} account={account} />
          ),
      )}
      <Portfolio />
    </CustomDrawer>
  );
};
