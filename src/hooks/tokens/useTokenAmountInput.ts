import {
  formatInputAmount,
  formatTokenAmount,
  formatTokenPrice,
  priceToTokenAmount,
} from '@lifi/widget';
import { useCallback } from 'react';
import { parseUnits } from 'viem';

import { normalizeZero } from '@/utils/strings/normalizeZero';

const USD_DECIMALS = 2;

export const useTokenAmountInput = () => {
  // Convert bigint to formatted string for display/editing
  const toAmount = useCallback((raw: bigint, decimals: number): string => {
    return formatTokenAmount(raw, decimals);
  }, []);

  // Format user input during typing (keepInitial=true) or on blur (keepInitial=false)
  const toInputAmount = useCallback(
    (value: string, decimals: number | null, keepInitial = false): string => {
      return formatInputAmount(normalizeZero(value), decimals, keepInitial);
    },
    [],
  );

  // Convert formatted string back to bigint
  const toRawAmount = useCallback(
    (tokenString: string, decimals: number): bigint => {
      try {
        return parseUnits(tokenString || '0', decimals);
      } catch {
        return 0n;
      }
    },
    [],
  );

  // Calculate USD price from token amount string
  const toPrice = useCallback((value: string, priceUSD?: string): number => {
    return formatTokenPrice(value, priceUSD);
  }, []);

  // Format price for display (used when not editing in price mode)
  const toPriceDisplay = useCallback((priceValue: number): string => {
    return formatInputAmount(priceValue.toFixed(USD_DECIMALS), USD_DECIMALS);
  }, []);

  // Convert price input to token amount string
  const toAmountFromPrice = useCallback(
    (priceValue: string, priceUSD?: string): string => {
      return priceToTokenAmount(priceValue, priceUSD);
    },
    [],
  );

  // Format token amount from price (used after price-to-token conversion)
  const toInputAmountFromPrice = useCallback(
    (priceValue: string, priceUSD: string, decimals: number): string => {
      const tokenValue = priceToTokenAmount(priceValue, priceUSD);
      return formatInputAmount(tokenValue, decimals);
    },
    [],
  );

  return {
    toAmount,
    toInputAmount,
    toRawAmount,
    toPrice,
    toPriceDisplay,
    toAmountFromPrice,
    toInputAmountFromPrice,
    usdDecimals: USD_DECIMALS,
  };
};
