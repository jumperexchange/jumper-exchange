import { FC } from 'react';
import { EntityCardProps } from '../EntityCard.types';
import {
  StyledEntityCard,
  StyledEntityCardContentContainer,
  StyledEntityCardImage,
  StyledEntityCardImageContainer,
  StyledWideEntityCardTitle,
  StyledEntityCardDescription,
  StyledParticipantAvatar,
  StyledParticipantsContainer,
  StyledRewardAvatar,
  StyledCompactRewardLabel,
  StyledWideRewardChipContainer,
  StyledRewardsContainer,
  StyledEntityCardLink,
} from '../EntityCard.styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { WideEntityCardSkeleton } from './WideEntityCardSkeleton';
import { ENTITY_CARD_SIZES } from '../constants';

export const WideEntityCard: FC<Omit<EntityCardProps, 'type'>> = ({
  imageUrl,
  title,
  description,
  rewardGroups,
  participants,
  partnerLink,
  onClick,
  isLoading,
}) => {
  if (isLoading) {
    return <WideEntityCardSkeleton />;
  }

  return (
    <StyledEntityCard
      sx={{
        maxWidth: ENTITY_CARD_SIZES.WIDE.CARD_WIDTH,
      }}
      onClick={onClick}
    >
      <StyledEntityCardImageContainer
        maxWidth={ENTITY_CARD_SIZES.WIDE.CARD_WIDTH}
        height={ENTITY_CARD_SIZES.WIDE.IMAGE_HEIGHT}
      >
        <StyledEntityCardImage src={imageUrl} alt={`Image for ${title}`} fill />
      </StyledEntityCardImageContainer>
      <StyledEntityCardContentContainer sx={{ gap: 3 }}>
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
        <StyledWideEntityCardTitle mt={2}>{title}</StyledWideEntityCardTitle>
        {rewardGroups && (
          <StyledRewardsContainer direction="row">
            {Object.entries(rewardGroups).map(([rewardKey, rewards]) => {
              if (rewards.length === 0) return null;

              return rewards.map((reward) => (
                <StyledWideRewardChipContainer
                  key={`${rewardKey}-${reward.label}`}
                  label={
                    <StyledCompactRewardLabel>
                      {reward.value} {reward.label}
                    </StyledCompactRewardLabel>
                  }
                  avatar={
                    reward.avatarUrl ? (
                      <StyledRewardAvatar
                        key={reward.label}
                        src={reward.avatarUrl}
                        alt={reward.label}
                        sx={(theme) => ({
                          height: `${theme.spacing(4)} !important`,
                          width: `${theme.spacing(4)} !important`,
                        })}
                      />
                    ) : undefined
                  }
                />
              ));
            })}
          </StyledRewardsContainer>
        )}
        <StyledEntityCardDescription>{description}</StyledEntityCardDescription>
        {partnerLink && (
          <StyledEntityCardLink target="_blank" href={partnerLink.url}>
            {partnerLink.label}
            <ArrowForwardIcon />
          </StyledEntityCardLink>
        )}
      </StyledEntityCardContentContainer>
    </StyledEntityCard>
  );
};
