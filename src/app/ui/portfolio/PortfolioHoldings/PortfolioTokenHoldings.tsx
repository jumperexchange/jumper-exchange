import { useHoldingsFiltering } from '@/providers/PortfolioProvider/filtering/HoldingsFilteringContext';
import { usePortfolioSummary } from '@/providers/PortfolioProvider/PortfolioContext';
import { TokenSummaryRow } from '@/components/composite/BalanceCard/components/TokenSummaryRow';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import { PortfolioHoldingsSection } from './PortfolioHoldingsSection';
import { useHoldingAmountProgress } from './useHoldingAmountProgress';
import { defaultConfig } from './constants';
import type { FC } from 'react';

const getTokenValue = (balance: PortfolioBalance<WalletToken>) =>
  balance.amountUSD;

interface PortfolioTokenHoldingsProps {
  title: string;
}

export const PortfolioTokenHoldings: FC<PortfolioTokenHoldingsProps> = ({
  title,
}) => {
  const {
    balancesData: data,
    balancesIsLoading: isLoading,
    balancesIsEmpty: isEmpty,
  } = useHoldingsFiltering();
  const { totalPortfolioUsd } = usePortfolioSummary();

  const balanceGroups = Object.entries(data);
  const { amount, progress } = useHoldingAmountProgress(
    balanceGroups,
    getTokenValue,
    totalPortfolioUsd,
  );

  return (
    <PortfolioHoldingsSection
      title={title}
      amount={amount}
      progress={progress}
      shouldExpand={!isEmpty || isLoading}
      isLoading={isLoading}
      items={balanceGroups}
      renderItem={([, balances]) => (
        <TokenSummaryRow balances={balances} config={defaultConfig} />
      )}
    />
  );
};
