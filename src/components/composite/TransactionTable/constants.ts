import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { TransactionSummaryRowConfig } from './types';

export const NFT_TOKEN_URL =
  'https://static.debank.com/image/eth_nft/local_url/2a035fec5441cb85b98db0a8ebb46c62/191e91adff47463d2f9b37e6b255e2bb.svg';

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
    { id: 'assetsIn' },
    { id: 'assetsOut' },
    { id: 'action' },
    { id: 'fee' },
    { id: 'date', sx: { textAlign: 'right' } },
  ],
  sections: [
    { columns: [{ id: 'action' }] },
    { columns: [{ id: 'assetsIn' }, { id: 'assetsOut' }] },
    { columns: [{ id: 'fee' }, { id: 'date' }] },
  ],
} as const;

export const TRANSACTION_SUMMARY_COMPACT_ROW_CONFIG: TransactionSummaryRowConfig =
  {
    ...TRANSACTION_SUMMARY_ROW_CONFIG,
    showColumnHeader: false,
    columns: [
      { id: 'assetsIn' },
      { id: 'action' },
      { id: 'date', sx: { textAlign: 'right' } },
    ],
    sections: [
      { columns: [{ id: 'action' }] },
      { columns: [{ id: 'assetsIn' }] },
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
