import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionCard } from './components/TransactionCard';
import { TRANSACTION_SUMMARY_ROW_CONFIG } from './constants';
import type {
  PortfolioTransaction,
  TransactionSummaryRowConfig,
} from './types';
import { TransactionSummaryColumnHeaderCell } from './components/TransactionSummaryColumn';
import {
  StyledTableContainer,
  StyledTableHeader,
  StyledValueCell,
} from './TransactionTable.styles';

interface TransactionTableHeaderProps {
  config: TransactionSummaryRowConfig;
}

const TransactionTableHeader: FC<TransactionTableHeaderProps> = ({
  config,
}) => {
  const { t } = useTranslation();
  return (
    <StyledTableHeader>
      {config.columns.map((slot) => (
        <StyledValueCell key={slot.id} sx={slot.sx}>
          <TransactionSummaryColumnHeaderCell
            columnId={slot.id}
            config={config}
            t={t}
          />
        </StyledValueCell>
      ))}
    </StyledTableHeader>
  );
};

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
    {showHeader && <TransactionTableHeader config={config} />}
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
