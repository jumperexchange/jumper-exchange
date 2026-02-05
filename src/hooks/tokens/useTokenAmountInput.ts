import {
  formatInputAmount,
  formatTokenAmount,
  formatTokenPrice,
  priceToTokenAmount,
} from '@lifi/widget';
import { useCallback } from 'react';
import { parseUnits } from 'viem';

export const USD_DECIMALS = 2;

export const useTokenAmountInput = () => {
  const toInputAmount = useCallback(
    (value: string, decimals: number | null, keepInitial = false): string => {
      let normalized = value;
      if (
        keepInitial &&
        normalized.length >= 2 &&
        normalized[0] === '0' &&
        normalized[1] !== '.'
      ) {
        normalized = normalized.replace(/^0+/, '') || '0';
      }
      return formatInputAmount(normalized, decimals, keepInitial);
    },
    [],
  );

  const toRawAmount = useCallback(
    (tokenString: string, decimals: number): bigint => {
      return parseUnits(tokenString || '0', decimals);
    },
    [],
  );

  const toTokenAmountString = useCallback(
    (raw: bigint, decimals: number): string => {
      return formatTokenAmount(raw, decimals);
    },
    [],
  );

  const toPriceString = useCallback(
    (raw: bigint, priceUSD: string, decimals: number): string => {
      return formatTokenPrice(raw, priceUSD, decimals).toString();
    },
    [],
  );

  const toRawAmountFromPrice = useCallback(
    (priceStr: string, priceUSD: string, decimals: number): bigint => {
      const tokenAmountStr = priceToTokenAmount(priceStr, priceUSD);
      return parseUnits(tokenAmountStr || '0', decimals);
    },
    [],
  );

  const toTokenAmountStringFromPrice = useCallback(
    (priceStr: string, priceUSD: string, decimals: number): string => {
      const tokenAmountStr = priceToTokenAmount(priceStr, priceUSD);
      return formatInputAmount(tokenAmountStr, decimals, false);
    },
    [],
  );

  return {
    toInputAmount,
    toRawAmount,
    toTokenAmountString,
    toPriceString,
    toRawAmountFromPrice,
    toTokenAmountStringFromPrice,
    usdDecimals: USD_DECIMALS,
  };
};
