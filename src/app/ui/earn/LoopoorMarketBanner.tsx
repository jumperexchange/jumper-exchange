'use client';

import { useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useLoopoorMarkets } from '@/hooks/loopoor/useLoopoorMarkets';
import { useLoopoorMaxLeverage } from '@/hooks/loopoor/useLoopoorMaxLeverage';
import { useChains } from '@/hooks/useChains';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { Badge } from '@/components/Badge/Badge';
import {
  BadgeSize,
  BadgeVariant,
  BaseSkeleton,
} from '@/components/Badge/Badge.styles';
import { AppPaths } from 'src/const/urls';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import BoltIcon from '@mui/icons-material/Bolt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

const LOOPOOR_CHAIN_ID = 8453;
const LOOPOOR_CHAIN_KEY_FALLBACK = 'base';

const ORB = {
  violet: '160, 40, 220',
  orchid: '200, 80, 210',
  blue: '80, 100, 230',
  magenta: '210, 50, 200',
  azure: '100, 130, 250',
  cursor: '190, 70, 235',
} as const;

// Each orb wanders an irregular path. repeatType:'mirror' reverses smoothly so there's no jump at loop boundaries.
// x/y % values map to CSS translateX/Y — percentages are relative to the element's own size.
const ORB_CONFIGS = [
  {
    color: ORB.violet,
    alpha: 0.45,
    left: '5%',
    x: ['0%', '14%', '-6%', '-22%', '8%'],
    y: ['-30%', '10%', '40%', '2%', '-44%'],
    scale: [1, 1.14, 0.92, 1.1, 1],
    opacity: [0.45, 0.62, 0.4, 0.58, 0.45],
    duration: 22,
    delay: 0,
  },
  {
    color: ORB.blue,
    alpha: 0.4,
    left: '20%',
    x: ['0%', '26%', '8%', '-18%', '0%'],
    y: ['0%', '-40%', '-54%', '-28%', '0%'],
    scale: [1, 1.2, 0.84, 1.12, 1],
    opacity: [0.4, 0.56, 0.34, 0.52, 0.4],
    duration: 17,
    delay: 3.2,
  },
  {
    color: ORB.orchid,
    alpha: 0.4,
    left: '35%',
    x: ['0%', '-14%', '20%', '-8%', '0%'],
    y: ['0%', '-34%', '-16%', '-52%', '0%'],
    scale: [1, 1.08, 1.32, 0.9, 1],
    opacity: [0.4, 0.5, 0.46, 0.6, 0.4],
    duration: 27,
    delay: 6.8,
  },
  {
    color: ORB.magenta,
    alpha: 0.38,
    left: '50%',
    x: ['-36%', '-8%', '36%', '10%', '-36%'],
    y: ['-10%', '22%', '10%', '-20%', '-10%'],
    scale: [1, 1.06, 1.24, 1.02, 1],
    opacity: [0.38, 0.56, 0.4, 0.54, 0.38],
    duration: 20,
    delay: 1.4,
  },
  {
    color: ORB.azure,
    alpha: 0.35,
    left: '65%',
    x: ['-8%', '24%', '-4%', '30%', '-8%'],
    y: ['-20%', '-50%', '-8%', '-36%', '-20%'],
    scale: [1, 0.87, 1.24, 0.94, 1],
    opacity: [0.35, 0.5, 0.3, 0.52, 0.35],
    duration: 19,
    delay: 9.0,
  },
];

const orbBaseStyle = {
  position: 'absolute' as const,
  width: '55%',
  height: '130%',
  top: '-15%',
  borderRadius: '50%',
  transformOrigin: 'center center',
};

const BannerRoot = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.cardBorderRadius,
  background: (theme.vars || theme).palette.accent2Alt,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[3],
  cursor: 'default',
}));

const OrbLayer = styled(Box)({
  position: 'absolute',
  inset: 0,
  filter: 'blur(55px)',
  pointerEvents: 'none',
  overflow: 'hidden',
});

export function LoopoorMarketBanner() {
  const { t } = useTranslation();
  const router = useRouter();
  const { getChainById } = useChains();

  // Spring-driven cursor: stays at last position when pointer leaves the banner
  const cursorX = useMotionValue(-400);
  const cursorY = useMotionValue(-400);
  const springX = useSpring(cursorX, { stiffness: 65, damping: 14, mass: 1.4 });
  const springY = useSpring(cursorY, { stiffness: 65, damping: 14, mass: 1.4 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      cursorX.set(e.clientX - rect.left);
      cursorY.set(e.clientY - rect.top);
    },
    [cursorX, cursorY],
  );

  const { data: markets, isLoading } = useLoopoorMarkets({
    chainId: LOOPOOR_CHAIN_ID,
  });

  const market = markets?.[0];

  const { data: leverageData, isLoading: leverageLoading } =
    useLoopoorMaxLeverage({
      chainId: LOOPOOR_CHAIN_ID,
      marketId: market?.marketId ?? '',
    });

  if (isLoading) {
    return (
      <Skeleton
        variant="rounded"
        height={220}
        sx={{
          borderRadius: (theme) => `${theme.shape.cardBorderRadius}px`,
          backgroundColor: (theme) =>
            (theme.vars || theme).palette.surface1.main,
        }}
      />
    );
  }

  if (!market) {
    return null;
  }

  const chain = getChainById(market.chainId);
  const chainInfo = {
    chainId: market.chainId,
    chainKey: chain?.key ?? LOOPOOR_CHAIN_KEY_FALLBACK,
  };

  const maxLeverage = leverageData?.maxLeverageFactor;
  const apyPct = maxLeverage
    ? (market.state?.supplyApy ?? 0) * maxLeverage
    : (market.state?.supplyApy ?? 0);
  const href = `${AppPaths.Earn}/borrow/${market.chainId}/${market.marketId}`;

  return (
    <BannerRoot onMouseMove={handleMouseMove}>
      {/* Organic wandering orbs — each follows an irregular Lissajous-like path */}
      <OrbLayer>
        {ORB_CONFIGS.map((orb, i) => (
          <motion.div
            key={i}
            style={{
              ...orbBaseStyle,
              left: orb.left,
              background: `radial-gradient(circle at center, rgba(${orb.color}, ${orb.alpha}) 0%, transparent 70%)`,
            }}
            animate={{
              x: orb.x,
              y: orb.y,
              scale: orb.scale,
              opacity: orb.opacity,
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          />
        ))}
      </OrbLayer>

      {/* Spring-physics cursor orb — centered at (springX, springY) via left/top pre-offset + x/y transform */}
      <motion.div
        style={{
          position: 'absolute',
          width: '35%',
          height: '100%',
          // pre-center so that x:springX/y:springY place the orb center at the cursor
          left: '-17.5%',
          top: '-50%',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, rgba(${ORB.cursor}, 0.55) 0%, transparent 65%)`,
          filter: 'blur(50px)',
          x: springX,
          y: springY,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Stack sx={{ position: 'relative', zIndex: 1, gap: 4 }}>
        {/* Title + badges on the same row */}
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            width: '100%',
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
              width: '100%',
            }}
          >
            <Badge
              variant={BadgeVariant.Default}
              size={BadgeSize.MD}
              startIcon={<BoltIcon />}
              label={t('earn.borrow.featureOneClick', 'One-Click Execution')}
            />
            <Badge
              variant={BadgeVariant.Default}
              size={BadgeSize.MD}
              startIcon={<TrendingUpIcon />}
              label={t('earn.borrow.featureLeverage', 'Automated Leverage')}
            />
            {leverageLoading ? (
              <BaseSkeleton size={BadgeSize.MD} />
            ) : (
              <Badge
                variant={BadgeVariant.Secondary}
                size={BadgeSize.MD}
                startIcon={<TrendingUpIcon />}
                label={t('earn.borrow.upToApy', 'Up to {{apy}}% APY', {
                  apy: t('format.percent', { value: apyPct }),
                })}
              />
            )}
          </Stack>
          <Typography variant="titleLarge" sx={{ marginRight: 'auto' }}>
            {t('earn.borrow.bannerTitle', 'Introducing Loopoor')}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="bodyMedium"
            color="textSecondary"
            sx={{ whiteSpace: 'break-spaces' }}
          >
            {t(
              'earn.borrow.bannerSubtitle',
              'Maximize your lending yields with 1-click leverage.\nAutomatically apply leverage to your positions on Jumper Earn with ease.',
            )}
          </Typography>
        </Stack>

        {/* EntityStackWithBadge + CTA on the same row */}
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <EntityStackWithBadge
            entities={[
              {
                name: market.collateralToken.symbol,
                symbol: market.collateralToken.symbol,
                decimals: market.collateralToken.decimals,
                address: market.collateralToken.address,
                chain: chainInfo,
              },
              {
                name: market.loanToken.symbol,
                symbol: market.loanToken.symbol,
                decimals: market.loanToken.decimals,
                address: market.loanToken.address,
                chain: chainInfo,
              },
            ]}
            badgeSize={AvatarSize.XS}
            badgeEntities={[chainInfo]}
            size={AvatarSize.XXL}
            content={{
              title: `${market.collateralToken.symbol} / ${market.loanToken.symbol}`,
              titleVariant: 'bodySmallStrong',
            }}
            spacing={{ containerGap: 1, main: -1 }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push(href)}
            endIcon={<ArrowForwardIcon />}
            sx={{
              flexShrink: 0,
              fontWeight: 700,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              },
            }}
          >
            {t('earn.borrow.tryLoopoor', 'Try Loopoor')}
          </Button>
        </Stack>
      </Stack>
    </BannerRoot>
  );
}
