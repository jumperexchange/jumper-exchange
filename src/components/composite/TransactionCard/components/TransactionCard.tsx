import type { FC } from 'react';
import type {
  PortfolioTransaction,
  TransactionSummaryRowConfig,
} from '../types';
import { TransactionSummaryRow } from './TransactionSummaryRow';
import { StyledCard } from '../TransactionTable.styles';

interface TransactionCardProps {
  transaction: PortfolioTransaction;
  config?: TransactionSummaryRowConfig;
  onClick?: (transaction: PortfolioTransaction) => void;
}

export const TransactionCard: FC<TransactionCardProps> = ({
  transaction,
  config,
  onClick,
}) => (
  <StyledCard
    tabIndex={0}
    role="button"
    onClick={() => onClick?.(transaction)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(transaction);
      }
    }}
  >
    <TransactionSummaryRow transaction={transaction} config={config} />
  </StyledCard>
);
