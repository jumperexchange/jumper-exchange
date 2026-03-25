import type { ExtendedToken } from '@/types/tokens';
import { createTokenBalance as createTokenBalanceHelper } from '@/types/tokens';
import type { PositionPrimaryDisplay } from '../../TokenAmountInput/TokenAmountInput';
import { TokenAmountInput } from '../../TokenAmountInput/TokenAmountInput';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import type { BaseFieldProps } from '../types';
import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';

interface DisplayAmountProps extends BaseFieldProps {
  token: ExtendedToken;
  amount?: string;
  maxAmount?: string;
  enableMaxIndicator?: boolean;
  enableSwapButton?: boolean;
  primaryDisplay?: PositionPrimaryDisplay;
}

export const DisplayAmount: FC<DisplayAmountProps> = ({
  label,
  token,
  amount: amountProp,
  maxAmount: maxAmountProp,
  enableMaxIndicator = true,
  enableSwapButton = true,
  primaryDisplay = 'price',
}) => {
  const amount = amountProp ?? '0';
  const maxAmount = maxAmountProp ?? '0';
  const { toDisplayAmount } = useTokenFormatters();

  const createTokenBalance = useCallback(
    (balanceAmount: string | bigint) =>
      createTokenBalanceHelper(token, BigInt(balanceAmount)),
    [token],
  );

  const tokenBalance = useMemo(() => {
    return createTokenBalance(amount);
  }, [createTokenBalance, amount]);

  const maxTokenBalance = useMemo(() => {
    return createTokenBalance(maxAmount);
  }, [createTokenBalance, maxAmount]);

  return (
    <TokenAmountInput
      mode={SelectCardMode.Display}
      primaryDisplay={primaryDisplay}
      tokenBalance={tokenBalance}
      enableSwapButton={enableSwapButton}
      label={label}
      hintEndAdornment={
        enableMaxIndicator
          ? `/ ${toDisplayAmount(maxTokenBalance, undefined, { maximumFractionDigits: 6 })}`
          : undefined
      }
      sx={(theme) => ({
        background: (theme.vars || theme).palette.surface1.main,
        '& .MuiFormLabel-root': {
          ...theme.typography.bodySmallStrong,
        },
      })}
    />
  );
};
