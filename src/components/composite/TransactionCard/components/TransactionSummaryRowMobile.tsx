import type { FC } from 'react';
import { TRANSACTION_SUMMARY_ROW_CONFIG } from '../constants';
import type { TransactionSummaryContent } from '../hooks';
import type { TransactionSummaryRowConfig } from '../types';
import { TransactionSummaryRowSection } from './TransactionSummaryRowSection';
import { StyledRowContainer } from '../TransactionTable.styles';

interface TransactionSummaryRowMobileProps {
  content: TransactionSummaryContent;
  config?: TransactionSummaryRowConfig;
}

export const TransactionSummaryRowMobile: FC<
  TransactionSummaryRowMobileProps
> = ({ content, config = TRANSACTION_SUMMARY_ROW_CONFIG }) => (
  <StyledRowContainer data-testid="transaction-summary-row">
    {config.sections.map((section, sectionIndex) => (
      <TransactionSummaryRowSection
        key={sectionIndex}
        section={section}
        content={content}
        config={config}
      />
    ))}
  </StyledRowContainer>
);
