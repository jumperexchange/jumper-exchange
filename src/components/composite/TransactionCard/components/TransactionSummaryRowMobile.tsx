import type { FC } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { TRANSACTION_SUMMARY_ROW_CONFIG } from '../constants';
import type {
  TransactionSummaryRowConfig,
  TransactionSummaryRowProps,
} from '../types';
import {
  COLUMN_DEFINITIONS,
  TransactionSummaryColumnHeader,
} from './TransactionSummaryColumn';
import {
  StyledPairRow,
  StyledRowContainer,
  StyledRowSection,
  StyledValueCell,
} from '../TransactionTable.styles';
import { getTransactionSummaryColumnTestId } from '../utils';

export const TransactionSummaryRowMobileSkeleton: FC<{
  config: TransactionSummaryRowConfig;
}> = ({ config }) => (
  <StyledRowContainer>
    {config.sections.map((section, i) => (
      <StyledRowSection key={i}>
        <StyledPairRow sx={section.sx}>
          {section.columns.map((slot) => (
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
        </StyledPairRow>
      </StyledRowSection>
    ))}
  </StyledRowContainer>
);

export const TransactionSummaryRowMobile: FC<TransactionSummaryRowProps> = ({
  content,
  config = TRANSACTION_SUMMARY_ROW_CONFIG,
}) => (
  <StyledRowContainer data-testid="transaction-summary-row">
    {config.sections.map((section, i) => (
      <StyledRowSection key={i}>
        {config.showColumnHeader && (
          <StyledPairRow>
            {section.columns.map((slot) => (
              <StyledValueCell key={slot.id} sx={slot.sx}>
                <TransactionSummaryColumnHeader
                  columnId={slot.id}
                  config={config}
                />
              </StyledValueCell>
            ))}
          </StyledPairRow>
        )}
        <StyledPairRow sx={section.sx}>
          {section.columns.map((slot) => (
            <StyledValueCell
              key={slot.id}
              data-testid={getTransactionSummaryColumnTestId(
                slot.id,
                config.testId,
              )}
              sx={slot.sx}
            >
              {COLUMN_DEFINITIONS[slot.id].render(content, config)}
            </StyledValueCell>
          ))}
        </StyledPairRow>
      </StyledRowSection>
    ))}
  </StyledRowContainer>
);
