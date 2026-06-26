import type { FC } from 'react';
import { DataTable } from '@/components/composite/DataTable/DataTable';
import type { ColumnDef } from '@/components/composite/DataTable/DataTable.types';
import { TransactionCard } from './components/TransactionCard';
import { TRANSACTION_SUMMARY_ROW_CONFIG } from './constants';
import { TransactionSummaryColumnHeader } from './components/TransactionSummaryColumn';
import type {
  PortfolioTransaction,
  TransactionSummaryRowConfig,
} from './types';

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
}) => {
  const headerColumns = config.columns.map<ColumnDef<PortfolioTransaction>>(
    (slot) => ({
      id: slot.id,
      header: (
        <TransactionSummaryColumnHeader columnId={slot.id} config={config} />
      ),
      cellSx: slot.sx,
    }),
  );

  return (
    <DataTable
      rows={transactions}
      columns={headerColumns}
      getRowKey={(tx) => tx.txHash}
      hasMobileView
      showHeader={showHeader}
      renderRow={(tx) => (
        <TransactionCard
          key={tx.txHash}
          transaction={tx}
          config={config}
          onClick={onTransactionClick}
        />
      )}
    />
  );
};
