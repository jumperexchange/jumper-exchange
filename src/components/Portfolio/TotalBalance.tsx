import { WalletCardContainer } from '@/components/Menus';
import {
  alpha,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  TotalValue,
  VariationValue,
} from '@/components/Portfolio/Portfolio.styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { useAccounts } from '@/hooks/useAccounts';
import { usePortfolioStore } from '@/stores/portfolio';
import TotalBalanceSkeleton from '@/components/Portfolio/TotalBalance.Skeleton';

function has24HoursPassed(lastDate: number): boolean {
  const currentTime = Date.now();
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  return currentTime - lastDate >= twentyFourHoursInMilliseconds;
}

interface TotalBalanceProps {
  refetch: () => void;
  totalValue: number;
}

function TotalBalance({ refetch, totalValue }: TotalBalanceProps) {
  const [differenceValue, setDifferenceValue] = useState(0);
  const [differencePercent, setDifferencePercent] = useState(0);
  const { t } = useTranslation();
  const { accounts } = useAccounts();
  const portfolio = usePortfolioStore((state) => state);

  useEffect(() => {
    const addresses = accounts.map(({ address }) => address!);

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
      <Stack spacing={1}>
        <Typography
          fontWeight={500}
          fontSize={12}
          color={(theme) => theme.palette.text.primary}
        >
          <Tooltip title={t('navbar.walletMenu.refreshBalances')}>
            <IconButton
              size="small"
              aria-label="Refresh"
              sx={(theme) => ({
                color: theme.palette.text.primary,
                backgroundColor: alpha(theme.palette.text.primary, 0.04),
                marginRight: 1,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.text.primary, 0.08),
                },
              })}
              onClick={() => {
                refetch();
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {t('navbar.walletMenu.totalBalance')}
        </Typography>
        <TotalValue>${totalValue.toFixed(2)}</TotalValue>
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
                {differencePercent?.toFixed(2)}%
              </VariationValue>
              <VariationValue
                color={(theme) => theme.palette.alphaDark700.main}
              >
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
