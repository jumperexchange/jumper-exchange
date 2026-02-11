import type { FC } from 'react';
import { EntityProgress } from './components/EntityProgress';
import { TextProgress } from './components/TextProgress';
import type {
  AssetProgressProps,
  EntityAssetProgressProps,
  TextAssetProgressProps,
} from './types';
import { AssetProgressVariant } from './types';

export const AssetProgress: FC<AssetProgressProps> = ({ variant, ...rest }) => {
  if (variant === AssetProgressVariant.Entity) {
    return (
      <EntityProgress
        {...(rest as Omit<EntityAssetProgressProps, 'variant'>)}
      />
    );
  }
  return (
    <TextProgress {...(rest as Omit<TextAssetProgressProps, 'variant'>)} />
  );
};
