import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { TransactionSummaryContent } from '../hooks';
import type {
  TransactionSummaryRowConfig,
  TransactionSummarySection,
} from '../types';
import {
  TransactionSummaryColumnHeaderCell,
  TransactionSummaryColumnValue,
} from './TransactionSummaryColumn';
import {
  StyledPairRow,
  StyledRowSection,
  StyledValueCell,
} from '../TransactionTable.styles';
import { getTransactionSummaryColumnTestId } from '../utils';

interface TransactionSummaryRowSectionProps {
  section: TransactionSummarySection;
  content: TransactionSummaryContent;
  config: TransactionSummaryRowConfig;
}

export const TransactionSummaryRowSection: FC<
  TransactionSummaryRowSectionProps
> = ({ section, content, config }) => {
  const { t } = useTranslation();

  return (
    <StyledRowSection>
      {config.showColumnHeader && (
        <StyledPairRow>
          {section.columns.map((slot) => (
            <StyledValueCell key={slot.id} sx={slot.sx}>
              <TransactionSummaryColumnHeaderCell
                columnId={slot.id}
                config={config}
                t={t}
              />
            </StyledValueCell>
          ))}
        </StyledPairRow>
      )}
      <StyledPairRow sx={section.sx}>
        {section.columns.map((slot) => (
          <StyledValueCell
            key={slot.id}
            data-testid={getTransactionSummaryColumnTestId(slot.id)}
            sx={slot.sx}
          >
            <TransactionSummaryColumnValue
              columnId={slot.id}
              content={content}
              config={config}
            />
          </StyledValueCell>
        ))}
      </StyledPairRow>
    </StyledRowSection>
  );
};
