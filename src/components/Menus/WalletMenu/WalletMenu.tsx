import { useMenuStore } from '@/stores/menu';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import {
  alpha,
  Box,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useEffect } from 'react';
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
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const { accounts } = useAccount();
  const { openWalletMenu } = useWalletMenu();

  const {
    openWalletMenu: _openWalletMenu,
    setWalletMenuState,
    setSnackbarState,
  } = useMenuStore((state) => state);

  const handleOpenWalletMenu: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    event.stopPropagation();
    setWalletMenuState(false);
    openWalletMenu();
  };

  useEffect(() => {
    _openWalletMenu! && setSnackbarState(false);
  }, [setSnackbarState, _openWalletMenu]);

  useEffect(() => {
    if (
      _openWalletMenu &&
      accounts.every((account) => account.status === 'disconnected')
    ) {
      setWalletMenuState(false);
    }
  }, [accounts, setWalletMenuState, _openWalletMenu]);

  return (
    <CustomDrawer
      open={_openWalletMenu}
      anchor="right"
      onClose={() => {
        setWalletMenuState(false);
      }}
      // slotProps={{ backdrop: { invisible: true } }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          position: 'sticky',
          top: 0,
          backdropFilter: 'blur(12px)',
          zIndex: 5000,
          paddingX: '1.25rem',
          paddingTop: '1.25rem',
        }}
      >
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
        <WalletButton sx={{ width: 'auto' }} onClick={handleOpenWalletMenu}>
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
      <Box sx={{ paddingX: '1.25rem' }}>
        {accounts.map(
          (account) =>
            account.isConnected && (
              <WalletCardV2 key={account.address} account={account} />
            ),
        )}
      </Box>
      <Portfolio />
    </CustomDrawer>
  );
};
