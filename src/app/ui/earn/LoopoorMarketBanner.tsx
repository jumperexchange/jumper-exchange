'use client';

import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import {
  HeroEarnCardContainer,
  HeroEarnCardContentContainer,
  HeroEarnCardFooterContainer,
  HeroEarnCardFooterContentContainer,
  HeroEarnCardHeaderContainer,
} from '@/components/Cards/HeroEarnCard/HeroEarnCard.styles';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { useLoopoorMarkets } from '@/hooks/loopoor/useLoopoorMarkets';
import { useLoopoorMaxLeverage } from '@/hooks/loopoor/useLoopoorMaxLeverage';
import { AppPaths } from 'src/const/urls';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const LOOPOOR_CHAIN_ID = 8453;

const BannerContainer = styled(HeroEarnCardContainer)(() => ({
  overflow: 'hidden',
  position: 'relative',
  minHeight: 'unset',
}));

const GlowAccent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '-60px',
  right: '-60px',
  width: 220,
  height: 220,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${(theme.vars || theme).palette.primary.main}28 0%, transparent 70%)`,
  pointerEvents: 'none',
}));

const LeverageBadge = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${(theme.vars || theme).palette.primary.main}, ${(theme.vars || theme).palette.secondary.main ?? (theme.vars || theme).palette.primary.dark})`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(0.5, 1.5),
  display: 'inline-flex',
  alignItems: 'center',
}));

const StatBox = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(0.25),
  minWidth: 80,
}));

const UtilizationBar = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 3,
  backgroundColor: (theme.vars || theme).palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 3,
    background: `linear-gradient(90deg, ${(theme.vars || theme).palette.primary.main}, ${(theme.vars || theme).palette.secondary.main ?? (theme.vars || theme).palette.primary.light})`,
  },
}));

function LeverageStat({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string;
  isLoading: boolean;
}) {
  return (
    <StatBox>
      <Typography variant="bodyXSmall" color="text.secondary" noWrap>
        {label}
      </Typography>
      {isLoading ? (
        <Skeleton width={48} height={20} />
      ) : (
        <Typography variant="bodySmallStrong" noWrap>
          {value}
        </Typography>
      )}
    </StatBox>
  );
}

interface LoopoorMarketBannerInnerProps {
  chainId: number;
  marketId: string;
  collateralSymbol: string;
  loanSymbol: string;
  collateralAddress: string;
  supplyApy: number;
  borrowApy: number;
  utilization: number;
  chainKey: string;
}

function LoopoorMarketBannerInner({
  chainId,
  marketId,
  collateralSymbol,
  loanSymbol,
  collateralAddress,
  supplyApy,
  borrowApy,
  utilization,
  chainKey,
}: LoopoorMarketBannerInnerProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: leverageData, isLoading: leverageLoading } =
    useLoopoorMaxLeverage({ chainId, marketId });

  const maxLeverage = leverageData?.maxLeverageFactor;
  const href = `${AppPaths.Earn}/borrow/${chainId}/${marketId}`;

  const fmtPct = (v: number) =>
    `${(v * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;

  const chain = { chainId, chainKey };
  const collateralEntity = {
    name: collateralSymbol,
    symbol: collateralSymbol,
    decimals: 18,
    address: collateralAddress,
    chain,
  };

  return (
    <BannerContainer>
      <GlowAccent />

      <HeroEarnCardHeaderContainer
        direction="row"
        sx={{ alignItems: 'center' }}
      >
        <Badge
          variant={BadgeVariant.Secondary}
          size={BadgeSize.SM}
          label={t('earn.borrow.bannerLabel', 'Leverage borrow')}
        />
        {leverageLoading ? (
          <Skeleton width={64} height={24} sx={{ borderRadius: 2 }} />
        ) : maxLeverage ? (
          <LeverageBadge>
            <Typography
              variant="bodyXSmallStrong"
              sx={{ color: '#fff', lineHeight: 1 }}
            >
              {t('earn.borrow.upToLeverage', 'up to {{x}}x', {
                x: maxLeverage.toFixed(1),
              })}
            </Typography>
          </LeverageBadge>
        ) : null}
      </HeroEarnCardHeaderContainer>

      <HeroEarnCardContentContainer>
        {t('earn.borrow.bannerHeadline', 'Amplify your position')}
      </HeroEarnCardContentContainer>

      <HeroEarnCardFooterContainer>
        <HeroEarnCardFooterContentContainer>
          <EntityStackWithBadge
            entities={[collateralEntity]}
            badgeEntities={[chain]}
            addressOverride={collateralAddress}
            size={AvatarSize.XXL}
            badgeSize={AvatarSize.SM}
            content={{ title: `${collateralSymbol} / ${loanSymbol}` }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push(href)}
            sx={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}
            endIcon={<ArrowForwardIcon />}
          >
            {t('earn.borrow.cta', 'Borrow now')}
          </Button>
        </HeroEarnCardFooterContentContainer>

        {/* column-reverse places this above the entity/button row */}
        <Stack
          direction="row"
          sx={{ gap: 3, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <LeverageStat
            label={t('earn.borrow.supplyApy', 'Supply APY')}
            value={fmtPct(supplyApy)}
            isLoading={false}
          />
          <LeverageStat
            label={t('earn.borrow.borrowApy', 'Borrow APY')}
            value={fmtPct(borrowApy)}
            isLoading={false}
          />
          <StatBox sx={{ minWidth: 100, flex: '1 1 auto' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="bodyXSmall" color="text.secondary">
                {t('earn.borrow.utilization', 'Utilization')}
              </Typography>
              <Typography variant="bodyXSmall" color="text.secondary">
                {fmtPct(utilization)}
              </Typography>
            </Stack>
            <UtilizationBar variant="determinate" value={utilization * 100} />
          </StatBox>
        </Stack>
      </HeroEarnCardFooterContainer>
    </BannerContainer>
  );
}

export function LoopoorMarketBanner() {
  const { data: markets, isLoading } = useLoopoorMarkets({
    chainId: LOOPOOR_CHAIN_ID,
  });

  if (isLoading) {
    return (
      <Skeleton
        variant="rounded"
        height={280}
        sx={{ borderRadius: (theme) => `${theme.shape.cardBorderRadius}px` }}
      />
    );
  }

  const market = markets?.[0];
  if (!market) {
    return null;
  }

  return (
    <LoopoorMarketBannerInner
      chainId={market.chainId}
      marketId={market.marketId}
      collateralSymbol={market.collateralToken.symbol}
      loanSymbol={market.loanToken.symbol}
      collateralAddress={market.collateralToken.address}
      supplyApy={market.state.supplyApy}
      borrowApy={market.state.borrowApy}
      utilization={market.state.utilization}
      chainKey={`base`}
    />
  );
}
