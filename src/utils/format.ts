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

export function formatInputAmount(
  amount: string,
  decimals: number | null = null,
  returnInitial = false,
  maxValue?: number,
) {
  if (!amount) {
    return amount;
  }

  // Remove any characters that are not numbers, dots, or commas
  let formattedAmount = amount.replace(/[^0-9.,]/g, '').trim();

  // Replace all commas with dots for consistent decimal handling
  formattedAmount = formattedAmount.replaceAll(',', '.');

  // Handle duplicate decimal points
  if (
    formattedAmount.endsWith('.') &&
    formattedAmount.slice(0, -1).includes('.')
  ) {
    const hasPreDecimalFigure = formattedAmount.at(-3);
    formattedAmount = hasPreDecimalFigure ? formattedAmount.slice(0, -2) : '0';
  }

  // Allow removal of leading "0." and empty input
  if (formattedAmount === '' || formattedAmount === '.') {
    return formattedAmount;
  }

  // Special handling for inputs starting with "0." or just "0"
  if (formattedAmount === '0' || formattedAmount.startsWith('0.')) {
    if (returnInitial) {
      return formattedAmount;
    }

    // Split into integer and fraction parts
    let [integer, fraction = ''] = formattedAmount.split('.');

    // Limit fraction length if decimals is specified
    if (decimals !== null && fraction.length > decimals) {
      fraction = fraction.slice(0, decimals);
    }

    // Reconstruct the formatted amount
    formattedAmount = `${integer}${fraction || formattedAmount.includes('.') ? '.' : ''}${fraction}`;
  }

  if (formattedAmount.startsWith('.')) {
    formattedAmount = `0${formattedAmount}`;
  }

  // Remove leading zeros for whole numbers
  formattedAmount = formattedAmount.replace(/^0+(?=\d)/, '') || '0';

  if (returnInitial) {
    return formattedAmount;
  }

  let [integer, fraction = ''] = formattedAmount.split('.');

  // Limit fraction length if decimals is specified
  if (decimals !== null && fraction.length > decimals) {
    fraction = fraction.slice(0, decimals);
  }

  // Avoid trimming valid trailing zeros while typing
  let result = `${integer}${fraction || formattedAmount.includes('.') ? '.' : ''}${fraction}`;

  // Check if the result exceeds maxValue
  if (maxValue !== undefined) {
    const [maxInteger, maxFraction = ''] = maxValue.toString().split('.');
    const [resultInteger, resultFraction = ''] = result.split('.');

    const isExceedingMaxValue =
      parseInt(resultInteger) > parseInt(maxInteger) ||
      (resultInteger === maxInteger &&
        resultFraction.padEnd(20, '0') > maxFraction.padEnd(20, '0'));

    if (isExceedingMaxValue) {
      result = String(maxValue);
      if (decimals !== null) {
        result = result.slice(0, decimals + resultInteger.length);
      }
    }
  }

  return result;
}
