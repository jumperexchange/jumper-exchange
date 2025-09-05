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
