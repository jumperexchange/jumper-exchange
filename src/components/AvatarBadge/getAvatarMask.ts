/**
 * Generates a dynamic avatar mask that positions a badge based on the avatar size and optional badge gap/offset.
 *
 * The mask uses a radial gradient to blend the badge into the avatar, simulating the appearance of the badge
 * partially overlapping the avatar's edge. The function also allows specifying a gap between the avatar and badge,
 * along with custom x/y offsets for fine-tuning positioning.
 *
 * @param {number} avatarSize - The size of the avatar in pixels (e.g. 44, 32).
 * @param {number} badgeSize - The size of the badge in pixels (e.g. 12).
 * @param {BadgeOffsetProps} [badgeOffset] - Optional x and y offset values to adjust the badge's position.
 * @param {number} [badgeGap] - Optional gap between the avatar and badge, defaults to a quarter of the badge size.
 * @returns {string} The radial gradient mask for the avatar.
 *
 * The `badgeGap` introduces space between the avatar and badge by modifying the badge's radius.
 * If `badgeGap` is not provided, a default value of 25% of the badge size is used.
 *
 * Example usage:
 * ```
 * getAvatarMask({
 *   avatarSize: 44,
 *   badgeSize: 12,
 *   badgeOffset: { x: 4, y: 4 },
 *   badgeGap: 2,
 * });
 * ```
 */

import type { BadgeOffsetProps } from './AvatarBadge';

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
      ? (badgeSize + badgeGap * 2) / 2
      : (badgeSize + badgeSize / 4) / 2; // Badge radius with default gap if not provided
  const badgeOffsetX =
    avatarSize - badgeSize / 2 + (!!badgeOffset?.x ? badgeOffset?.x : 0);
  const badgeOffsetY =
    avatarSize - badgeSize / 2 + (!!badgeOffset?.y ? badgeOffset?.y : 0);
  console.log(badgeOffset?.y, badgeOffset || 13);
  return `radial-gradient(circle ${badgeRadius}px at calc(${badgeOffsetX}px) calc(${badgeOffsetY}px), #fff0 96%, #fff) 100% 100% / 100% 100% no-repeat`;
};
