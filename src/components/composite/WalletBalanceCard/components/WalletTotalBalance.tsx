import type { Account } from '@lifi/wallet-management';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { AnimatedCounter } from 'react-animated-counter';
import {
  WalletBalanceSharedContainer,
  WalletTotalBalanceValue,
} from '../WalletBalanceCard.styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import WalletTotalBalanceSkeleton from './WalletTotalBalanceSkeleton';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { usePortfolioStore } from 'src/stores/portfolio';
import RefreshBalance from './RefreshBalance';
import { toCompactValue } from 'src/utils/formatNumbers';
import { getPortfolioValueInDollarParts } from '@/utils/numbers/portfolioValueInDollar';

const sharedStackProps = {
  direction: 'row',
  alignItems: 'center',
  useFlexGap: true,
} as const;

interface WalletTotalBalanceProps extends PropsWithChildren {
  isComplete: boolean;
  isFetching: boolean;
  refetch: () => void;
  account: Account;
}

export const WalletTotalBalance: FC<WalletTotalBalanceProps> = ({
  isComplete,
  isFetching,
  refetch,
  account,
  children,
}) => {
  const theme = useTheme();
  const walletAddress = account.address!;
  const [differenceValue, setDifferenceValue] = useState(0);
  const [differencePercent, setDifferencePercent] = useState(0);
  const { t } = useTranslation();
  const { lastTotalValue, lastDate, totalValue } = usePortfolioStore(
    (state) => {
      const lastTotalValue = state.lastTotalValue?.get(walletAddress) ?? 0;
      const lastDate = state.lastDate?.get(walletAddress) ?? 0;
      const { totalValue } = state.getFormattedCacheTokens([account]);
      return { lastTotalValue, lastDate, totalValue };
    },
  );

  // Compute difference between current and last balance
  useEffect(() => {
    if (!totalValue || !lastTotalValue) {
      return;
    }

    const difference = totalValue - lastTotalValue;
    const percentDifference =
      lastTotalValue !== 0 ? (difference / Math.abs(lastTotalValue)) * 100 : 0;

    setDifferenceValue(difference);
    setDifferencePercent(percentDifference);
  }, [totalValue, lastTotalValue]);

  if (!isComplete && totalValue === 0) {
    return <WalletTotalBalanceSkeleton />;
  }

  const { prefix, suffix, formattedValue, numericValue } =
    getPortfolioValueInDollarParts(totalValue);

  return (
    <WalletBalanceSharedContainer disableGutters>
      <Stack sx={{ width: '100%' }}>
        <Typography variant="bodyXSmallStrong" color="textSecondary">
          {t('navbar.walletMenu.walletBalance')}
        </Typography>
        <Stack {...sharedStackProps} gap={2} justifyContent="space-between">
          <Stack {...sharedStackProps} gap={1}>
            <WalletTotalBalanceValue as="div">
              {lastTotalValue && isComplete ? (
                formattedValue
              ) : (
                <>
                  {prefix}
                  <AnimatedCounter
                    value={Number(numericValue)}
                    fontSize={theme.typography.titleLarge.fontSize?.toString()}
                    includeDecimals
                    decimalPrecision={suffix ? 1 : 2}
                    includeCommas={!suffix}
                    incrementColor={(theme.vars || theme).palette.text.primary}
                    decrementColor={(theme.vars || theme).palette.text.primary}
                    color={(theme.vars || theme).palette.text.primary}
                    containerStyles={{
                      display: 'inline-flex',
                      textAlign: 'center',
                    }}
                    digitStyles={{
                      textOverflow: 'inherit',
                    }}
                  />
                  {suffix}
                </>
              )}
            </WalletTotalBalanceValue>
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
            <RefreshBalance
              updatedAt={lastDate}
              timeToUpdate={0}
              isLoading={!isComplete}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                refetch();
              }}
            />
          </Stack>
          {children}
        </Stack>
      </Stack>
    </WalletBalanceSharedContainer>
  );
};
