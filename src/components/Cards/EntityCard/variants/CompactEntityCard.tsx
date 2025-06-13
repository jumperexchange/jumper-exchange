import { FC } from 'react';
import { EntityCardProps } from '../EntityCard.types';
import {
  StyledEntityCard,
  StyledEntityCardContentContainer,
  StyledCompactEntityCardTitle,
  StyledEntityCardImage,
  StyledEntityCardImageContainer,
  StyledParticipantAvatar,
  StyledParticipantsContainer,
  StyledRewardAvatar,
  StyledCompactRewardLabel,
  StyledCompactRewardChipContainer,
  StyledRewardsAvatarsContainer,
  StyledRewardsContainer,
  StyledEntityCardBadgeContainer,
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
}) => {
  if (isLoading) {
    return <CompactEntityCardSkeleton />;
  }

  return (
    <StyledEntityCard
      sx={{
        width: ENTITY_CARD_SIZES.COMPACT.CARD_WIDTH,
      }}
      onClick={onClick}
    >
      <StyledEntityCardImageContainer
        width={ENTITY_CARD_SIZES.COMPACT.CARD_WIDTH}
        height={ENTITY_CARD_SIZES.COMPACT.IMAGE_HEIGHT}
      >
        {badge && (
          <StyledEntityCardBadgeContainer>
            {badge}
          </StyledEntityCardBadgeContainer>
        )}
        <StyledEntityCardImage src={imageUrl} alt={`Image for ${title}`} fill />
      </StyledEntityCardImageContainer>
      <StyledEntityCardContentContainer
        height={ENTITY_CARD_SIZES.COMPACT.CARD_CONTENT_HEIGHT}
      >
        <StyledParticipantsContainer>
          {participants?.map((participant, index) => (
            <StyledParticipantAvatar
              key={participant.label || `participant-${index}`}
              src={participant.avatarUrl}
              alt={participant.label || `Participant ${index + 1}`}
              sx={{
                zIndex: participants.length - index,
              }}
            />
          ))}
        </StyledParticipantsContainer>
        <StyledCompactEntityCardTitle variant="titleXSmall">
          {title}
        </StyledCompactEntityCardTitle>
        {rewardGroups && (
          <StyledRewardsContainer direction="row">
            {Object.entries(rewardGroups).map(([rewardKey, rewards]) => {
              if (rewards.length === 0) return null;

              if (rewards.length === 1) {
                return (
                  <StyledCompactRewardChipContainer
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
                  key={rewardKey}
                  sx={{ display: 'inline-block' }}
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
