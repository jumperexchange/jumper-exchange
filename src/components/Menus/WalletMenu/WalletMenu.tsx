import { useMenuStore } from '@/stores/menu';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import CloseIcon from '@mui/icons-material/Close';
import { alpha, IconButton, Stack, Typography, useTheme } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WalletButton, CustomDrawer } from './WalletMenu.style';
import { usePortfolioTokens } from 'src/utils/getTokens/usePortfolioTokens';
import { WalletBalanceCard } from 'src/components/composite/WalletBalanceCard/WalletBalanceCard';

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
  const { queriesByAddress } = usePortfolioTokens();

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
      <Stack direction="row" justifyContent="space-between">
        <IconButton
          aria-label="close"
          onClick={() => setWalletMenuState(false)}
          sx={{
            color: (theme.vars || theme).palette.text.primary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.text.primary, 0.04),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <WalletButton
          id="connect-another-wallet-button"
          sx={{ width: 'auto' }}
          onClick={handleOpenWalletMenu}
        >
          <Typography
            sx={{
              color: (theme.vars || theme).palette.text.primary,
            }}
            variant="bodySmallStrong"
          >
            {t('navbar.walletMenu.connectAnotherWallet')}
          </Typography>
        </WalletButton>
      </Stack>
      {Array.from(queriesByAddress.entries()).map(
        ([walletAddress, account]) => (
          <WalletBalanceCard
            key={walletAddress}
            walletAddress={walletAddress}
            refetch={account.refetch}
            isFetching={account.isFetching}
            isSuccess={account.isSuccess}
            data={account.data ?? []}
          />
        ),
      )}
    </CustomDrawer>
  );
};
