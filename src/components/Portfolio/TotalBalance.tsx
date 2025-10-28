import { WalletCardContainer } from '@/components/Menus';
import { TotalValue } from '@/components/Portfolio/Portfolio.styles';
import TotalBalanceSkeleton from 'src/components/Portfolio/TotalBalanceSkeleton';
import { usePortfolioStore } from '@/stores/portfolio';
import { useAccount } from '@lifi/wallet-management';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { AnimatedCounter } from 'react-animated-counter';
import { useTranslation } from 'react-i18next';
import RefreshIcon from './CircularProgress/RefreshIcon';

function has24HoursPassed(lastDate: number): boolean {
  const currentTime = Date.now();
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  return currentTime - lastDate >= twentyFourHoursInMilliseconds;
}

interface TotalBalanceProps {
  isComplete: boolean;
  isFetching: boolean;
  refetch: () => void;
  walletAddress: string;
}

function TotalBalance({
  isComplete = false,
  isFetching = false,
  refetch,
  walletAddress,
}: TotalBalanceProps) {
  const theme = useTheme();
  const [differenceValue, setDifferenceValue] = useState(0);
  const [differencePercent, setDifferencePercent] = useState(0);
  const { t } = useTranslation();
  const { accounts } = useAccount();
  const connectedAccount = accounts.find(
    (account) => account.address === walletAddress,
  );
  const portfolio = usePortfolioStore((state) => state);
  const { totalValue } = portfolio.getFormattedCacheTokens([connectedAccount!]);
  const lastTotalValue = portfolio.getLast(walletAddress).value;

  useMemo(() => {
    if (!isComplete) {
      return;
    }

    const lastDate = portfolio.getLast(walletAddress).date;

    if (lastDate && !has24HoursPassed(lastDate)) {
      return;
    }

    const now = Date.now();

    portfolio.setLast(walletAddress, totalValue, now);

    if (!portfolio.lastTotalValue) {
      return;
    }

    const lastTotalValue = portfolio.getLast(walletAddress).value;

    const differenceValue = totalValue - lastTotalValue;
    const differencePercent =
      lastTotalValue !== 0
        ? ((totalValue - lastTotalValue) / Math.abs(lastTotalValue)) * 100
        : 0;

    setDifferenceValue(differenceValue);
    setDifferencePercent(differencePercent);
  }, [isComplete, accounts, portfolio, totalValue]);

  if (!isComplete && totalValue === 0) {
    return <TotalBalanceSkeleton />;
  }

  return (
    <WalletCardContainer disableGutters>
      <Stack>
        <Typography variant="bodyXSmallStrong" color="textSecondary">
          {t('navbar.walletMenu.walletBalance')}
        </Typography>
        <TotalValue as="div">
          {lastTotalValue && !isComplete ? (
            t('format.currency', { value: lastTotalValue })
          ) : (
            <>
              $
              <AnimatedCounter
                value={totalValue}
                includeDecimals
                decimalPrecision={2}
                includeCommas
                incrementColor={(theme.vars || theme).palette.text.primary}
                decrementColor={(theme.vars || theme).palette.text.primary}
                color={(theme.vars || theme).palette.text.primary}
                containerStyles={{
                  display: 'inline-flex',
                  textAlign: 'center',
                }}
                digitStyles={{
                  textOverflow: 'inherit',
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                  lineHeight: 'inherit',
                }}
              />
            </>
          )}
        </TotalValue>
        {/*
        Todo: to add back later when we can review the time calculation
        <Stack direction="row" gap="0.5rem" justifyContent="space-between">
          {differenceValue !== 0 && (
            <Stack direction="row" spacing="4px">
              <VariationValue
                color={(theme) =>
                  theme.palette[differenceValue > 0 ? 'success' : 'error'].main
                }
              >
                {differenceValue > 0 ? (
                  <ArrowUpwardIcon fontSize="inherit" />
                ) : (
                  <ArrowDownwardIcon />
                )}
                {differencePercent?.toFixed(2)}% (since last sync)
              </VariationValue>
              <VariationValue color={(theme) => theme.palette.text.secondary}>
                • ${differenceValue?.toFixed(2)}
              </VariationValue>
            </Stack>
          )}
        </Stack> */}
      </Stack>
      <RefreshIcon
        updatedAt={new Date().getTime()}
        timeToUpdate={0}
        isLoading={!isComplete}
        onClick={() => refetch()}
      />
    </WalletCardContainer>
  );
}

export default TotalBalance;
