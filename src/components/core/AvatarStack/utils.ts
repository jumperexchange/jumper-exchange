import type { AvatarOverlap, AvatarStackDirection } from './AvatarStack.types';

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
