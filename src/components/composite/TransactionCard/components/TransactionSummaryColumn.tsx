import type { FC } from 'react';
import type { TFunction } from 'i18next';
import { TransactionSummaryColumnHeader } from './TransactionSummaryColumnHeader';
import {
  TransactionSummaryActionField,
  TransactionSummaryAmountField,
  TransactionSummaryDateField,
  TransactionSummaryFeeField,
  TransactionTokenStack,
} from './TransactionSummaryFields';
import type { TransactionSummaryContent } from '../hooks';
import type {
  TransactionSummaryColumnId,
  TransactionSummaryRowConfig,
} from '../types';
import { COLUMN_LABEL_KEYS } from '../constants';

interface TransactionSummaryColumnHeaderCellProps {
  columnId: TransactionSummaryColumnId;
  config: TransactionSummaryRowConfig;
  t: TFunction;
}

export const TransactionSummaryColumnHeaderCell: FC<
  TransactionSummaryColumnHeaderCellProps
> = ({ columnId, config, t }) => (
  <TransactionSummaryColumnHeader
    label={t(COLUMN_LABEL_KEYS[columnId])}
    config={config}
  />
);

interface TransactionSummaryColumnValueProps {
  columnId: TransactionSummaryColumnId;
  content: TransactionSummaryContent;
  config: TransactionSummaryRowConfig;
}

export const TransactionSummaryColumnValue: FC<
  TransactionSummaryColumnValueProps
> = ({ columnId, content, config }) => {
  const fieldsConfig = {
    titleVariant: config.titleVariant,
    descriptionVariant: config.descriptionVariant,
    valueGap: config.valueGap,
  };

  switch (columnId) {
    case 'amount':
      return (
        <TransactionSummaryAmountField
          content={content}
          fieldsConfig={fieldsConfig}
        />
      );
    case 'action':
      return (
        <TransactionSummaryActionField
          content={content}
          fieldsConfig={fieldsConfig}
        />
      );
    case 'assetsIn':
      return (
        <TransactionTokenStack
          tokens={content.fromTokens}
          config={{
            tokenSize: config.tokenSize,
            badgeSize: config.badgeSize,
            inlineBadgeSize: config.inlineBadgeSize,
            badgeSpacing: config.badgeSpacing,
          }}
        />
      );
    case 'assetsOut':
      return (
        <TransactionTokenStack
          tokens={content.toTokens}
          config={{
            tokenSize: config.tokenSize,
            badgeSize: config.badgeSize,
            inlineBadgeSize: config.inlineBadgeSize,
            badgeSpacing: config.badgeSpacing,
          }}
        />
      );
    case 'fee':
      return (
        <TransactionSummaryFeeField
          content={content}
          fieldsConfig={fieldsConfig}
        />
      );
    case 'date':
      return (
        <TransactionSummaryDateField
          content={content}
          fieldsConfig={fieldsConfig}
        />
      );
    default:
      return null;
  }
};
