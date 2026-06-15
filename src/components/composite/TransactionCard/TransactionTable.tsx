import type { FC } from 'react';
import { TransactionCard } from './components/TransactionCard';
import { TRANSACTION_SUMMARY_ROW_CONFIG } from './constants';
import type {
  PortfolioTransaction,
  TransactionSummaryRowConfig,
} from './types';
import { TransactionSummaryColumnHeader } from './components/TransactionSummaryColumn';
import {
  StyledTableContainer,
  StyledTableHeader,
  StyledValueCell,
} from './TransactionTable.styles';

interface TransactionTableProps {
  transactions: PortfolioTransaction[];
  config?: TransactionSummaryRowConfig;
  showHeader?: boolean;
  onTransactionClick?: (tx: PortfolioTransaction) => void;
}

export const TransactionTable: FC<TransactionTableProps> = ({
  transactions,
  config = TRANSACTION_SUMMARY_ROW_CONFIG,
  showHeader = false,
  onTransactionClick,
}) => (
  <StyledTableContainer>
    {showHeader && (
      <StyledTableHeader>
        {config.columns.map((slot) => (
          <StyledValueCell key={slot.id} sx={slot.sx}>
            <TransactionSummaryColumnHeader
              columnId={slot.id}
              config={config}
            />
          </StyledValueCell>
        ))}
      </StyledTableHeader>
    )}
    {transactions.map((tx) => (
      <TransactionCard
        key={tx.txHash}
        transaction={tx}
        config={config}
        onClick={onTransactionClick}
      />
    ))}
  </StyledTableContainer>
);
