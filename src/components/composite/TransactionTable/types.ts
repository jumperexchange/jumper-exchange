import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TypographyProps } from '@mui/material/Typography';
import type { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { Token } from '@/types/tokens';
import type {
  BalanceDto,
  NftDto,
  TokenDto,
  TransactionsDto,
} from '@/types/jumper-backend';

export const isTokenDto = (token: TokenDto | NftDto): token is TokenDto =>
  'symbol' in token;

export const isNftDto = (token: TokenDto | NftDto): token is NftDto =>
  'tokenId' in token;

export interface NftBalance {
  address: string;
  chainId: number;
  tokenId: string;
  amount: number;
  amountUsd?: number | null;
}

export type TransactionOperationType = TransactionsDto['action'];

export type TransactionBalance = BalanceDto;

export type PortfolioTransaction = TransactionsDto;

export type TransactionSummaryColumnId =
  | 'assetsIn'
  | 'assetsOut'
  | 'action'
  | 'fee'
  | 'date'
  | 'txHash';

export interface TransactionSummaryColumnSlot {
  id: TransactionSummaryColumnId;
  sx?: SxProps<Theme>;
}

export interface TransactionSummarySection {
  columns: readonly TransactionSummaryColumnSlot[];
  sx?: SxProps<Theme>;
}

export interface TransactionSummaryTokenConfig {
  tokenSize: AvatarSize;
  badgeSize: AvatarSize;
  inlineBadgeSize: AvatarSize;
  badgeSpacing: number;
}

export interface TransactionSummaryRowConfig extends TransactionSummaryTokenConfig {
  titleVariant: TypographyProps['variant'];
  descriptionVariant: TypographyProps['variant'];
  valueGap: number;
  columns: readonly TransactionSummaryColumnSlot[];
  sections: readonly TransactionSummarySection[];
  showColumnHeader: boolean;
  testId?: string;
}

export interface TransactionSummaryContent {
  fromAmountTitle: string;
  fromAmountHints: string[];
  toAmountTitle: string;
  toAmountHints: string[];
  actionTitle: string;
  feeTitle: string;
  feeHint?: string;
  dateTitle: string;
  dateHint: string;
  txHash: string;
  chainId: number;
  protocolName?: string;
  protocolIcon?: string;
  fromTokens: Token[];
  toTokens: Token[];
  fromNfts: NftBalance[];
  toNfts: NftBalance[];
}

export type TransactionSummaryRenderFn = (
  content: TransactionSummaryContent,
  config: TransactionSummaryRowConfig,
) => ReactNode;

export type TransactionSummarySkeletonFn = (
  config: TransactionSummaryRowConfig,
) => ReactNode;

export interface TransactionSummaryBaseProps {
  config?: TransactionSummaryRowConfig;
}

export interface TransactionSummaryRowProps extends TransactionSummaryBaseProps {
  content: TransactionSummaryContent;
}
