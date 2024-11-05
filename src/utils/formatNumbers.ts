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

export function numberWithCommas(num?: string | number) {
  if (num === undefined || num === null) {
    return;
  }

  if (typeof num === 'string') {
    num = parseFloat(num);
  }

  // Check if the number has decimals
  const hasDecimal = num % 1 !== 0;

  return num.toLocaleString('en-US', {
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: 2,
  });
  // let parts = x.toString().split('.');
  // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // return parts.join('.');
}
