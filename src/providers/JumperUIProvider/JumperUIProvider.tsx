'use client';
import {
  JumperUIContext,
  type JumperUIContextValue,
  type JumperUIFormatters,
} from '@jumperexchange/shared-ui';
import { useRouter } from 'next/navigation';
import { useMemo, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortfolioFormatters } from '@/hooks/tokens/usePortfolioFormatters';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import { formatApy } from '@/utils/numbers/apy';

export function JumperUIProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    toInputAmount,
    toRawAmount,
    toPrice,
    toPriceDisplay,
    toAmountFromPrice,
    toInputAmountFromPrice,
  } = useTokenAmountInput();
  const {
    toAmount: formatBalance,
    toAmountUSD: formatBalanceUSD,
    toDisplayAmountUSD: formatDisplayBalanceUSD,
    toDisplayAmount: formatDisplayBalance,
  } = useTokenFormatters();
  const {
    toAggregatedAmount: formatAggregatedBalance,
    toAggregatedAmountUSD: formatAggregatedBalanceUSD,
    toDisplayAggregatedAmountUSD: formatDisplayAggregatedBalanceUSD,
    toDisplayAggregatedAmount: formatDisplayAggregatedBalance,
  } = usePortfolioFormatters();

  return (
    <JumperUIContext.Provider
      value={{
        formatters: {
          formatAmountUSD: (val, options) =>
            t(options?.compact ? 'format.currencyCompact' : 'format.currency', {
              value: val,
            }),
          formatDecimal: (val, options) =>
            t('format.decimal', {
              value: val,
              minimumFractionDigits: options?.minimumFractionDigits,
              maximumFractionDigits: options?.maximumFractionDigits ?? 3,
            }),
          formatApy,
          formatInputAmount: toInputAmount,
          priceToTokenAmount: toAmountFromPrice,
          formatTokenPrice: toPrice,
          formatDisplayPrice: toPriceDisplay,
          formatInputAmountFromPrice: toInputAmountFromPrice,
          formatBalance: formatBalance as any,
          formatBalanceUSD: formatBalanceUSD as any,
          formatDisplayBalanceUSD: formatDisplayBalanceUSD as any,
          formatDisplayBalance: formatDisplayBalance as any,
          formatAggregatedBalance: formatAggregatedBalance as any,
          formatAggregatedBalanceUSD: formatAggregatedBalanceUSD as any,
          formatDisplayAggregatedBalanceUSD:
            formatDisplayAggregatedBalanceUSD as any,
          formatDisplayAggregatedBalance: formatDisplayAggregatedBalance as any,
        },
        utils: {
          parseUnits: toRawAmount,
        },
        navigation: {
          navigate: router.push,
        },
      }}
    >
      {children}
    </JumperUIContext.Provider>
  );
}
