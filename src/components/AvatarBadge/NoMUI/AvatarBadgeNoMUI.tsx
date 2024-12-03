/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

interface BadgeOffsetProps {
  x?: number;
  y?: number;
}

type AvatarBadgeNoMUIProps = {
  avatarSrc?: string;
  badgeSrc?: string;
  badgeOffset?: BadgeOffsetProps;
  avatarSize: number;
  badgeGap?: number;
  badgeSize: number;
  theme?: 'light' | 'dark';
};

export const AvatarBadgeNoMUI = ({
  avatarSrc,
  badgeSrc,
  badgeOffset,
  badgeGap,
  avatarSize,
  badgeSize,
  theme,
}: AvatarBadgeNoMUIProps) => {
  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          width: 40,
          height: 40,
          position: 'relative', // Remove absolute positioning
        }}
      >
        <img
          src={avatarSrc}
          width={avatarSize}
          height={avatarSize}
          style={{
            borderRadius: '50%',
            height: avatarSize,
            width: avatarSize,
            // maskImage: 'linear-gradient(to bottom, transparent 25%, black 75%)',
            mask: `radial-gradient(circle 10.5px at calc(34px) calc(34px), #fff0 96%, #fff) 100% 100% / 100% 100% no-repeat`, //getAvatarMask({ avatarSize, badgeSize, badgeOffset, badgeGap }), // Apply dynamic mask based on avatar and badge size
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: badgeSize + (badgeGap || 0),
            height: badgeSize + (badgeGap || 0),
            borderColor: 'transparent',
            borderRadius: '50%',
            ...((badgeOffset?.x || badgeOffset?.y) && {
              transform: `translate(${badgeOffset?.x ? badgeOffset.x + (badgeGap ? badgeGap / 2 : 0) : 0}px, ${badgeOffset?.y ? badgeOffset.y + (badgeGap ? badgeGap / 2 : 0) : 0}px)`,
            }),
            background: theme === 'dark' ? '#24203D' : '#ffffff',
          }}
        ></div>
        <img
          src={badgeSrc}
          width={badgeSize}
          height={badgeSize}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            borderRadius: '50%',
            ...((badgeOffset?.x || badgeOffset?.y) && {
              transform: `translate(${badgeOffset?.x ? badgeOffset.x : 0}px, ${badgeOffset?.y ? badgeOffset.y : 0}px)`,
            }),
          }}
        ></img>
      </div>
    </div>
  );
};
