import type { FC } from 'react';
import { TRANSACTION_SUMMARY_ROW_CONFIG } from '../constants';
import type { TransactionSummaryContent } from '../hooks';
import type { TransactionSummaryRowConfig } from '../types';
import { TransactionSummaryColumnValue } from './TransactionSummaryColumn';
import { StyledDesktopRow, StyledValueCell } from '../TransactionTable.styles';
import { getTransactionSummaryColumnTestId } from '../utils';

interface TransactionSummaryRowDesktopProps {
  content: TransactionSummaryContent;
  config?: TransactionSummaryRowConfig;
}

export const TransactionSummaryRowDesktop: FC<
  TransactionSummaryRowDesktopProps
> = ({ content, config = TRANSACTION_SUMMARY_ROW_CONFIG }) => (
  <StyledDesktopRow data-testid="transaction-summary-row">
    {config.columns.map((slot) => (
      <StyledValueCell
        key={slot.id}
        data-testid={getTransactionSummaryColumnTestId(slot.id, config.testId)}
        sx={slot.sx}
      >
        <TransactionSummaryColumnValue
          columnId={slot.id}
          content={content}
          config={config}
        />
      </StyledValueCell>
    ))}
  </StyledDesktopRow>
);
