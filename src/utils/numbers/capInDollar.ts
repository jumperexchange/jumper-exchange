import {
  formatValueWithConfig,
  type ValueFormatConfig,
} from '../formatNumbers';

export const CAP_IN_DOLLAR_FORMAT_CONFIG: ValueFormatConfig = {
  type: 'currency',
  options: { maximumFractionDigits: 2 },
};

export const formatCapInDollar = (value: number | string): string => {
  return formatValueWithConfig(value, CAP_IN_DOLLAR_FORMAT_CONFIG, {
    includePrefixSuffix: true,
  });
};
