import type { TypographyProps } from '@mui/material/Typography';
import type { TFunction } from 'i18next';
import type { ColumnDefinition } from 'src/components/core/ColumnTable/ColumnTable.types';
import type { AppToken, DefiToken } from 'src/types/jumper-backend';
import type { DefiPosition } from '@/utils/positions/type-guards';

export interface DeFiPositionCardProps {
  defiPositions?: DefiPosition[];
  onSelect?: (defiPosition: DefiPosition) => void;
  isLoading?: boolean;
}

export interface RenderCellProps<T = DefiToken> {
  item: T;
  titleVariant: TypographyProps['variant'];
  descriptionVariant: TypographyProps['variant'];
  t: TFunction;
  isMobile: boolean;
}

export interface TableSection<T> {
  id: string;
  type: 'supply' | 'borrow' | 'rewards';
  data: T[];
  columns: ColumnDefinition<T>[];
  showHeader: boolean;
}

export type EnhancedDefiTokenWithPositionData = (DefiToken | AppToken) &
  Pick<DefiPosition, 'latest' | 'earn' | 'protocol' | 'earnInteractionFlags'>;

export type SupplySection = TableSection<EnhancedDefiTokenWithPositionData>;
export type BorrowSection = TableSection<EnhancedDefiTokenWithPositionData>;
export type RewardSection = TableSection<EnhancedDefiTokenWithPositionData>;

export type Section = SupplySection | BorrowSection | RewardSection;

export interface PositionGroup {
  position: DefiPosition;
  sections: Section[];
}
