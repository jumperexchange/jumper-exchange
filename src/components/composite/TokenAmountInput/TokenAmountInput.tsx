// TokenAmountInput.tsx
import Box from '@mui/material/Box';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { ChangeEvent, FC } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { SelectCard } from '../../Cards/SelectCard/SelectCard';
import {
  SelectCardDescription,
  SelectCardMode,
} from '../../Cards/SelectCard/SelectCard.styles';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '../EntityChainStack/EntityChainStack.types';
import { AvatarSize } from '../../core/AvatarStack/AvatarStack.types';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import type { Balance, ExtendedToken } from '@/types/tokens';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import {
  Variant as IconButtonVariant,
  Size as IconButtonSize,
} from '@/components/core/buttons/types';

export type PositionPrimaryDisplay = 'amount' | 'price';

interface TokenAmountInputProps {
  tokenBalance: Balance<ExtendedToken>;
  mode?: SelectCardMode;
  primaryDisplay?: PositionPrimaryDisplay;
  enableSwapButton?: boolean;
  onAmountChange?: (amount: string) => void;
}

const selectCardStyles = {
  padding: 0,
  borderRadius: 0,
  boxShadow: 'none',
  background: 'transparent',
  '& .MuiInputLabel-root': {
    color: 'text.secondary',
  },
} as const;

const descriptionBoxStyles = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 0.5,
} as const;

export const TokenAmountInput: FC<TokenAmountInputProps> = ({
  tokenBalance,
  mode = SelectCardMode.Display,
  primaryDisplay: primaryDisplayProp = 'price',
  enableSwapButton = false,
  onAmountChange,
}) => {
  const {
    toAmount,
    toInputAmount,
    toRawAmount,
    toPrice,
    toPriceDisplay,
    toAmountFromPrice,
    toInputAmountFromPrice,
    usdDecimals,
  } = useTokenAmountInput();
  const { toDisplayAmountUSD, toDisplayAmount } = useTokenFormatters();

  const token = tokenBalance.token;
  const isInputMode = mode === SelectCardMode.Input;
  const isEditingRef = useRef(false);

  const [primaryDisplay, setPrimaryDisplay] =
    useState<PositionPrimaryDisplay>(primaryDisplayProp);

  const [value, setValue] = useState(() =>
    toAmount(tokenBalance.amount, token.decimals),
  );
  const [formattedPriceInput, setFormattedPriceInput] = useState('');

  const handleInitialAmount = useCallback(() => {
    const nextValue = toAmount(tokenBalance.amount, token.decimals);
    setValue(nextValue);
  }, [tokenBalance.amount, token.decimals, toAmount]);

  useLayoutEffect(() => {
    handleInitialAmount();
  }, [handleInitialAmount]);

  // Display logic
  let displayValue: string;
  if (isEditingRef.current) {
    if (primaryDisplay === 'price') {
      displayValue = formattedPriceInput;
    } else {
      displayValue = value;
    }
  } else {
    if (primaryDisplay === 'price') {
      const priceValue = toPrice(value, token.priceUSD);
      displayValue = toPriceDisplay(priceValue);
    } else {
      displayValue = value;
    }
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const inputValue = event.target.value.replace('$', '');
    isEditingRef.current = true;

    if (primaryDisplay === 'price') {
      const formattedValue = toInputAmount(inputValue, usdDecimals, true);
      const tokenValue = toAmountFromPrice(formattedValue, token.priceUSD);
      setFormattedPriceInput(formattedValue);
      setValue(tokenValue);

      if (onAmountChange) {
        onAmountChange(tokenValue);
      }
    } else {
      const formattedValue = toInputAmount(inputValue, token.decimals, true);
      setValue(formattedValue);

      if (onAmountChange) {
        onAmountChange(formattedValue);
      }
    }
  };

  const handleBlur = () => {
    isEditingRef.current = false;

    if (primaryDisplay === 'price') {
      const formattedAmount = toInputAmountFromPrice(
        formattedPriceInput,
        token.priceUSD,
        token.decimals,
      );
      setValue(formattedAmount);

      if (onAmountChange) {
        onAmountChange(formattedAmount);
      }
    } else {
      const formattedValue = toInputAmount(value, token.decimals);
      setValue(formattedValue);

      if (onAmountChange) {
        onAmountChange(formattedValue);
      }
    }
  };

  const handleSwap = () => {
    setPrimaryDisplay((prev) => (prev === 'amount' ? 'price' : 'amount'));
  };

  const handleResetInitial = () => {
    handleInitialAmount();
    const initialValue = toAmount(tokenBalance.amount, token.decimals);
    if (onAmountChange) {
      onAmountChange(initialValue);
    }
  };

  const rawAmount = toRawAmount(value, token.decimals);
  const secondaryValue =
    primaryDisplay === 'price'
      ? toDisplayAmount({ token, amount: rawAmount }, token.symbol)
      : toDisplayAmountUSD({ token, amount: rawAmount });

  const displayWithFallback = displayValue || '0';
  const inputValue =
    primaryDisplay === 'price'
      ? `$${displayWithFallback}`
      : displayWithFallback;

  const placeholder = primaryDisplay === 'price' ? '$0' : '0';

  const initialValue = toAmount(tokenBalance.amount, token.decimals);
  const canResetToInitial = isInputMode && initialValue !== value;

  return (
    <SelectCard
      mode={mode}
      labelVariant="bodyXSmall"
      id="token-amount"
      name="token-amount"
      value={inputValue}
      description={
        <Box sx={descriptionBoxStyles}>
          <SelectCardDescription variant="bodyXSmall" hideOverflow>
            {secondaryValue}
          </SelectCardDescription>
          <SelectCardDescription
            variant="bodyXSmall"
            sx={{ lineHeight: '100%' }}
          >
            {enableSwapButton && isInputMode && (
              <SwapVertIcon
                sx={{
                  height: 12,
                  width: 12,
                  cursor: 'pointer',
                }}
                onClick={handleSwap}
              />
            )}
          </SelectCardDescription>
        </Box>
      }
      placeholder={placeholder}
      isClickable={mode !== SelectCardMode.Display}
      isAmount
      onChange={handleChange}
      onBlur={handleBlur}
      startAdornment={
        <EntityChainStack
          variant={EntityChainStackVariant.Tokens}
          tokens={[
            {
              ...token,
              chain: {
                chainId: token.chainId,
                chainKey: token.chainId.toString(),
              },
            },
          ]}
          tokensSize={AvatarSize.XL}
          chainsSize={AvatarSize.XXS}
          isContentVisible={false}
        />
      }
      endAdornment={
        canResetToInitial ? (
          <IconButton
            variant={IconButtonVariant.Default}
            size={IconButtonSize.MD}
            onClick={handleResetInitial}
          >
            <RefreshIcon />
          </IconButton>
        ) : undefined
      }
      sx={
        tokenBalance.amount > 0n || isInputMode
          ? selectCardStyles
          : { ...selectCardStyles, cursor: 'not-allowed' }
      }
    />
  );
};
