import type { FC } from 'react';
import type { ProtocolAssetProgressProps } from '../AssetProgress.types';
import { BaseProgress } from './BaseProgress';
import {
  Avatar,
  AvatarPlaceholder,
  AvatarSkeleton,
} from 'src/components/core/AvatarStack/AvatarStack.styles';

export const ProtocolProgress: FC<
  Omit<ProtocolAssetProgressProps, 'variant'>
> = ({ protocol, progress, amount }) => {
  return (
    <BaseProgress progress={progress} amount={amount}>
      <Avatar
        key={protocol.name}
        src={protocol.logo}
        alt={protocol.name}
        disableBorder
        variant="circular"
      >
        {protocol.name ? (
          <AvatarPlaceholder color="textSecondary">
            {protocol.name[0].toUpperCase()}
          </AvatarPlaceholder>
        ) : null}
        <AvatarSkeleton
          key={protocol.name}
          variant="circular"
          sx={{ height: '100%', width: '100%' }}
        />
      </Avatar>
    </BaseProgress>
  );
};
