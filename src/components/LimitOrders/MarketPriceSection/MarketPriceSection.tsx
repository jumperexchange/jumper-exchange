'use client';

import { CandlestickChart } from '@jumperexchange/shared-ui/components';
import type { ChainId } from '@lifi/sdk';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import type { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { uniqBy } from 'lodash';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { ActionableSection } from '@/components/composite/ActionableSection/ActionableSection';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { Size } from '@/components/core/buttons/types';
import { useChains } from '@/hooks/useChains';
import { useTokens } from '@/hooks/useTokens';
import { useUrlParams } from '@/hooks/useUrlParams';
import { datafeed } from '@/lib/tradingview/datafeed';
import { useLimitOrderPriceStore } from '@/stores/limitOrderPrice/LimitOrderPriceStore';
import type { BaseToken } from '@/types/tokens';
import { createBaseToken } from '@/types/tokens';
import { composeTokenKey } from '@/utils/tokenKey';
import { deriveLimitPriceLine } from './limitPriceLine';
import { MarketPriceEmptyState } from './MarketPriceEmptyState';
import { CHANGE_WINDOWS, usePriceData } from './usePriceData';

function formatPrice(price: number): string {
  return price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

interface ChainTokenSelection {
  chainId?: number;
  token?: string;
}

interface MarketPriceSectionProps {
  /** Slot for the expand / collapse button rendered top-right. */
  action?: ReactNode;
  onTokenChange?: (token: BaseToken, index: 0 | 1) => void;
}

export const MarketPriceSection = ({
  action,
  onTokenChange,
}: MarketPriceSectionProps) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);

  const urlParams = useUrlParams();
  const { getToken } = useTokens();
  const { getChainById } = useChains();

  const resolveSelectedToken = useCallback(
    (
      urlSelection: ChainTokenSelection,
      getToken: ReturnType<typeof useTokens>['getToken'],
    ): BaseToken | undefined => {
      const chainId = urlSelection.chainId;
      const tokenAddress = urlSelection.token;
      if (!chainId || !tokenAddress) {
        return undefined;
      }
      const token = getToken(chainId as ChainId, tokenAddress as Address);
      return token ? createBaseToken(token) : undefined;
    },
    [],
  );

  const fromToken = resolveSelectedToken(urlParams.sourceChainToken, getToken);
  const toToken = resolveSelectedToken(
    urlParams.destinationChainToken,
    getToken,
  );

  const tokens = uniqBy(
    [fromToken, toToken].filter((token): token is BaseToken => !!token),
    (token) => composeTokenKey(token.chainId, token.address),
  );
  const activeToken =
    tokens.find(
      (token) => composeTokenKey(token.chainId, token.address) === activeKey,
    ) ?? tokens[0];
  const activeChain = activeToken
    ? getChainById(activeToken.chainId as ChainId)
    : undefined;
  const activeSymbol = activeToken
    ? composeTokenKey(activeToken.chainId, activeToken.address)
    : '';

  const { currentPrice, changes } = usePriceData(datafeed, activeSymbol);

  const fromSymbol = fromToken
    ? composeTokenKey(fromToken.chainId, fromToken.address)
    : '';
  const toSymbol = toToken
    ? composeTokenKey(toToken.chainId, toToken.address)
    : '';

  const { currentPrice: fromTokenUsdPrice } = usePriceData(
    datafeed,
    fromSymbol,
  );
  const { currentPrice: toTokenUsdPrice } = usePriceData(datafeed, toSymbol);
  const { limitPrice } = useLimitOrderPriceStore();
  const limitPriceLine = deriveLimitPriceLine({
    limitPrice,
    fromToken,
    toToken,
    activeSymbol,
    fromSymbol,
    toSymbol,
    fromTokenUsdPrice,
    toTokenUsdPrice,
  });

  const handleTokenClick = (token: BaseToken) => {
    const key = composeTokenKey(token.chainId, token.address);
    setActiveKey(key);
    const index =
      toToken && composeTokenKey(toToken.chainId, toToken.address) === key
        ? 1
        : 0;
    onTokenChange?.(token, index);
  };

  return (
    <ActionableSection
      title={t('limitOrders.marketPrice')}
      action={
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
          {tokens.length > 1 &&
            tokens.map((token) => {
              const tokenKey = composeTokenKey(token.chainId, token.address);
              const tokenChain = getChainById(token.chainId as ChainId);
              return (
                <IconButton
                  key={tokenKey}
                  size="small"
                  onClick={() => handleTokenClick(token)}
                  sx={{
                    p: 0.5,
                    opacity: tokenKey === activeSymbol ? 1 : 0.45,
                    transition: 'opacity 200ms',
                  }}
                >
                  <EntityStackWithBadge
                    entities={[token]}
                    badgeEntities={tokenChain ? [tokenChain] : undefined}
                    size={AvatarSize.MD}
                    badgeSize={AvatarSize.XXS}
                    isContentVisible={false}
                  />
                </IconButton>
              );
            })}
          {action}
        </Stack>
      }
      sx={{ flexShrink: 0 }}
    >
      <AnimatePresence mode="wait">
        {activeToken ? (
          <motion.div
            key="market-price-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                  badgeEntities={activeChain ? [activeChain] : undefined}
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
                sx={{
                  gap: 1.5,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  pb: 0.5,
                }}
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
                dimOnLoading
                symbol={activeSymbol}
                datafeed={datafeed}
                limitPrice={limitPriceLine}
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
          </motion.div>
        ) : (
          <motion.div
            key="market-price-empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <MarketPriceEmptyState />
          </motion.div>
        )}
      </AnimatePresence>
    </ActionableSection>
  );
};
