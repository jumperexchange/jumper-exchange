import type { ResponsiveValue } from './TokenListCard.types';

export const getResponsiveValue = <T>(
  value: ResponsiveValue<T>,
  isMobile: boolean,
): T => {
  if (typeof value === 'object' && value !== null && 'mobile' in value) {
    return isMobile ? value.mobile : value.desktop;
  }
  return value as T;
};
