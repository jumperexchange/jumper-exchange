import { useMenuStore } from '@/stores/menu';
import { useAccount, useWalletMenu } from '@jumperexchange/wallet-management';
import CloseIcon from '@mui/icons-material/Close';
import { alpha, IconButton, Stack, Typography, useTheme } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { WalletButton, CustomDrawer } from './WalletMenu.style';
import { WalletBalanceCard } from 'src/components/composite/WalletBalanceCard/WalletBalanceCard';
import { usePortfolioTracking } from '@/hooks/userTracking/usePortfolioTracking';
import {
  usePortfolioBalances,
  usePortfolioState,
  usePortfolioSummary,
} from '@/providers/PortfolioProvider/PortfolioContext';

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
  const { balances, balancesByAddress } = usePortfolioBalances();
  const { totalBalancesUsd } = usePortfolioSummary();
  const { isInitialLoading, isRefreshing, isStale, refreshByAddress, sources } =
    usePortfolioState();
  const { trackPortfolioMenuOverviewEvent } = usePortfolioTracking();
  const hasTrackedPortfolioOverview = useRef(false);

  const shouldTrackOverview = !isInitialLoading && !isRefreshing && !isStale;

  useEffect(() => {
    if (hasTrackedPortfolioOverview.current || !shouldTrackOverview) {
      return;
    }

    hasTrackedPortfolioOverview.current = true;
    trackPortfolioMenuOverviewEvent(totalBalancesUsd, balances);
  }, [
    shouldTrackOverview,
    balances,
    totalBalancesUsd,
    trackPortfolioMenuOverviewEvent,
  ]);

  useEffect(() => {
    hasTrackedPortfolioOverview.current = false;
  }, [accounts]);

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
      data-testid="wallet-drawer"
      open={_openWalletMenu}
      anchor="right"
      onClose={() => {
        setWalletMenuState(false);
      }}
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(8px)' } } }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
        }}
      >
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
      {accounts.map((account) => {
        const walletAddress = account.address;
        if (!walletAddress) {
          return null;
        }
        const balanceByAddress = balancesByAddress[walletAddress];
        const balanceStateByAddress =
          sources.balancesByAddress[walletAddress] ?? {};

        return (
          <WalletBalanceCard
            key={walletAddress}
            data-testid="wallet-balance-card"
            walletAddress={walletAddress}
            refetch={() => refreshByAddress(walletAddress)}
            isFetching={
              balanceStateByAddress.isLoading ||
              balanceStateByAddress.isRefreshing
            }
            isSuccess={balanceStateByAddress.isSuccess}
            updatedAt={balanceStateByAddress.updatedAt ?? Date.now()}
            data={balanceByAddress ?? {}}
            error={balanceStateByAddress.error}
          />
        );
      })}
    </CustomDrawer>
  );
};
