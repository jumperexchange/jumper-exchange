import { WalletCardContainer } from '@/components/Menus';
import { TotalValue } from '@/components/Portfolio/Portfolio.styles';
import TotalBalanceSkeleton from '@/components/Portfolio/TotalBalance.Skeleton';
import { usePortfolioStore } from '@/stores/portfolio';
import InfoIcon from '@mui/icons-material/Info';
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from '@lifi/wallet-management';
import { arraysEqual } from '@/utils/getTokens/utils';
import { AnimatedCounter } from 'react-animated-counter';
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
}

function TotalBalance({
  isComplete = false,
  isFetching = false,
  refetch,
}: TotalBalanceProps) {
  const theme = useTheme();
  const [differenceValue, setDifferenceValue] = useState(0);
  const [differencePercent, setDifferencePercent] = useState(0);
  const { t } = useTranslation();
  const { accounts } = useAccount();
  const portfolio = usePortfolioStore((state) => state);
  const { totalValue } = portfolio.getFormattedCacheTokens(accounts);

  useMemo(() => {
    if (!isComplete) {
      return;
    }

    const addresses = accounts
      .filter((a) => !!a?.address)
      .map(({ address }) => address) as string[];

    if (addresses.length === 0) {
      return;
    }

    if (!arraysEqual(portfolio.lastAddresses ?? [], addresses)) {
      portfolio.setLast(totalValue, addresses);
      return;
    }

    if (portfolio.lastDate && !has24HoursPassed(portfolio.lastDate)) {
      return;
    }

    portfolio.setLast(totalValue, addresses);

    if (!portfolio.lastTotalValue) {
      return;
    }

    const differenceValue = totalValue - portfolio.lastTotalValue;
    const differencePercent =
      portfolio.lastTotalValue !== 0
        ? ((totalValue - portfolio.lastTotalValue) /
            Math.abs(portfolio.lastTotalValue)) *
          100
        : 0;

    setDifferenceValue(differenceValue);
    setDifferencePercent(differencePercent);
  }, [isComplete, accounts, portfolio, totalValue]);

  if (!isComplete && totalValue === 0) {
    return <TotalBalanceSkeleton />;
  }

  return (
    <WalletCardContainer disableGutters>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            fontWeight={500}
            fontSize={14}
            color={(theme) => theme.palette.text.primary}
          >
            {t('navbar.walletMenu.totalBalance')}
          </Typography>
          <Tooltip
            title={t('navbar.walletMenu.totalBalanceTooltip')}
            placement="top"
            enterTouchDelay={0}
            componentsProps={{
              popper: { sx: { zIndex: 2000 } },
            }}
            arrow
            sx={{
              zIndex: 25000,
            }}
          >
            <InfoIcon
              sx={{
                cursor: 'help',
                marginLeft: '8px',
                width: 16,
                height: 16,
                opacity: '0.5',
              }}
            />
          </Tooltip>
        </Box>
        <RefreshIcon
          updatedAt={new Date().getTime()}
          timeToUpdate={0}
          isLoading={!isComplete}
          onClick={() => refetch()}
        />
      </Box>
      <Stack spacing={1}>
        <TotalValue as="div">
          {portfolio.lastTotalValue && !isComplete ? (
            t('format.currency', { value: portfolio.lastTotalValue })
          ) : (
            <>
              $
              <AnimatedCounter
                value={totalValue}
                includeDecimals
                decimalPrecision={2}
                includeCommas
                incrementColor={theme.palette.text.primary}
                decrementColor={theme.palette.text.primary}
                color={theme.palette.text.primary}
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
    </WalletCardContainer>
  );
}

export default TotalBalance;
