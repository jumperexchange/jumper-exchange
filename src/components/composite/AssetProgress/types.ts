import type { DisplayableEntity } from '../EntityAvatar/types';

export enum AssetProgressVariant {
  Entity = 'entity',
  Text = 'text',
}

export interface BaseAssetProgressProps {
  progress: number;
  amount: number;
}

export interface EntityAssetProgressProps extends BaseAssetProgressProps {
  variant: AssetProgressVariant.Entity;
  entity: DisplayableEntity;
}

export interface TextAssetProgressProps extends BaseAssetProgressProps {
  variant: AssetProgressVariant.Text;
  text: string;
}

export type AssetProgressProps =
  | EntityAssetProgressProps
  | TextAssetProgressProps;
