import { useTranslation } from 'react-i18next';
import { ExtendedToken, isPortfolioToken, Token } from '../types/tokens';

export const useTokenDisplay = () => {
  const { t } = useTranslation();

  formatAmount(amount: string | number | bigint) {
    if (typeof amount == 'number' && !Number.isInteger(amount)) {
      console.error(`Token formatAmount: number ${amount} is not an integer`);
    }
    return this.formatTokenWithSymbol(
      formatTokenAmount(BigInt(amount), this.decimals),
    );
  }
};
