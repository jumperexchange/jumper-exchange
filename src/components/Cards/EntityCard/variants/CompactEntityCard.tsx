import { FC } from 'react';
import { EntityCardProps } from '../EntityCard.types';
import {
  StyledEntityCard,
  StyledEntityCardContentContainer,
  StyledCompactEntityCardTitle,
  StyledEntityCardImage,
  StyledEntityCardImageContainer,
  StyledCompactParticipantAvatar,
  StyledParticipantsContainer,
  StyledRewardAvatar,
  StyledCompactRewardLabel,
  StyledCompactRewardChipContainer,
  StyledRewardsAvatarsContainer,
  StyledRewardsContainer,
  StyledEntityCardBadgeContainer,
  BaseSkeleton,
} from '../EntityCard.styles';
import { CompactEntityCardSkeleton } from './CompactEntityCardSkeleton';
import { ENTITY_CARD_SIZES } from '../constants';

export const CompactEntityCard: FC<Omit<EntityCardProps, 'type'>> = ({
  imageUrl,
  title,
  badge,
  rewardGroups,
  participants,
  onClick,
  isLoading,
  fullWidth,
}) => {
  if (isLoading) {
    return <CompactEntityCardSkeleton fullWidth={fullWidth} />;
  }

  return (
    <StyledEntityCard
      sx={{
        width: '100%',
        maxWidth: fullWidth ? '100%' : ENTITY_CARD_SIZES.COMPACT.CARD_WIDTH,
      }}
      onClick={onClick}
    >
      <StyledEntityCardImageContainer
        sx={{
          width: '100%',
          maxWidth: fullWidth ? '100%' : ENTITY_CARD_SIZES.COMPACT.CARD_WIDTH,
          height: ENTITY_CARD_SIZES.COMPACT.IMAGE_HEIGHT,
        }}
      >
        {badge && (
          <StyledEntityCardBadgeContainer>
            {badge}
          </StyledEntityCardBadgeContainer>
        )}
        {imageUrl ? (
          <StyledEntityCardImage
            src={imageUrl}
            alt={`Image for ${title}`}
            // For a next/image we need to set height/width
            height={ENTITY_CARD_SIZES.COMPACT.IMAGE_HEIGHT}
            width={ENTITY_CARD_SIZES.COMPACT.CARD_WIDTH}
            // @Note need to add priority to the first loaded items as LCP is impacted
          />
        ) : (
          <BaseSkeleton
            animation={false}
            variant="rectangular"
            sx={{
              height: '100%',
              width: '100%',
            }}
          />
        )}
      </StyledEntityCardImageContainer>
      <StyledEntityCardContentContainer
        sx={{
          height: ENTITY_CARD_SIZES.COMPACT.CARD_CONTENT_HEIGHT,
        }}
      >
        <StyledParticipantsContainer>
          {participants?.map((participant, index) => (
            <StyledCompactParticipantAvatar
              key={participant.label || `participant-${index}`}
              src={participant.avatarUrl}
              alt={participant.label || `Participant ${index + 1}`}
              sx={{
                zIndex: participants.length - index,
              }}
            />
          ))}
        </StyledParticipantsContainer>
        <StyledCompactEntityCardTitle>{title}</StyledCompactEntityCardTitle>
        {Object.keys(rewardGroups || {}).length > 0 && (
          <StyledRewardsContainer direction="row">
            {Object.entries(rewardGroups || {}).map(([rewardKey, rewards]) => {
              if (rewards.length === 0) return null;

              if (rewardKey !== 'coins') {
                return (
                  <StyledCompactRewardChipContainer
                    clickable={false}
                    key={rewardKey}
                    label={
                      <StyledCompactRewardLabel>
                        {rewards[0].value} {rewards[0].label}
                      </StyledCompactRewardLabel>
                    }
                  />
                );
              }

              return (
                <StyledCompactRewardChipContainer
                  clickable={false}
                  key={rewardKey}
                  sx={{
                    display: 'inline-block',
                  }}
                  avatar={
                    <StyledRewardsAvatarsContainer>
                      {rewards
                        .filter((reward) => !!reward.avatarUrl)
                        .map((reward, rewardIndex) => (
                          <StyledRewardAvatar
                            key={reward.label}
                            src={reward.avatarUrl || ''}
                            alt={reward.label}
                            sx={{
                              zIndex: rewards.length - rewardIndex,
                            }}
                          />
                        ))}
                    </StyledRewardsAvatarsContainer>
                  }
                />
              );
            })}
          </StyledRewardsContainer>
        )}
      </StyledEntityCardContentContainer>
    </StyledEntityCard>
  );
};
