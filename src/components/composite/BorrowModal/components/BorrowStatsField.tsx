'use client';

import {
  ContentContainer,
  FieldWrapper,
} from '@/components/composite/JumperWidget/JumperWidget.style';
import type { AmountValue } from '@/components/composite/JumperWidget/components/Amount';
import { useWidgetStore } from '@/components/composite/JumperWidget/store';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { useLoopoorStats } from '@/hooks/loopoor/useLoopoorStats';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import type { Chain, LoopoorMarket } from '@/types/jumper-backend';
import type { BaseToken, PricedToken } from '@/types/tokens';
import { mergeSx } from '@/utils/theme/mergeSx';
import Box from '@mui/material/Box';
import MuiSkeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeverageContext } from '../context';

type StatStatus = 'success' | 'warning' | 'error' | 'default';

function getStatusColor(theme: Theme, status: StatStatus): string | undefined {
  switch (status) {
    case 'success':
      return (theme.vars || theme).palette.statusSuccessFg;
    case 'warning':
      return (theme.vars || theme).palette.statusWarningFg;
    case 'error':
      return (theme.vars || theme).palette.statusErrorFg;
    default:
      return undefined;
  }
}

function apyStatus(apy: number): StatStatus {
  return apy > 0 ? 'success' : 'error';
}

function ltvStatus(ltv: number, lltv: number): StatStatus {
  if (ltv === 0 || lltv === 0) {
    return 'default';
  }
  const ratio = ltv / lltv;
  if (ratio < 0.5) {
    return 'success';
  }
  if (ratio < 0.85) {
    return 'warning';
  }
  return 'error';
}

const StatsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

const StatItem = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  flex: 1,
}));

const STAT_LABELS = [
  'Your APY',
  'Deposit APY',
  'Borrow APY',
  'Yearly',
  'LTV / LLTV',
];

interface BorrowStatsFieldProps {
  market: LoopoorMarket;
}

export function BorrowStatsField({ market }: BorrowStatsFieldProps) {
  const { t } = useTranslation();
  const { debouncedLeverageFactor } = useLeverageContext();
  const { toDisplayAmount } = useTokenFormatters();

  const amountValue = useWidgetStore((s) => s.values['amount']) as
    | AmountValue
    | undefined;
  const rawAmountWei =
    amountValue?.amount && amountValue.amount !== '0'
      ? amountValue.amount
      : undefined;

  const [amountWei, setAmountWei] = useState(rawAmountWei);
  const debouncedSetAmountWei = useRef(
    debounce((v: string | undefined) => setAmountWei(v), 300),
  ).current;

  useEffect(() => {
    debouncedSetAmountWei(rawAmountWei);
    return () => debouncedSetAmountWei.cancel();
  }, [rawAmountWei, debouncedSetAmountWei]);

  const isEnabled = debouncedLeverageFactor > 1 && !!amountWei;

  const {
    data: stats,
    isLoading,
    isFetching,
  } = useLoopoorStats({
    chainId: market.chainId,
    marketId: market.marketId,
    leverageFactor: debouncedLeverageFactor,
    amount: amountWei,
  });

  const tokenEntity = useMemo(
    (): BaseToken => ({
      type: 'base',
      address: market.collateralToken.address,
      symbol: market.collateralToken.symbol,
      name: market.collateralToken.symbol,
      decimals: market.collateralToken.decimals,
      chainId: market.chainId,
    }),
    [market],
  );

  const chainEntity = useMemo(
    (): Chain => ({ chainId: market.chainId, chainKey: '' }),
    [market.chainId],
  );

  const yearlyDisplay = useMemo(() => {
    if (!stats?.yearlyYield) {
      return '—';
    }
    return toDisplayAmount(
      {
        amount: BigInt(stats.yearlyYield),
        token: { decimals: market.collateralToken.decimals } as PricedToken,
      },
      market.collateralToken.symbol,
      { maximumFractionDigits: 4 },
    );
  }, [stats?.yearlyYield, market, toDisplayAmount]);

  const effectiveCollateralDisplay = useMemo(() => {
    if (!stats?.effectiveCollateral) {
      return null;
    }
    return toDisplayAmount(
      {
        amount: BigInt(stats.effectiveCollateral),
        token: { decimals: market.collateralToken.decimals } as PricedToken,
      },
      market.collateralToken.symbol,
      { maximumFractionDigits: 4 },
    );
  }, [stats?.effectiveCollateral, market, toDisplayAmount]);

  if (!isEnabled && !stats) {
    return null;
  }

  const showSkeleton = isLoading && !stats;

  const netApy = stats?.netApy ?? 0;
  const depositApy = stats?.depositApy ?? 0;
  const borrowApy = stats?.borrowApy ?? 0;
  const ltv = stats?.ltv ?? 0;
  const lltv = stats?.lltv ?? 0;

  const statItems = [
    {
      label: 'Your APY',
      value: t('format.percent', { value: netApy }),
      status: apyStatus(netApy),
    },
    {
      label: 'Deposit APY',
      value: t('format.percent', { value: depositApy }),
      status: 'default' as StatStatus,
    },
    {
      label: 'Borrow APY',
      value: t('format.percent', { value: borrowApy }),
      status: 'default' as StatStatus,
    },
    {
      label: 'Yearly',
      value: yearlyDisplay,
      status: 'default' as StatStatus,
    },
    {
      label: 'LTV / LLTV',
      value: `${t('format.percent', { value: ltv })}/${t('format.percent', { value: lltv })}`,
      status: ltvStatus(ltv, lltv),
    },
  ];

  return (
    <ContentContainer sx={{ padding: 0, paddingBottom: 2 }}>
      <FieldWrapper
        sx={{
          background: (theme) => (theme.vars || theme).palette.accent2Alt,
          border: (theme) =>
            `1px solid ${(theme.vars || theme).palette.borderActive}`,
          gap: 3,
          opacity: isFetching && !showSkeleton ? 0.6 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        <Typography variant="bodySmallStrong">Leverage Breakdown</Typography>
        {showSkeleton ? (
          <StatsRow>
            {STAT_LABELS.map((label) => (
              <StatItem key={label}>
                <Typography
                  variant="bodyXSmall"
                  color="text.secondary"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {label}
                </Typography>
                <MuiSkeleton width={48} height={16} />
              </StatItem>
            ))}
          </StatsRow>
        ) : (
          <>
            {effectiveCollateralDisplay && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="bodyXSmallStrong">
                  Effective collateral
                </Typography>
                <EntityStackWithBadge
                  entities={[tokenEntity]}
                  badgeEntities={[chainEntity]}
                  addressOverride={market.collateralToken.address}
                  size={AvatarSize.XL}
                  content={{
                    title: effectiveCollateralDisplay,
                  }}
                />
              </Box>
            )}
            <StatsRow>
              {statItems.map(({ label, value, status }) => (
                <StatItem key={label}>
                  <Typography
                    variant="bodyXSmall"
                    color="text.secondary"
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="bodyXSmallStrong"
                    sx={mergeSx(
                      { whiteSpace: 'nowrap' },
                      status !== 'default'
                        ? { color: (theme) => getStatusColor(theme, status) }
                        : undefined,
                    )}
                  >
                    {value}
                  </Typography>
                </StatItem>
              ))}
            </StatsRow>
          </>
        )}
      </FieldWrapper>
    </ContentContainer>
  );
}
