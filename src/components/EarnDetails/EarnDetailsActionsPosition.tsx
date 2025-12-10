import { priceToTokenAmount } from '@lifi/widget';
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

interface EarnDetailsActionsPositionProps {
  token: Token;
  amountUSD?: number;
}

export const EarnDetailsActionsPosition: FC<
  EarnDetailsActionsPositionProps
> = ({ token, amountUSD }) => {
  const { t } = useTranslation();
  const { getTokenByAddressAndChain } = useTokens();

  const { formattedAmount, formattedAmountUSD } = useMemo(() => {
    const priceUSD =
      getTokenByAddressAndChain(token.address, token.chain.chainId)?.priceUSD ??
      0;

    const tokenAmount = amountUSD
      ? priceToTokenAmount(amountUSD.toString(), priceUSD.toString())
      : '0';

    return {
      formattedAmount: `${tokenAmount} ${token?.symbol ?? ''}`,
      formattedAmountUSD: currencyFormatter('en-US', {
        notation: 'compact',
        currency: 'USD',
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })(amountUSD),
    };
  }, [amountUSD, token, getTokenByAddressAndChain]);

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
        token && (
          <EntityChainStack
            variant={EntityChainStackVariant.Tokens}
            tokens={[token]}
            tokensSize={AvatarSize.XL}
            chainsSize={AvatarSize.XXS}
            isContentVisible={false}
          />
        )
      }
      sx={(theme) => ({
        padding: 0,
        borderRadius: 0,
        boxShadow: 'none',
        background: 'transparent',
        '& .MuiInputLabel-root': {
          color: (theme.vars || theme).palette.text.secondary,
        },
      })}
    />
  );
};
