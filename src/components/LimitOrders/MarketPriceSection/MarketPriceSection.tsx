'use client';

import type { ICandlestickDatafeed } from '@jumperexchange/shared-ui';
import { CandlestickChart } from '@jumperexchange/shared-ui';
import type { ExtendedChain } from '@lifi/sdk';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { BaseToken } from '@/types/tokens';
import { composeTokenKey } from '@/utils/tokenKey';
import { CHANGE_WINDOWS, usePriceData } from './usePriceData';
import { Size } from '@/components/core/buttons/types';
import type { Theme } from '@mui/material/styles';

function formatPrice(price: number): string {
  return price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}
import { ActionableSection } from '@/components/composite/ActionableSection/ActionableSection';

interface MarketPriceSectionProps {
  /** The two tokens the user can switch between (e.g. input token + output token). */
  tokens: [BaseToken, BaseToken];
  datafeed: ICandlestickDatafeed;
  /** Optional chain for each token — used as badge avatar on the token icon. */
  chain?: ExtendedChain;
  /** Slot for the expand / collapse button rendered top-right. */
  action?: ReactNode;
  onTokenChange?: (token: BaseToken, index: 0 | 1) => void;
}

export const MarketPriceSection = ({
  tokens,
  datafeed,
  chain,
  action,
  onTokenChange,
}: MarketPriceSectionProps) => {
  const { t } = useTranslation();
  const [activeIdx, setActiveIdx] = useState<0 | 1>(0);

  const deduplicatedTokens =
    tokens[0].address === tokens[1].address ? [tokens[0]] : tokens;
  const activeToken = deduplicatedTokens[activeIdx];
  const activeSymbol = composeTokenKey(
    activeToken.chainId,
    activeToken.address,
  );

  const { currentPrice, changes } = usePriceData(datafeed, activeSymbol);

  const handleTokenClick = (idx: 0 | 1) => {
    setActiveIdx(idx);
    onTokenChange?.(deduplicatedTokens[idx], idx);
  };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key="market-price-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <ActionableSection
          title={t('limitOrders.marketPrice')}
          action={
            <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
              {deduplicatedTokens.map((token, idx) => (
                <IconButton
                  key={`${token.address}`}
                  size="small"
                  onClick={() => handleTokenClick(idx as 0 | 1)}
                  sx={{
                    p: 0.5,
                    opacity: idx === activeIdx ? 1 : 0.45,
                    transition: 'opacity 200ms',
                  }}
                >
                  <EntityStackWithBadge
                    entities={[token]}
                    badgeEntities={chain ? [chain] : undefined}
                    size={AvatarSize.MD}
                    badgeSize={AvatarSize.XXS}
                    isContentVisible={false}
                  />
                </IconButton>
              ))}
              {action}
            </Stack>
          }
          sx={{ flexShrink: 0 }}
        >
          {/* Token identity + price + changes */}
          <Stack
            direction="row"
            sx={{
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box>
              <EntityStackWithBadge
                entities={[activeToken]}
                badgeEntities={chain ? [chain] : undefined}
                size={AvatarSize.XL}
                badgeSize={AvatarSize.XS}
                isContentVisible
                content={{
                  title: activeToken.symbol,
                  titleVariant: 'bodyMediumStrong',
                }}
              />
              <Box sx={{ mt: 0.5 }}>
                {currentPrice !== null ? (
                  <Typography variant="titleMedium">
                    ${formatPrice(currentPrice)}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={120} height={32} />
                )}
              </Box>
            </Box>

            {/* Price change badges */}
            <Stack
              direction="row"
              sx={{ gap: 1.5, flexWrap: 'wrap', alignItems: 'center', pb: 0.5 }}
            >
              {CHANGE_WINDOWS.map(({ label }) => {
                const entry = changes.find((c) => c.label === label);
                if (!entry) {
                  return (
                    <Skeleton
                      key={label}
                      variant="text"
                      width={48}
                      height={16}
                    />
                  );
                }
                const positive = entry.change >= 0;
                return (
                  <Stack
                    key={label}
                    direction="row"
                    sx={{ alignItems: 'center', gap: 0.25 }}
                  >
                    <Typography
                      variant="bodyXSmall"
                      sx={{
                        fontWeight: 600,
                        color: (theme) =>
                          positive
                            ? (theme.vars || theme).palette.mint[500]
                            : (theme.vars || theme).palette.scarlet[500],
                      }}
                    >
                      {positive ? '↑' : '↓'}
                      {Math.abs(entry.change).toFixed(2)}%
                    </Typography>
                    <Typography variant="bodyXSmall" color="textSecondary">
                      {label}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>

          {/* Tradingview charts resolve height at mount via autoSize;
          percentage/flex heights collapse to 0 when ancestors lack a concrete height. Use px or vh. */}
          <Box
            sx={{
              height: '30vh',
              minHeight: 220,
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <CandlestickChart
              symbol={activeSymbol}
              datafeed={datafeed}
              timeframeButton={{
                size: Size.XS,
                sx: {
                  paddingX: 1.5,
                  paddingY: 0.5,
                },
              }}
              timeframeSx={{
                padding: 0,
                marginTop: 1.5,
                marginBottom: 1.5,
                '& > .MuiStack-root': {
                  gap: 0.5,
                },
              }}
              chartSx={{ marginInline: (theme: Theme) => theme.spacing(-3) }}
            />
          </Box>
        </ActionableSection>
      </motion.div>
    </AnimatePresence>
  );
};
