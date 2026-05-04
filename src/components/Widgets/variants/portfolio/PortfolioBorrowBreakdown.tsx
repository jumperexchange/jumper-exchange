'use client';

import { useLoopoorStats } from '@/hooks/loopoor/useLoopoorStats';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import {
  ContentContainer,
  FieldWrapper,
} from '@/components/composite/JumperWidget/JumperWidget.style';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import type { PricedToken } from '@/types/tokens';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { mergeSx } from '@/utils/theme/mergeSx';

export interface PortfolioBorrowBreakdownProps {
  leverageFactor: number;
  earnOpportunity: EarnOpportunityWithLatestAnalytics | null;
  marketId?: string;
  amountWei?: string;
}

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

export function PortfolioBorrowBreakdown({
  leverageFactor,
  earnOpportunity,
  marketId,
  amountWei,
}: PortfolioBorrowBreakdownProps) {
  const chainId = earnOpportunity?.asset.chain.chainId;

  const { data: stats } = useLoopoorStats({
    chainId,
    marketId,
    leverageFactor,
    amount: amountWei,
  });

  const { t } = useTranslation();
  const { toDisplayAmount } = useTokenFormatters();

  const netApyPercent = stats?.netApy ?? 0;
  const depositApyPercent = stats?.depositApy ?? 0;
  const borrowApyPercent = stats?.borrowApy ?? 0;
  const ltv = stats?.ltv ?? 0;
  const lltv = stats?.lltv ?? 0;

  const yearlyDisplay = useMemo(() => {
    if (!stats?.yearlyYield || !earnOpportunity?.lpToken) {
      return '—';
    }
    const { decimals, symbol } = earnOpportunity.lpToken;
    return toDisplayAmount(
      { amount: BigInt(stats.yearlyYield), token: { decimals } as PricedToken },
      symbol,
      { maximumFractionDigits: 4 },
    );
  }, [stats?.yearlyYield, earnOpportunity?.lpToken, toDisplayAmount]);

  const effectiveCollateralDisplay = useMemo(() => {
    if (!stats?.effectiveCollateral || !earnOpportunity?.lpToken) {
      return null;
    }
    const { decimals, symbol } = earnOpportunity.lpToken;
    return toDisplayAmount(
      {
        amount: BigInt(stats.effectiveCollateral),
        token: { decimals } as PricedToken,
      },
      symbol,
      { maximumFractionDigits: 4 },
    );
  }, [stats?.effectiveCollateral, earnOpportunity?.lpToken, toDisplayAmount]);

  const statItems = [
    {
      label: 'Your APY',
      value: t('format.percent', { value: netApyPercent }),
      status: apyStatus(netApyPercent),
    },
    {
      label: 'Deposit APY',
      value: t('format.percent', { value: depositApyPercent }),
      status: 'default' as StatStatus,
    },
    {
      label: 'Borrow APY',
      value: t('format.percent', { value: borrowApyPercent }),
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

  if (!stats) {
    return null;
  }

  return (
    <ContentContainer sx={{ padding: 0, paddingBottom: 2 }}>
      <FieldWrapper
        sx={{
          background: (theme) => (theme.vars || theme).palette.surface3.main,
          gap: 3,
        }}
      >
        <Typography variant="bodySmallStrong">Leverage Breakdown</Typography>

        {effectiveCollateralDisplay && earnOpportunity?.lpToken && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="bodyXSmallStrong">
              Effective collateral
            </Typography>
            <EntityStackWithBadge
              entities={[earnOpportunity.lpToken]}
              badgeEntities={[earnOpportunity.lpToken.chain]}
              addressOverride={earnOpportunity.lpToken.address}
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
      </FieldWrapper>
    </ContentContainer>
  );
}
