import uniqBy from 'lodash/uniqBy';
import compact from 'lodash/compact';
import isObject from 'lodash/isObject';
import type { ResponsiveValue } from '@/types/responsive';
import type { Chain } from '@/types/jumper-backend';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';

export const getResponsiveValue = <T>(
  value: ResponsiveValue<T>,
  isMobile: boolean,
): T => {
  if (isObject(value) && 'mobile' in value) {
    return isMobile ? value.mobile : value.desktop;
  }
  return value as T;
};

export const getUniqueChains = (
  balances: PortfolioBalance<WalletToken>[],
): Chain[] =>
  uniqBy(
    compact(
      balances.map((b) =>
        b.token.chainKey
          ? { chainId: b.token.chainId, chainKey: b.token.chainKey }
          : null,
      ),
    ),
    'chainId',
  );
