import type { FC } from 'react';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import type { AggregatedTokenAmountProps } from '../types';
import { usePortfolioFormatters } from '@/hooks/tokens/usePortfolioFormatters';

export const AggregatedTokenAmount: FC<AggregatedTokenAmountProps> = ({
  balances,
  amountUSDVariant = 'bodySmallStrong',
  amountVariant = 'bodyXXSmall',
  compact = false,
  gap = 2,
  amountUSDDataTestId,
  amountDataTestId,
  sx,
}) => {
  const { toDisplayAggregatedAmountUSD, toDisplayAggregatedAmount } =
    usePortfolioFormatters();

  const primaryBalance = balances[0];

  if (!primaryBalance) {
    return null;
  }

  const formattedAmountUSD = toDisplayAggregatedAmountUSD(balances, {
    compact,
  });
  const formattedAmount = toDisplayAggregatedAmount(balances);

  return (
    <TitleWithHint
      title={formattedAmountUSD}
      titleVariant={amountUSDVariant}
      titleDataTestId={amountUSDDataTestId}
      hint={formattedAmount}
      hintVariant={amountVariant}
      hintDataTestId={amountDataTestId}
      gap={gap}
      sx={sx}
    />
  );
};
