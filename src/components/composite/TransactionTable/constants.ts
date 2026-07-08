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
    { id: 'date' },
    { id: 'action' },
    { id: 'assetsIn', sx: { flex: 1.5 } },
    { id: 'assetsOut', sx: { flex: 1.5 } },
    { id: 'fee' },
    { id: 'txHash', sx: { textAlign: 'right', alignItems: 'flex-end' } },
  ],
  sections: [
    { columns: [{ id: 'date' }, { id: 'action' }] },
    { columns: [{ id: 'assetsIn' }, { id: 'assetsOut' }] },
    { columns: [{ id: 'fee' }, { id: 'txHash' }] },
  ],
} as const;

export const TRANSACTION_SUMMARY_COMPACT_ROW_CONFIG: TransactionSummaryRowConfig =
  {
    ...TRANSACTION_SUMMARY_ROW_CONFIG,
    showColumnHeader: false,
    columns: [{ id: 'date' }, { id: 'action' }, { id: 'assetsIn' }],
    sections: [
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
          { id: 'action' },
        ],
      },
      { columns: [{ id: 'assetsIn' }] },
    ],
  };
