import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type {
  TransactionSummaryColumnId,
  TransactionSummaryRowConfig,
} from './types';

// Fits a two-token XL overlay stack so the column width stays constant
// regardless of how many tokens (or none) a transaction has.
const COMPACT_ASSETS_COLUMN_WIDTH = 72;

export const TRANSACTION_SUMMARY_ROW_CONFIG: TransactionSummaryRowConfig = {
  testId: 'transaction-table',
  titleVariant: 'bodySmallStrong',
  descriptionVariant: 'bodyXSmall',
  valueGap: 4,
  tokenSize: AvatarSize.XL,
  badgeSize: AvatarSize.XS,
  inlineBadgeSize: AvatarSize.XS,
  badgeSpacing: -0.8,
  showColumnHeader: true,
  columns: [
    { id: 'amount' },
    { id: 'assetsIn' },
    { id: 'assetsOut' },
    { id: 'action' },
    { id: 'fee' },
    { id: 'date', sx: { textAlign: 'right' } },
  ],
  sections: [
    { columns: [{ id: 'amount' }, { id: 'action' }] },
    { columns: [{ id: 'assetsIn' }, { id: 'assetsOut' }] },
    { columns: [{ id: 'fee' }, { id: 'date' }] },
  ],
} as const;

export const TRANSACTION_SUMMARY_COMPACT_ROW_CONFIG: TransactionSummaryRowConfig =
  {
    ...TRANSACTION_SUMMARY_ROW_CONFIG,
    showColumnHeader: false,
    columns: [
      {
        id: 'assetsIn',
        sx: { flex: '0 0 auto', minWidth: COMPACT_ASSETS_COLUMN_WIDTH },
      },
      { id: 'amount', sx: (theme) => ({ marginLeft: theme.spacing(1.5) }) },
      { id: 'action' },
      { id: 'date', sx: { textAlign: 'right' } },
    ],
    sections: [
      { columns: [{ id: 'action' }] },
      {
        columns: [
          {
            id: 'assetsIn',
            sx: { flex: '0 0 auto', minWidth: COMPACT_ASSETS_COLUMN_WIDTH },
          },
          { id: 'amount' },
        ],
        sx: { gap: 1.5 },
      },
      {
        columns: [
          {
            id: 'date',
            sx: {
              '& > :first-child': {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
              },
            },
          },
        ],
      },
    ],
  };

export const COLUMN_LABEL_KEYS = {
  amount: 'portfolio.transactionSummary.columns.amount',
  action: 'portfolio.transactionSummary.columns.action',
  assetsIn: 'portfolio.transactionSummary.columns.assetIn',
  assetsOut: 'portfolio.transactionSummary.columns.assetOut',
  fee: 'portfolio.transactionSummary.columns.fee',
  date: 'portfolio.transactionSummary.columns.date',
} as const;
