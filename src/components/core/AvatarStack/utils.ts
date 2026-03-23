import type {
  AvatarCountItemProps,
  AvatarImageItemProps,
  AvatarItemProps,
  AvatarOverlap,
  AvatarStackDirection,
} from './AvatarStack.types';

export const getOverlapFromDirection = (
  direction: AvatarStackDirection,
  disableBorder: boolean,
): AvatarOverlap => {
  if (disableBorder) {
    return 'none';
  }
  switch (direction) {
    case 'row':
      return 'right';
    case 'column':
      return 'bottom';
    case 'row-reverse':
      return 'left';
    case 'column-reverse':
      return 'top';
    default:
      return 'right';
  }
};

export const isAvatarCountItem = (
  props: AvatarItemProps,
): props is AvatarCountItemProps => {
  return 'count' in props.avatar;
};

export const isAvatarImageItem = (
  props: AvatarItemProps,
): props is AvatarImageItemProps => {
  return 'src' in props.avatar;
};
