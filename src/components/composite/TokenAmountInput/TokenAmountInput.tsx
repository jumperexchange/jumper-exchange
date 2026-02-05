import Box from '@mui/material/Box';
import SwapVertIcon from '@mui/icons-material/SwapVert';
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
import RefreshIcon from '@mui/icons-material/Refresh';
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
  onAmountChange?: (amount: bigint) => void;
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
    toInputAmount,
    toRawAmount,
    toTokenAmountString,
    toPriceString,
    toTokenAmountStringFromPrice,
    usdDecimals,
  } = useTokenAmountInput();
  const { toDisplayAmountUSD, toDisplayAmount } = useTokenFormatters();

  const token = tokenBalance.token;
  const isInputMode = mode === SelectCardMode.Input;
  const isEditingRef = useRef(false);

  const [primaryDisplay, setPrimaryDisplay] =
    useState<PositionPrimaryDisplay>(primaryDisplayProp);
  const [tokenAmountString, setTokenAmountString] = useState(() =>
    toTokenAmountString(tokenBalance.amount, token.decimals),
  );
  const [formattedPriceInput, setFormattedPriceInput] = useState('');
  const [displayPriceString, setDisplayPriceString] = useState(() =>
    token.priceUSD
      ? toInputAmount(
          toPriceString(tokenBalance.amount, token.priceUSD, token.decimals),
          usdDecimals,
        )
      : '',
  );

  const handleInitialAmount = useCallback(() => {
    const nextTokenString = toTokenAmountString(
      tokenBalance.amount,
      token.decimals,
    );
    setTokenAmountString(nextTokenString);
    const nextPriceString = token.priceUSD
      ? toInputAmount(
          toPriceString(
            toRawAmount(nextTokenString, token.decimals),
            token.priceUSD,
            token.decimals,
          ),
          usdDecimals,
        )
      : '';
    setDisplayPriceString(nextPriceString);
  }, [
    tokenBalance.amount,
    token.decimals,
    token.priceUSD,
    toTokenAmountString,
    toRawAmount,
    toPriceString,
    toInputAmount,
    usdDecimals,
  ]);

  useLayoutEffect(() => {
    handleInitialAmount();
  }, [handleInitialAmount]);

  const rawAmount = toRawAmount(tokenAmountString, token.decimals);

  let displayValue: string;
  if (isEditingRef.current) {
    displayValue =
      primaryDisplay === 'price' ? formattedPriceInput : tokenAmountString;
  } else {
    if (primaryDisplay === 'price') {
      displayValue = displayPriceString;
    } else {
      displayValue = tokenAmountString;
    }
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const inputValue = event.target.value.replace('$', '');
    isEditingRef.current = true;

    if (primaryDisplay === 'price') {
      const formatted = toInputAmount(inputValue, usdDecimals, true);
      setFormattedPriceInput(formatted);
      if (parseFloat(token.priceUSD) > 0) {
        const nextTokenString = toTokenAmountStringFromPrice(
          formatted,
          token.priceUSD,
          token.decimals,
        );
        setTokenAmountString(nextTokenString);
        if (onAmountChange) {
          onAmountChange(toRawAmount(nextTokenString, token.decimals));
        }
      }
    } else {
      const nextTokenString = toInputAmount(inputValue, token.decimals, true);
      setTokenAmountString(nextTokenString);
      if (onAmountChange) {
        onAmountChange(toRawAmount(nextTokenString, token.decimals));
      }
    }
  };

  const handleBlur = () => {
    const valueToUse =
      primaryDisplay === 'price' ? formattedPriceInput : tokenAmountString;
    isEditingRef.current = false;

    if (primaryDisplay === 'price') {
      const formatted = toInputAmount(valueToUse, usdDecimals);
      setDisplayPriceString(formatted);
      if (parseFloat(token.priceUSD) > 0) {
        const nextTokenString = toTokenAmountStringFromPrice(
          formatted,
          token.priceUSD,
          token.decimals,
        );
        setTokenAmountString(nextTokenString);
        if (onAmountChange) {
          onAmountChange(toRawAmount(nextTokenString, token.decimals));
        }
      }
      setFormattedPriceInput('');
    } else {
      const nextTokenString = toInputAmount(valueToUse, token.decimals);
      setTokenAmountString(nextTokenString);
      if (onAmountChange) {
        onAmountChange(toRawAmount(nextTokenString, token.decimals));
      }
    }
  };

  const handleSwap = () => {
    setPrimaryDisplay((v) => {
      const next = v === 'amount' ? 'price' : 'amount';
      if (next === 'price' && token.priceUSD) {
        setDisplayPriceString(
          toInputAmount(
            toPriceString(rawAmount, token.priceUSD, token.decimals),
            usdDecimals,
          ),
        );
      }
      return next;
    });
  };

  const handleResetInitial = () => {
    handleInitialAmount();
  };

  const displayWithFallback = displayValue || '0';
  const inputValue =
    primaryDisplay === 'price'
      ? `$${displayWithFallback}`
      : displayWithFallback;

  const secondaryValue =
    primaryDisplay === 'price'
      ? toDisplayAmount({ token, amount: rawAmount }, token.symbol)
      : toDisplayAmountUSD({ token, amount: rawAmount });

  const placeholder = primaryDisplay === 'price' ? '$0' : '0';

  const canResetToInitial = isInputMode && tokenBalance.amount !== rawAmount;

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
            {enableSwapButton && isInputMode ? (
              <SwapVertIcon
                sx={(theme) => ({
                  height: 12,
                  width: 12,
                  cursor: 'pointer',
                })}
                onClick={handleSwap}
              />
            ) : undefined}
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
