import type { PortfolioToken } from 'src/types/tokens';
import { useMemo } from 'react';

export const useFormatDisplayWalletTokens = (
  data?: PortfolioToken[],
): PortfolioToken[] => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    return data;
  }, [data]);
};
