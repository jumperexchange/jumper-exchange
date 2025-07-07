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
}) => {
  if (isLoading) {
    return <CompactEntityCardSkeleton />;
  }

  return (
    <StyledEntityCard
      sx={{
        maxWidth: ENTITY_CARD_SIZES.COMPACT.CARD_WIDTH,
      }}
      onClick={onClick}
    >
      <StyledEntityCardImageContainer
        sx={{
          maxWidth: ENTITY_CARD_SIZES.COMPACT.CARD_WIDTH,
          width: ENTITY_CARD_SIZES.COMPACT.CARD_WIDTH,
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
        {rewardGroups && (
          <StyledRewardsContainer direction="row">
            {Object.entries(rewardGroups).map(([rewardKey, rewards]) => {
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
                  sx={(theme) => ({
                    display: 'inline-block',
                    paddingLeft: theme.spacing(0.5),
                    paddingRight: theme.spacing(0.5),
                  })}
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
