import type { ValueFormatConfig } from '../formatNumbers';

export interface NumberParts {
  prefix: string;
  integer: string;
  decimal: string;
  delimiter: string;
  suffix: string;
  formattedValue: string;
  numericValue: string;
}

export const getNumberParts = (
  value: number | string,
  config: ValueFormatConfig,
): NumberParts => {
  const numValue = Number(value);

  if (isNaN(numValue) || numValue === 0) {
    return {
      prefix: '',
      integer: '0',
      decimal: '',
      delimiter: '',
      suffix: '',
      formattedValue: '0',
      numericValue: '0',
    };
  }

  const formatOptions: Intl.NumberFormatOptions = { ...config.options };

  switch (config.type) {
    case 'percentage':
      formatOptions.style = 'percent';
      break;
    case 'currency':
      formatOptions.style = 'currency';
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

  const formatter = new Intl.NumberFormat('en-US', formatOptions);
  const parts = formatter.formatToParts(numValue);

  let prefix = '';
  let integer = '';
  let decimal = '';
  let suffix = '';
  let delimiter = '';

  for (const part of parts) {
    switch (part.type) {
      case 'currency':
        prefix += part.value;
        break;
      case 'integer':
      case 'group':
        integer += part.value;
        break;
      case 'decimal':
        delimiter = part.value;
        break;
      case 'fraction':
        decimal = part.value;
        break;
      case 'compact':
      case 'percentSign':
        suffix += part.value;
        break;
    }
  }

  const numericValue = decimal ? `${integer}${delimiter}${decimal}` : integer;

  return {
    prefix,
    integer,
    decimal,
    delimiter,
    suffix,
    formattedValue: formatter.format(numValue),
    numericValue,
  };
};
