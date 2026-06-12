import type { SxProps, Theme } from '@mui/material/styles';
import type { TypographyProps } from '@mui/material/Typography';
import type { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { BalanceDto, TransactionsDto } from '@/types/jumper-backend';

export type TransactionOperationType = TransactionsDto['action'];

export type TransactionBalance = BalanceDto;

export type PortfolioTransaction = TransactionsDto;

export type TransactionSummaryColumnId =
  | 'amount'
  | 'assetsIn'
  | 'assetsOut'
  | 'action'
  | 'fee'
  | 'date';

export interface TransactionSummaryColumnSlot {
  id: TransactionSummaryColumnId;
  sx?: SxProps<Theme>;
}

export interface TransactionSummarySection {
  columns: readonly TransactionSummaryColumnSlot[];
  sx?: SxProps<Theme>;
}

export interface TransactionSummaryRowConfig {
  titleVariant: TypographyProps['variant'];
  descriptionVariant: TypographyProps['variant'];
  valueGap: number;
  tokenSize: AvatarSize;
  badgeSize: AvatarSize;
  inlineBadgeSize: AvatarSize;
  badgeSpacing: number;
  columns: readonly TransactionSummaryColumnSlot[];
  sections: readonly TransactionSummarySection[];
  showColumnHeader: boolean;
  testId?: string;
}
