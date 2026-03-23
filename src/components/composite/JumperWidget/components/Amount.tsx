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
import type { TFunction } from 'i18next';

export interface AmountSchemaOptions {
  /**
   * Minimum raw token amount as a bigint-compatible string.
   * Defaults to no minimum (any non-negative value accepted).
   */
  min?: string;
  /**
   * Maximum raw token amount as a bigint-compatible string.
   * When provided, the entered amount must be ≤ this value.
   * Useful for capping at the user's available balance.
   */
  max?: string;
  /**
   * When `true`, an amount of "0" is treated as invalid.
   * Defaults to `false` so the field can be rendered with an empty/zero state.
   */
  requireNonZero?: boolean;
}

export const createAmountSchema = (
  t: TFunction,
  options: AmountSchemaOptions = {},
) => {
  const { min, max, requireNonZero = false } = options;

  let amountSchema = z.string();

  if (requireNonZero) {
    amountSchema = amountSchema.refine((v) => BigInt(v || '0') > 0n, {
      message: t('jumperWidget.fieldErrors.amount.overZero'),
    });
  }

  if (min !== undefined) {
    amountSchema = amountSchema.refine((v) => BigInt(v || '0') >= BigInt(min), {
      message: t('jumperWidget.fieldErrors.amount.min', { min }),
    });
  }

  if (max !== undefined) {
    amountSchema = amountSchema.refine((v) => BigInt(v || '0') <= BigInt(max), {
      message: t('jumperWidget.fieldErrors.amount.max', { max }),
    });
  }

  return z.object({
    amount: amountSchema,
    maxAmount: z.string().optional(),
  });
};

export type AmountValue = z.infer<ReturnType<typeof createAmountSchema>>;

// ─── Component ────────────────────────────────────────────────────────────────

export interface AmountProps extends BaseFieldProps {
  token: ExtendedToken;
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
      field.setValue({ amount: newAmount, maxAmount });
    },
    [field, maxAmount],
  );

  const handleFormattedAmountChange = useCallback(
    (formattedAmount: string) => {
      const rawAmount = toRawAmount(formattedAmount, token.decimals);
      field.setValue({ amount: rawAmount.toString(), maxAmount });
    },
    [toRawAmount, token.decimals, maxAmount, field],
  );

  const tokenBalance = useMemo(
    () => createTokenBalance(amount),
    [createTokenBalance, amount],
  );

  const maxTokenBalance = useMemo(
    () => createTokenBalance(maxAmount),
    [createTokenBalance, maxAmount],
  );

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
