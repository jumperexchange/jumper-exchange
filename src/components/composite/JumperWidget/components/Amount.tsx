import type { ExtendedToken } from '@/types/tokens';
import { createTokenBalance as createTokenBalanceHelper } from '@/types/tokens';
import { TokenAmountInput } from '../../TokenAmountInput/TokenAmountInput';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import type { BaseFieldProps } from '../types';
import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import z from 'zod';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import { useField } from '../store';
import { TokenAmountInputPercentages } from '@/components/composite/TokenAmountInput/adornments/TokenAmountInputPercentages';

export const amountSchema = z.object({
  amount: z.string(),
  maxAmount: z.string().optional(),
});

export type AmountValue = z.infer<typeof amountSchema>;

interface AmountProps extends BaseFieldProps {
  token: ExtendedToken;
  label?: string;
}

export const Amount: FC<AmountProps> = ({ fieldKey, label, token }) => {
  const field = useField<AmountValue>(fieldKey);
  const amount = field.value?.amount ?? '0';
  const maxAmount = field.value?.maxAmount ?? '0';
  const { toDisplayAmount } = useTokenFormatters();
  const { toRawAmount } = useTokenAmountInput();

  const createTokenBalance = useCallback(
    (balanceAmount: string | bigint) =>
      createTokenBalanceHelper(token, BigInt(balanceAmount)),
    [token],
  );

  const handleAmountChange = useCallback(
    (newAmount: string) => {
      field.setValue({
        amount: newAmount,
        maxAmount,
      });
    },
    [field, maxAmount],
  );

  const handleFormattedAmountChange = useCallback(
    (formattedAmount: string) => {
      console.log(formattedAmount, token.decimals);
      const rawAmount = toRawAmount(formattedAmount, token.decimals);
      console.log(rawAmount);
      field.setValue({
        amount: rawAmount.toString(),
        maxAmount,
      });
    },
    [toRawAmount, token, field, maxAmount],
  );

  const tokenBalance = useMemo(() => {
    return createTokenBalance(amount);
  }, [createTokenBalance, amount]);

  const maxTokenBalance = useMemo(() => {
    return createTokenBalance(maxAmount);
  }, [createTokenBalance, maxAmount]);

  return (
    <TokenAmountInput
      mode={SelectCardMode.Input}
      tokenBalance={tokenBalance}
      enableSwapButton
      label={label}
      onAmountChange={handleFormattedAmountChange}
      hintEndAdornment={`/ ${toDisplayAmount(maxTokenBalance, undefined, { maximumFractionDigits: 6 })}`}
      endAdornment={
        <TokenAmountInputPercentages
          maxAmount={maxTokenBalance.amount}
          onAmountChange={handleAmountChange}
        />
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
