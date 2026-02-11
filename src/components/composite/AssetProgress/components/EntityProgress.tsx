import type { FC } from 'react';
import { EntityAvatar } from '../../EntityAvatar/EntityAvatar';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { BaseProgress } from './BaseProgress';
import type { EntityAssetProgressProps } from '../types';

export const EntityProgress: FC<Omit<EntityAssetProgressProps, 'variant'>> = ({
  entity,
  progress,
  amount,
}) => {
  return (
    <BaseProgress progress={progress} amount={amount}>
      <EntityAvatar entity={entity} size={AvatarSize.XXL} disableBorder />
    </BaseProgress>
  );
};
