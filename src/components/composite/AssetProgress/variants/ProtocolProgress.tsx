import { FC } from 'react';
import { ProtocolAssetProgressProps } from '../AssetProgress.types';
import { BaseProgress } from './BaseProgress';
import {
  Avatar,
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
        <AvatarSkeleton
          key={protocol.name}
          variant="circular"
          sx={{ height: '100%', width: '100%' }}
        />
      </Avatar>
    </BaseProgress>
  );
};
