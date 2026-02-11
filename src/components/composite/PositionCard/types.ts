import type { TypographyProps } from '@mui/material/Typography';
import type { TFunction } from 'i18next';
import type { ColumnDefinition } from '@/components/core/ColumnTable/ColumnTable.types';
import type {
  PortfolioPosition,
  ChainPortfolioPosition,
  AppPortfolioPosition,
} from '@/providers/PortfolioProvider/types';
import type { PortfolioBalance, PositionToken } from '@/types/tokens';

export interface PositionCardProps {
  /** Array of positions for this protocol group */
  positions?: PortfolioPosition[];
  /** Callback when a position is selected */
  onSelect?: (position: PortfolioPosition) => void;
  /** Loading state */
  isLoading?: boolean;
}

export interface RenderCellProps<T = PortfolioBalance<PositionToken>> {
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

/**
 * Enhanced balance with position metadata for rendering in tables.
 */
export type EnhancedPositionBalance = PortfolioBalance<PositionToken> &
  Pick<
    PortfolioPosition,
    'latest' | 'earn' | 'protocol' | 'earnInteractionFlags'
  >;

export type SupplySection = TableSection<EnhancedPositionBalance>;
export type BorrowSection = TableSection<EnhancedPositionBalance>;
export type RewardSection = TableSection<EnhancedPositionBalance>;

export type Section = SupplySection | BorrowSection | RewardSection;

export interface PositionGroup {
  position: PortfolioPosition;
  sections: Section[];
}

/**
 * Type guard for chain-based portfolio positions.
 */
export const isChainPortfolioPosition = (
  position: PortfolioPosition,
): position is ChainPortfolioPosition => position.source === 'chain';

/**
 * Type guard for app-based portfolio positions.
 */
export const isAppPortfolioPosition = (
  position: PortfolioPosition,
): position is AppPortfolioPosition => position.source === 'app';
