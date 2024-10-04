import { WalletCardContainer } from '@/components/Menus';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import {
  CircularProgressPending,
  TotalValue,
  VariationValue,
} from '@/components/Portfolio/Portfolio.styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTranslation } from 'react-i18next';
import { currencyFormatter } from '@/utils/formatNumbers';
import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { useAccounts } from '@/hooks/useAccounts';
import { usePortfolioStore } from '@/stores/portfolio';
import TotalBalanceSkeleton from '@/components/Portfolio/TotalBalance.Skeleton';
import { useParams } from 'next/navigation';
import TotalBalanceIconButton from '@/components/Portfolio/TotalBalanceIconButton';
import InfoIcon from '@mui/icons-material/Info';

function has24HoursPassed(lastDate: number): boolean {
  const currentTime = Date.now();
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  return currentTime - lastDate >= twentyFourHoursInMilliseconds;
}

interface TotalBalanceProps {
  totalValue: number;
  isComplete: boolean;
}

function TotalBalance({ isComplete = false, totalValue }: TotalBalanceProps) {
  const { lng } = useParams();
  const [differenceValue, setDifferenceValue] = useState(0);
  const [differencePercent, setDifferencePercent] = useState(0);
  const { t } = useTranslation();
  const { accounts } = useAccounts();
  const portfolio = usePortfolioStore((state) => state);

  useEffect(() => {
    const addresses = accounts
      .filter((a) => !!a?.address)
      .map(({ address }) => address) as string[];

    if (addresses.length === 0) {
      return;
    }

    if (!portfolio.lastDate) {
      portfolio.setLast(totalValue, addresses);
    }

    if (!isEqual(portfolio.lastAddresses, addresses)) {
      portfolio.setLast(totalValue, addresses);
      return;
    }

    if (has24HoursPassed(portfolio.lastDate)) {
      portfolio.setLast(totalValue, addresses);
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
  }, [totalValue]);

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
            title="hello world"
            placement="top"
            enterTouchDelay={0}
            arrow
            sx={{
              zIndex: 5000,
            }}
          >
            <InfoIcon
              sx={{
                marginLeft: '8px',
                width: 16,
                height: 16,
                opacity: '0.5',
              }}
            />
          </Tooltip>
        </Box>
        {!isComplete && (
          <Tooltip
            title={t('hello' as any)}
            placement="top"
            enterTouchDelay={0}
            arrow
            // title={t('navbar.walletMenu.refreshBalances')}
          >
            <TotalBalanceIconButton refetch={() => {}}>
              <CircularProgressPending size={24} />
            </TotalBalanceIconButton>
          </Tooltip>
        )}
      </Box>
      <Stack spacing={1}>
        <TotalValue>{currencyFormatter('en').format(totalValue)}</TotalValue>
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
                {differencePercent?.toFixed(2)}% (1d)
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
