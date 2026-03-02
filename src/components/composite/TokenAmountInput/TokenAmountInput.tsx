import Box from '@mui/material/Box';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import type { ChangeEvent, FC } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { SelectCard } from '../../Cards/SelectCard/SelectCard';
import {
  SelectCardDescription,
  SelectCardMode,
} from '../../Cards/SelectCard/SelectCard.styles';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import type { Balance, PricedToken } from '@/types/tokens';
import { descriptionBoxStyles } from './constants';
import { TokenAmountInputAvatar } from './adornments/TokenAmountInputAvatar';
import { TokenAmountInputReset } from './adornments/TokenAmountInputReset';
import type { SxProps, Theme } from '@mui/material/styles';

export type PositionPrimaryDisplay = 'amount' | 'price';

interface TokenAmountInputProps {
  tokenBalance: Balance<PricedToken>;
  mode?: SelectCardMode;
  primaryDisplay?: PositionPrimaryDisplay;
  enableSwapButton?: boolean;
  enableResetButton?: boolean;
  endAdornment?: React.ReactNode;
  hintEndAdornment?: string;
  label?: string;
  onAmountChange?: (amount: string) => void;
  sx?: SxProps<Theme>;
}

export const TokenAmountInput: FC<TokenAmountInputProps> = ({
  tokenBalance,
  mode = SelectCardMode.Display,
  primaryDisplay: primaryDisplayProp = 'price',
  enableSwapButton = false,
  enableResetButton = false,
  endAdornment,
  hintEndAdornment,
  label,
  onAmountChange,
  sx,
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
      ? toDisplayAmount({ token, amount: rawAmount }, token.symbol, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        })
      : toDisplayAmountUSD({ token, amount: rawAmount });

  const displayWithFallback = displayValue || '0';
  const inputValue =
    primaryDisplay === 'price'
      ? `$${displayWithFallback}`
      : displayWithFallback;

  const placeholder = primaryDisplay === 'price' ? '$0' : '0';

  const initialValue = toAmount(tokenBalance.amount, token.decimals);
  const canResetToInitial =
    isInputMode && initialValue !== value && value !== '';

  return (
    <SelectCard
      mode={mode}
      labelVariant="bodyXSmall"
      id="token-amount"
      name="token-amount"
      value={inputValue}
      label={label}
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
          {hintEndAdornment && (
            <Box sx={{ marginLeft: 'auto' }}>
              <SelectCardDescription variant="bodyXSmall" hideOverflow>
                {hintEndAdornment}
              </SelectCardDescription>
            </Box>
          )}
        </Box>
      }
      placeholder={placeholder}
      isClickable={mode !== SelectCardMode.Display}
      isAmount
      onChange={handleChange}
      onBlur={handleBlur}
      startAdornment={<TokenAmountInputAvatar token={token} />}
      endAdornment={
        endAdornment ??
        (enableResetButton && canResetToInitial ? (
          <TokenAmountInputReset onReset={handleResetInitial} />
        ) : undefined)
      }
      sx={sx}
    />
  );
};
