import {
  formatValueWithConfig,
  type ValueFormatConfig,
} from '../formatNumbers';

export const APY_FORMAT_CONFIG: ValueFormatConfig = {
  type: 'percentage',
  options: { maximumFractionDigits: 2 },
};

export const formatApy = (value: number | string): string => {
  return formatValueWithConfig(value, APY_FORMAT_CONFIG);
};
