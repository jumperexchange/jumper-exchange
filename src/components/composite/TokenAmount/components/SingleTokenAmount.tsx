import type { FC } from 'react';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import type { SingleTokenAmountProps } from '../types';

export const SingleTokenAmount: FC<SingleTokenAmountProps> = ({
  balance,
  amountUSDVariant = 'bodySmallStrong',
  amountVariant = 'bodyXXSmall',
  compact = false,
  gap = 2,
  amountUSDDataTestId,
  amountDataTestId,
  sx,
}) => {
  const { toDisplayAmountUSD, toDisplayAmount } = useTokenFormatters();

  const amountUSD = toDisplayAmountUSD(balance, { compact });
  const amount = toDisplayAmount(balance, balance.token.symbol);

  return (
    <TitleWithHint
      title={amountUSD}
      titleVariant={amountUSDVariant}
      titleDataTestId={amountUSDDataTestId}
      hint={amount}
      hintVariant={amountVariant}
      hintDataTestId={amountDataTestId}
      gap={gap}
      sx={sx}
    />
  );
};
