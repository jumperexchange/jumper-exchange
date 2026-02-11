import type { Balance, ExtendedToken } from '@/types/tokens';
import type { FormInputProps } from '../FormInput/FormInput';
import { FormInputField } from '../FormInput/FormInput.styles';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import { EntityChainStack } from '@/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '@/components/composite/EntityChainStack/EntityChainStack.types';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';

interface TokenPriceFormInputProps extends Pick<
  FormInputProps,
  'id' | 'name' | 'label' | 'errorMessage' | 'disabled' | 'sx'
> {
  tokenBalance: Balance<ExtendedToken>;
  onAmountChange: (amount: string, amountUSD: string) => void;
}

export const TokenPriceFormInput: FC<TokenPriceFormInputProps> = ({
  tokenBalance,
  onAmountChange,
  ...rest
}) => {
  const {
    toAmount,
    toInputAmount,
    toAmountFromPrice,
    toPrice,
    toPriceDisplay,
    toInputAmountFromPrice,
    usdDecimals,
  } = useTokenAmountInput();

  const [_amount, setAmount] = useState(
    toAmount(tokenBalance.amount, tokenBalance.token.decimals),
  );
  const [displayValue, setDisplayValue] = useState(
    toPriceDisplay(
      toPrice(toAmount(tokenBalance.amount, tokenBalance.token.decimals)),
    ),
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const inputValue = event.target.value.replace('$', '');

    const usdAmountFormatted = toInputAmount(inputValue, usdDecimals, true);

    const tokenAmountFromUsd = toAmountFromPrice(
      usdAmountFormatted,
      tokenBalance.token.priceUSD,
    );

    setAmount(tokenAmountFromUsd);
    setDisplayValue(usdAmountFormatted);

    onAmountChange(tokenAmountFromUsd, usdAmountFormatted);
  };

  const handleBlur = () => {
    const formattedTokenAmount = toInputAmountFromPrice(
      displayValue,
      tokenBalance.token.priceUSD,
      tokenBalance.token.decimals,
    );
    setAmount(formattedTokenAmount);

    const calculatedUsdPrice = toPrice(
      formattedTokenAmount,
      tokenBalance.token.priceUSD,
    );
    const formattedUsdPrice = toPriceDisplay(calculatedUsdPrice);
    setDisplayValue(formattedUsdPrice);

    onAmountChange(formattedTokenAmount, formattedUsdPrice);
  };

  const displayValueWithFallback = `$${displayValue || '0'}`;

  return (
    <FormInputField
      {...rest}
      placeholder="$0.00"
      value={displayValueWithFallback}
      onChange={handleChange}
      onBlur={handleBlur}
      startAdornment={
        <EntityChainStack
          variant={EntityChainStackVariant.Tokens}
          tokens={[
            {
              ...tokenBalance.token,
              chain: {
                chainId: tokenBalance.token.chainId,
                chainKey: '',
              },
            },
          ]}
          tokensSize={AvatarSize.MD}
          chainsSize={AvatarSize['3XS']}
          isContentVisible={false}
        />
      }
    />
  );
};
