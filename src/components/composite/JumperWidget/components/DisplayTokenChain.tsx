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

export const displayTokenChainSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  logoURI: z.string().optional(),
  chainId: z.number(),
  coinKey: z.custom<CoinKey>((val) => typeof val === 'string').optional(),
  tags: z
    .array(z.custom<TokenTag>((val) => typeof val === 'string'))
    .optional(),
  priceUSD: z.string(),
  type: z.literal('extended'),
});

export type DisplayTokenChainValue = z.infer<typeof displayTokenChainSchema>;

interface DisplayTokenChainProps extends BaseFieldProps {
  label?: string;
}

export const DisplayTokenChain: FC<DisplayTokenChainProps> = ({
  label,
  fieldKey,
}) => {
  const field = useField<DisplayTokenChainValue>(fieldKey);
  const token = field.value;
  const { getChainById } = useChains();

  const description = useMemo(() => {
    if (!token) {
      return '';
    }
    const _chain = getChainById(token.chainId);

    return _chain?.name;
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
      description={description}
      isClickable={false}
      startAdornment={<TokenAmountInputAvatar token={token} />}
      sx={(theme) => ({
        background: (theme.vars || theme).palette.surface1.main,
      })}
    />
  );
};
