import { SelectCard } from '@/components/Cards/SelectCard/SelectCard';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { TokenAmountInputAvatar } from '../../TokenAmountInput/adornments/TokenAmountInputAvatar';
import type { BaseFieldProps } from '../types';
import type { FC } from 'react';
import { useMemo } from 'react';
import { useField } from '../store';
import { useChains } from '@/hooks/useChains';
import z from 'zod';
import type { CoinKey, TokenTag } from '@lifi/sdk';
import type { TFunction } from 'i18next';

// ─── Schema ───────────────────────────────────────────────────────────────────

export interface DisplayTokenChainSchemaOptions {
  /**
   * Restrict the valid token type literal.
   * Defaults to `'extended'` — change only if the field is used with a
   * different token shape in an unusual context.
   */
  tokenType?: string;
  /**
   * When provided, only tokens on these chain IDs will pass validation.
   * Useful when the display field is populated by a computed field that
   * must resolve to a specific network.
   */
  allowedChainIds?: number[];
}

export const createDisplayTokenChainSchema = (
  t: TFunction,
  options: DisplayTokenChainSchemaOptions = {},
) => {
  const { tokenType = 'extended', allowedChainIds } = options;

  let chainIdSchema = z.number();
  if (allowedChainIds?.length) {
    chainIdSchema = chainIdSchema.refine((id) => allowedChainIds.includes(id), {
      message: t('jumperWidget.fieldErrors.tokenChain.notSupported'),
    }) as typeof chainIdSchema;
  }

  return z.object({
    address: z.string(),
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
    logoURI: z.string().optional(),
    chainId: chainIdSchema,
    coinKey: z.custom<CoinKey>((val) => typeof val === 'string').optional(),
    tags: z
      .array(z.custom<TokenTag>((val) => typeof val === 'string'))
      .optional(),
    priceUSD: z.string(),
    type: z.literal(tokenType as 'extended'),
  });
};

export type DisplayTokenChainValue = z.infer<
  ReturnType<typeof createDisplayTokenChainSchema>
>;

interface DisplayTokenChainProps extends BaseFieldProps {}

export const DisplayTokenChain: FC<DisplayTokenChainProps> = ({
  label,
  fieldKey,
}) => {
  const field = useField<DisplayTokenChainValue>(fieldKey);
  const token = field.value;
  const { getChainById } = useChains();

  const chainName = useMemo(() => {
    if (!token) {
      return '';
    }
    return getChainById(token.chainId)?.name;
  }, [token, getChainById]);

  if (!token) {
    return null;
  }

  return (
    <SelectCard
      mode={SelectCardMode.Display}
      label={label}
      value={token.symbol}
      placeholder={token.symbol}
      description={chainName}
      isClickable={false}
      startAdornment={<TokenAmountInputAvatar token={token} />}
      sx={(theme) => ({
        background: (theme.vars || theme).palette.surface1.main,
      })}
    />
  );
};
