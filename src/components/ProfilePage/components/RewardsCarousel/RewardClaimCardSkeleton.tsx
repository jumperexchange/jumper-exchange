import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
import {
  BaseStyledSkeleton,
  RewardCardContainer,
} from './RewardClaimCard.style';

export const RewardClaimCardSkeleton = () => {
  return (
    <RewardCardContainer gap={2}>
      <AvatarBadge
        avatarSrc={''}
        badgeSrc={''}
        avatarSize={40}
        badgeSize={16}
        badgeGap={4}
        badgeOffset={{ x: 5, y: 0 }}
        alt="token-logo"
        badgeAlt="chain-logo"
      />
      <BaseStyledSkeleton
        variant="rounded"
        animation="wave"
        sx={{
          height: 24,
          width: 152,
          borderRadius: 12,
        }}
      />
      <BaseStyledSkeleton
        variant="rounded"
        animation="wave"
        sx={{
          height: 40,
          width: 64,
          borderRadius: 20,
        }}
      />
    </RewardCardContainer>
  );
};
