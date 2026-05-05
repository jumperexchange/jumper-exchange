import { type FC, useState } from 'react';
import {
  Avatar,
  AvatarSkeleton,
  AvatarPlaceholder,
} from './AvatarStack.styles';
import type {
  AvatarCountItemProps,
  AvatarImageItemProps,
  AvatarItemProps,
} from './AvatarStack.types';
import { isAvatarCountItem, isAvatarImageItem } from './utils';
import Typography from '@mui/material/Typography';
import { mergeSx } from '@/utils/theme/mergeSx';
import { useGetContrastBgColor } from '@/hooks/images/useGetContrastBgColor';

export const AvatarImage: FC<AvatarImageItemProps> = ({
  avatar,
  size,
  spacing,
  overlap = 'right',
  sx,
}) => {
  const [imageStatus, setImageStatus] = useState<
    'loading' | 'loaded' | 'error'
  >('loading');

  const handleLoad = () => setImageStatus('loaded');
  const handleError = () => setImageStatus('error');

  const { contrastBgColor } = useGetContrastBgColor(avatar?.src || '');

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
      sx={mergeSx(
        sx,
        !showPlaceholder
          ? { backgroundColor: `${contrastBgColor} !important` }
          : {},
      )}
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

export const AvatarCount: FC<AvatarCountItemProps> = ({
  avatar,
  size,
  spacing,
  overlap = 'right',
  sx,
}) => {
  const content = `${avatar.startAdornment ?? ''}${avatar.count}${avatar.endAdornment ?? ''}`;
  return (
    <Avatar
      size={size}
      spacing={spacing}
      overlap={overlap}
      variant="circular"
      sx={mergeSx(sx, (theme) => ({
        position: 'relative',
        '&.MuiAvatar-root': {
          background: (theme.vars || theme).palette.primary.main,
          borderRadius: theme.shape.radiusRoundedFull,
        },
      }))}
    >
      <Typography
        variant={avatar.variant ?? 'bodyMediumStrong'}
        color="white"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {content}
      </Typography>
    </Avatar>
  );
};

export const AvatarItem: FC<AvatarItemProps> = (props) => {
  if (isAvatarCountItem(props)) {
    return <AvatarCount {...props} />;
  }
  if (isAvatarImageItem(props)) {
    return <AvatarImage {...props} />;
  }

  return <AvatarSkeleton size={props.size} variant="circular" />;
};
