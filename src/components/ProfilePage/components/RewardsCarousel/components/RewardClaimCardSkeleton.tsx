import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
import {
  BaseStyledSkeleton,
  RewardCardContainer,
} from './RewardClaimCard.style';
import { EntityChainStackVariant } from '@/components/composite/EntityChainStack/EntityChainStack.types';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { EntityChainStack } from '@/components/composite/EntityChainStack/EntityChainStack';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';

export const RewardClaimCardSkeleton = () => {
  return (
    <RewardCardContainer gap={2} sx={{ justifyContent: 'space-between' }}>
      <EntityChainStack
        variant={EntityChainStackVariant.TokenWithChains}
        tokenSize={AvatarSize.LG}
        chainsSize={AvatarSize.XS}
        spacing={{
          chains: 0,
        }}
        isLoading
      />
      <BaseSurfaceSkeleton
        variant="rounded"
        animation="wave"
        sx={{
          height: 38,
          width: 64,
          borderRadius: 20,
        }}
      />
    </RewardCardContainer>
  );
};
