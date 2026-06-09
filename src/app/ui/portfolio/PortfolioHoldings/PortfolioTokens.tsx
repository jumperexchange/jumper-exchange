import { useBalancesFiltering } from '@/providers/PortfolioProvider/filtering/BalancesFilteringContext';
import { usePortfolioSummary } from '@/providers/PortfolioProvider/PortfolioContext';
import { TokenSummaryRow } from '@/components/composite/BalanceCard/components/TokenSummaryRow';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import { PortfolioHoldingsSection } from './PortfolioHoldingsSection';
import { HoldingItemRow } from './HoldingItemRow';
import { useHoldingAmountProgress } from './useHoldingAmountProgress';
import { defaultConfig } from './constants';

const getTokenValue = (balance: PortfolioBalance<WalletToken>) =>
  balance.amountUSD;

export const PortfolioTokens = () => {
  const { data, isLoading, isEmpty } = useBalancesFiltering();
  const { totalPortfolioUsd } = usePortfolioSummary();

  const balanceGroups = Object.entries(data);
  const { amount, progress } = useHoldingAmountProgress(
    balanceGroups,
    getTokenValue,
    totalPortfolioUsd,
  );

  return (
    <PortfolioHoldingsSection
      title="Tokens"
      amount={amount}
      progress={progress}
      shouldExpand={!isEmpty || isLoading}
      isLoading={isLoading}
    >
      {balanceGroups.map(([symbol, balances]) => (
        <HoldingItemRow key={symbol}>
          <TokenSummaryRow balances={balances} config={defaultConfig} />
        </HoldingItemRow>
      ))}
    </PortfolioHoldingsSection>
  );
};
