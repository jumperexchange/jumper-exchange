import { formatUnits } from './formatUnit';

export const precisionFormatter = new Intl.NumberFormat('en', {
  notation: 'standard',
  roundingPriority: 'morePrecision',
  maximumSignificantDigits: 4,
  maximumFractionDigits: 4,
  useGrouping: false,
});

export function formatTokenAmount(amount: bigint = 0n, decimals: number) {
  const formattedAmount = amount ? formatUnits(amount, decimals) : '0';
  const parsedAmount = parseFloat(formattedAmount);
  if (parsedAmount === 0 || isNaN(Number(formattedAmount))) {
    return '0';
  }

  return precisionFormatter.format(parsedAmount);
}

export function formatTokenPrice(amount?: string, price?: string) {
  if (!amount || !price) {
    return 0;
  }
  if (isNaN(Number(amount)) || isNaN(Number(price))) {
    return 0;
  }
  return parseFloat(amount) * parseFloat(price);
}
