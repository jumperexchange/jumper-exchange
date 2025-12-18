import {
  priceToTokenAmount,
  formatTokenPrice,
  formatTokenAmount,
} from '@lifi/widget';
import { useMemo, type FC } from 'react';
import { SelectCard } from '../Cards/SelectCard/SelectCard';
import { SelectCardMode } from '../Cards/SelectCard/SelectCard.styles';
import { EntityChainStack } from '../composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '../composite/EntityChainStack/EntityChainStack.types';
import { AvatarSize } from '../core/AvatarStack/AvatarStack.types';
import { useTokens } from '@/hooks/useTokens';
import type { Token } from '@/types/jumper-backend';
import { currencyFormatter } from '@/utils/formatNumbers';
import { useTranslation } from 'react-i18next';
import { useToken } from '@/hooks/useToken';

interface EarnDetailsActionsPositionProps {
  token: Token;
  amountUSD?: number;
  amount?: bigint | number;
}

const formatUSD = currencyFormatter('en-US', {
  notation: 'compact',
  currency: 'USD',
  useGrouping: true,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const selectCardStyles = {
  padding: 0,
  borderRadius: 0,
  boxShadow: 'none',
  background: 'transparent',
  '& .MuiInputLabel-root': {
    color: 'text.secondary',
  },
} as const;

export const EarnDetailsActionsPosition: FC<
  EarnDetailsActionsPositionProps
> = ({ token, amountUSD, amount }) => {
  const { t } = useTranslation();
  const { getTokenByAddressAndChain, isSuccess: isSuccessTokens } = useTokens();

  const tokenPriceUSD =
    getTokenByAddressAndChain(token.address, token.chain.chainId)?.priceUSD ??
    '0';
  const hasTokenPriceUSD = Number(tokenPriceUSD) > 0;
  const shouldActivateFallbackToken = !hasTokenPriceUSD && isSuccessTokens;

  const { token: fallbackToken } = useToken(
    token.chain.chainId,
    token.address,
    shouldActivateFallbackToken,
  );

  const effectivePriceUSD = hasTokenPriceUSD
    ? tokenPriceUSD
    : (fallbackToken?.priceUSD ?? '0');

  const hasEffectivePriceUSD = Number(effectivePriceUSD) > 0;

  const { formattedAmount, formattedAmountUSD } = useMemo(() => {
    const calculateTokenAmount = (): string => {
      if (amountUSD && hasEffectivePriceUSD) {
        return priceToTokenAmount(amountUSD.toString(), effectivePriceUSD);
      }
      if (amount) {
        return formatTokenAmount(BigInt(amount), token.decimals);
      }
      return '0';
    };

    const calculateAmountUSD = (): number => {
      if (amountUSD) {
        return amountUSD;
      }
      if (amount && hasEffectivePriceUSD) {
        const formattedTokenAmount = formatTokenAmount(
          BigInt(amount),
          token.decimals,
        );
        return formatTokenPrice(formattedTokenAmount, effectivePriceUSD);
      }
      return 0;
    };

    return {
      formattedAmount: `${calculateTokenAmount()} ${token.symbol ?? ''}`,
      formattedAmountUSD: formatUSD(calculateAmountUSD()),
    };
  }, [
    amountUSD,
    amount,
    token.decimals,
    token.symbol,
    hasEffectivePriceUSD,
    effectivePriceUSD,
  ]);

  return (
    <SelectCard
      mode={SelectCardMode.Display}
      label={t('earn.position.label')}
      labelVariant="bodyXSmall"
      value={formattedAmountUSD}
      description={formattedAmount}
      placeholder="0"
      isClickable={false}
      startAdornment={
        <EntityChainStack
          variant={EntityChainStackVariant.Tokens}
          tokens={[token]}
          tokensSize={AvatarSize.XL}
          chainsSize={AvatarSize.XXS}
          isContentVisible={false}
        />
      }
      sx={selectCardStyles}
    />
  );
};
