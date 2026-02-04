import { type FC, useState } from 'react';
import {
  Avatar,
  AvatarSkeleton,
  AvatarPlaceholder,
} from './AvatarStack.styles';
import type {
  AvatarData,
  AvatarOverlap,
  AvatarSize,
} from './AvatarStack.types';

interface AvatarItemProps {
  avatar: AvatarData;
  size?: AvatarSize;
  spacing?: number;
  overlap?: AvatarOverlap;
}

export const AvatarItem: FC<AvatarItemProps> = ({
  avatar,
  size,
  spacing,
  overlap = 'right',
}) => {
  const [imageStatus, setImageStatus] = useState<
    'loading' | 'loaded' | 'error'
  >('loading');

  const handleLoad = () => setImageStatus('loaded');
  const handleError = () => setImageStatus('error');

  const showPlaceholder =
    (imageStatus === 'error' || !avatar.src) && avatar.alt;

  return (
    <Avatar
      size={size}
      spacing={spacing}
      src={avatar.src}
      alt={avatar.alt}
      overlap={overlap}
      variant="circular"
      slotProps={{
        img: {
          loading: 'lazy',
          onLoadCapture: handleLoad,
          onErrorCapture: handleError,
        },
      }}
    >
      {showPlaceholder ? (
        <AvatarPlaceholder size={size} color="textSecondary">
          {avatar.alt[0].toUpperCase()}
        </AvatarPlaceholder>
      ) : (
        <AvatarSkeleton size={size} variant="circular" />
      )}
    </Avatar>
  );
};
