export const decimalFormatter = (
  lng: string | undefined,
  options: Intl.NumberFormatOptions,
) => {
  const formatter = new Intl.NumberFormat(lng, {
    ...options,
    style: 'decimal',
  });

  return (value: any) => {
    if (!value) {
      return formatter.format(0);
    }

    return formatter.format(value);
  };
};

export const percentFormatter = (
  lng: string | undefined,
  options: Intl.NumberFormatOptions,
) => {
  const formatter = new Intl.NumberFormat(lng, {
    ...options,
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (value: any) => {
    if (!value) {
      return formatter.format(0);
    }

    return formatter.format(value);
  };
};

export const currencyFormatter = (
  lng: string | undefined,
  options: Intl.NumberFormatOptions,
) => {
  const formatter = new Intl.NumberFormat(lng, {
    ...options,
    style: 'currency',
  });

  return (value: any) => {
    if (!value) {
      return formatter.format(0);
    }

    return formatter.format(value);
  };
};

export const toFixedFractionDigits = (
  value: number,
  minFractionDigits: number,
  maxFractionDigits: number,
  notation: 'standard' | 'compact' = 'compact',
) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits,
    notation: notation,
  }).format(value);
};

export const toCompactValue = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};

export interface ValueFormatConfig {
  type: 'percentage' | 'currency' | 'compact' | 'decimal';
  options?: Intl.NumberFormatOptions;
}

export const formatValueWithConfig = (
  value: number | string,
  config: ValueFormatConfig,
  options?: { includePrefixSuffix?: boolean } & Intl.NumberFormatOptions,
): string => {
  const numValue = Number(value);

  if (isNaN(numValue)) {
    return value.toString();
  }

  const includePrefixSuffix = options?.includePrefixSuffix ?? true;
  const formatOptions: Intl.NumberFormatOptions = { ...config.options };

  switch (config.type) {
    case 'percentage':
      formatOptions.style = includePrefixSuffix ? 'percent' : 'decimal';
      return new Intl.NumberFormat('en-US', formatOptions).format(
        includePrefixSuffix ? numValue : numValue * 100,
      );

    case 'currency':
      formatOptions.style = includePrefixSuffix ? 'currency' : 'decimal';
      formatOptions.currency = 'USD';
      formatOptions.notation = 'compact';
      formatOptions.compactDisplay = 'short';
      formatOptions.trailingZeroDisplay = 'stripIfInteger';
      break;

    case 'compact':
      formatOptions.notation = 'compact';
      formatOptions.compactDisplay = 'short';
      break;

    case 'decimal':
      formatOptions.style = 'decimal';
      break;
  }

  return new Intl.NumberFormat('en-US', formatOptions).format(numValue);
};

export const formatUSD = currencyFormatter('en-US', {
  notation: 'compact',
  currency: 'USD',
  useGrouping: true,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
