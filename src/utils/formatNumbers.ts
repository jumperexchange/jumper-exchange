export const decimalFormatter = (lng: string | string[]) =>
  new Intl.NumberFormat(lng, {
    style: 'decimal',
    maximumFractionDigits: 7,
  });

export const currencyFormatter = (lng: string | string[]) =>
  new Intl.NumberFormat(lng, {
    style: 'currency',
    currency: 'USD',
  });
