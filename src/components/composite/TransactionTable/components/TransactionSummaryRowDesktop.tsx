import type { FC } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { TRANSACTION_SUMMARY_ROW_CONFIG } from '../constants';
import type {
  TransactionSummaryRowConfig,
  TransactionSummaryRowProps,
} from '../types';
import { COLUMN_DEFINITIONS } from './TransactionSummaryColumn';
import { StyledDesktopRow, StyledValueCell } from '../TransactionTable.styles';
import { getTransactionSummaryColumnTestId } from '../utils';

export const TransactionSummaryRowDesktopSkeleton: FC<{
  config: TransactionSummaryRowConfig;
}> = ({ config }) => (
  <StyledDesktopRow>
    {config.columns.map((slot) => (
      <StyledValueCell
        key={slot.id}
        sx={
          [
            slot.sx,
            COLUMN_DEFINITIONS[slot.id].skeletonCellSx,
          ] as SxProps<Theme>
        }
      >
        {COLUMN_DEFINITIONS[slot.id].renderSkeleton(config)}
      </StyledValueCell>
    ))}
  </StyledDesktopRow>
);

export const TransactionSummaryRowDesktop: FC<TransactionSummaryRowProps> = ({
  content,
  config = TRANSACTION_SUMMARY_ROW_CONFIG,
}) => (
  <StyledDesktopRow data-testid="transaction-summary-row">
    {config.columns.map((slot) => (
      <StyledValueCell
        key={slot.id}
        data-testid={getTransactionSummaryColumnTestId(slot.id, config.testId)}
        sx={slot.sx}
      >
        {COLUMN_DEFINITIONS[slot.id].render(content, config)}
      </StyledValueCell>
    ))}
  </StyledDesktopRow>
);
