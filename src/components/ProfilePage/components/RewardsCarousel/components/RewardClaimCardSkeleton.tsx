import { RewardCardContainer } from './RewardClaimCard.style';
import { EntityChainStackVariant } from '@/components/composite/EntityChainStack/EntityChainStack.types';
import { EntityChainStack } from '@/components/composite/EntityChainStack/EntityChainStack';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { REWARD_CLAIM_CARD_CONFIG } from './constants';

export const RewardClaimCardSkeleton = () => {
  return (
    <RewardCardContainer sx={{ gap: 2, justifyContent: 'space-between' }}>
      <EntityChainStack
        variant={EntityChainStackVariant.TokenWithChains}
        tokenSize={REWARD_CLAIM_CARD_CONFIG.tokenSize}
        chainsSize={REWARD_CLAIM_CARD_CONFIG.chainsSize}
        spacing={{
          chains: 0,
        }}
        isLoading
      />
      <BaseSurfaceSkeleton
        variant="rounded"
        animation="wave"
        sx={(theme) => ({
          height: 40,
          width: 64,
          borderRadius: theme.shape.radius20,
        })}
      />
    </RewardCardContainer>
  );
};
