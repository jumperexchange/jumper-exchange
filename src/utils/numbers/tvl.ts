import {
  formatValueWithConfig,
  type ValueFormatConfig,
} from '../formatNumbers';

export const TVL_FORMAT_CONFIG: ValueFormatConfig = {
  type: 'currency',
  options: { maximumFractionDigits: 2 },
};

export const formatTvl = (value: number | string): string => {
  return formatValueWithConfig(value, TVL_FORMAT_CONFIG);
};
