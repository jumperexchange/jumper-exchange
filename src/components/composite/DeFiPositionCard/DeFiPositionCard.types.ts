import { TypographyProps } from '@mui/material/Typography';
import { TFunction } from 'i18next';
import { ColumnDefinition } from 'src/components/core/ColumnTable/ColumnTable.types';
import {
  EarnOpportunityRewardEntity,
  MinimalDeFiPosition,
} from 'src/types/defi';

export interface DeFiPositionCardProps {
  defiPosition?: MinimalDeFiPosition;
  onSelect?: (defiPosition: MinimalDeFiPosition) => void;
  isLoading?: boolean;
}

export interface EntityItem extends Pick<MinimalDeFiPosition, 'asset'> {}

export interface ValueItem
  extends Pick<MinimalDeFiPosition, 'totalPriceUSD' | 'balance' | 'asset'> {}

export interface ApyItem extends Pick<MinimalDeFiPosition, 'latest'> {}

export interface RenderCellProps<T = any> {
  item: T;
  titleVariant: TypographyProps['variant'];
  descriptionVariant: TypographyProps['variant'];
  t: TFunction;
  isMobile: boolean;
}

export interface TableSection<T> {
  id: string;
  type: 'position' | 'rewards';
  data: T[];
  columns: ColumnDefinition<T>[];
  showHeader: boolean;
}

export type PositionSection = TableSection<MinimalDeFiPosition>;
export type RewardSection = TableSection<EarnOpportunityRewardEntity>;

export type Section = PositionSection | RewardSection;

export interface PositionGroup {
  position: MinimalDeFiPosition;
  sections: Section[];
}
