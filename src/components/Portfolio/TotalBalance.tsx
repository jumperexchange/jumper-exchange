import { WalletCardContainer } from '@/components/Menus';
import {
  CircularProgressPending,
  TotalValue,
  VariationValue,
} from '@/components/Portfolio/Portfolio.styles';
import TotalBalanceSkeleton from '@/components/Portfolio/TotalBalance.Skeleton';
import TotalBalanceIconButton from '@/components/Portfolio/TotalBalanceIconButton';
import { usePortfolioStore } from '@/stores/portfolio';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import InfoIcon from '@mui/icons-material/Info';
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCircleIcon } from './RefreshCircleIcon';
import { useAccount } from '@lifi/wallet-management';
import { currencyFormatter } from '@/utils/formatNumbers';
import { arraysEqual } from '@/utils/getTokens';
import { AnimatedCounter } from 'react-animated-counter';

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

  useEffect(() => {
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
  }, [totalValue, isComplete]);

  if (!totalValue) {
    return <TotalBalanceSkeleton />;
  }

  return (
    <WalletCardContainer>
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
        {!isComplete ? (
          <span>
            <TotalBalanceIconButton disabled={true} tooltipText="hello world">
              <CircularProgressPending size={24} />
            </TotalBalanceIconButton>
          </span>
        ) : (
          <TotalBalanceIconButton
            tooltipText="Click here to restart the indexing of your tokens now."
            refetch={refetch}
          >
            <RefreshCircleIcon />
          </TotalBalanceIconButton>
        )}
      </Box>
      <Stack spacing={1}>
        <TotalValue as="div">
          {portfolio.lastTotalValue && !isComplete ? (
            currencyFormatter('en').format(portfolio.lastTotalValue)
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
        </Stack>
      </Stack>
    </WalletCardContainer>
  );
}

export default TotalBalance;
