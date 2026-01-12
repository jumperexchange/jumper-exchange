import {
  formatValueWithConfig,
  type ValueFormatConfig,
} from '../formatNumbers';
import { getNumberParts } from './getNumberParts';

export const PORTFOLIO_OVERVIEW_FORMAT_CONFIG: ValueFormatConfig = {
  type: 'currency',
  options: { maximumFractionDigits: 2 },
};

export const formatPortfolioValueInDollar = (
  value: number | string,
): string => {
  return formatValueWithConfig(value, PORTFOLIO_OVERVIEW_FORMAT_CONFIG, {
    includePrefixSuffix: true,
  });
};

export const getPortfolioValueInDollarParts = (value: number | string) => {
  return getNumberParts(value, PORTFOLIO_OVERVIEW_FORMAT_CONFIG);
};
