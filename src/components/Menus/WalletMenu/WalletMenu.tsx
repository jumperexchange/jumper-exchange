import { useMenuStore } from '@/stores/menu';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import {
  alpha,
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
import { WalletCard } from './WalletCard';
import CloseIcon from '@mui/icons-material/Close';
import dynamic from 'next/dynamic';
import PortfolioSkeleton from '@/components/Portfolio/PortfolioSkeleton';

const Portfolio = dynamic(
  () => import('@/components/Portfolio/Portfolio').then((s) => s.Portfolio),
  {
    loading: () => <PortfolioSkeleton />,
    ssr: false,
  },
);

export const WalletMenu = () => {
  const { t } = useTranslation();
  const theme = useTheme();

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
      {accounts.map(
        (account) =>
          account.isConnected && (
            <WalletCard key={account.address} account={account} />
          ),
      )}
      <Portfolio />
    </CustomDrawer>
  );
};
