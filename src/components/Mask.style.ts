/**
 * Generates an avatar mask dynamically based on avatar size
 * @param {number} avatarSize The size of the avatar in pixels (e.g. 44, 32)
 * @param {number} badgeSize The size of the badge in pixels (e.g. 12)
 * @returns {string} The radial gradient mask
 */

import type { BadgeOffsetProps } from './AvatarBadge/AvatarBadge';

interface GetAvatarMask {
  avatarSize: number;
  badgeSize: number;
  badgeOffset?: BadgeOffsetProps;
  badgeGap?: number;
}

export const getAvatarMask = ({
  avatarSize,
  badgeSize,
  badgeOffset,
  badgeGap,
}: GetAvatarMask) => {
  const badgeRadius =
    badgeGap !== undefined
      ? (badgeSize + badgeGap) / 2
      : (badgeSize + badgeSize / 4) / 2; // Badge radius with default gap if not provided
  const badgeOffsetX = avatarSize - badgeSize / 2 + (badgeOffset?.x || 0);
  const badgeOffsetY = avatarSize - badgeSize / 2 + (badgeOffset?.y || 0);

  return `radial-gradient(circle ${badgeRadius}px at calc(${badgeOffsetX}px) calc(${badgeOffsetY}px), #fff0 96%, #fff) 100% 100% / 100% 100% no-repeat`;
};
