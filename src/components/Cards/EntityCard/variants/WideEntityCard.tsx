import { FC } from 'react';
import { EntityCardProps } from '../EntityCard.types';
import {
  StyledEntityCard,
  StyledEntityCardContentContainer,
  StyledEntityCardImage,
  StyledEntityCardImageContainer,
  StyledWideEntityCardTitle,
  StyledWideParticipantAvatar,
  StyledParticipantsContainer,
  StyledRewardAvatar,
  StyledCompactRewardLabel,
  StyledWideRewardChipContainer,
  StyledRewardsContainer,
  StyledEntityCardLink,
  BaseSkeleton,
  StyledEntityCardBadgeContainer,
  StyledWideEntityCardDescriptionWrapper,
  StyledEntityCardDescription,
} from '../EntityCard.styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { WideEntityCardSkeleton } from './WideEntityCardSkeleton';
import { ENTITY_CARD_SIZES } from '../constants';
import { RichBlocks } from 'src/components/RichBlocks/RichBlocks';

export const WideEntityCard: FC<Omit<EntityCardProps, 'type'>> = ({
  imageUrl,
  badge,
  title,
  description,
  descriptionRichText,
  rewardGroups,
  participants,
  partnerLink,
  onClick,
  isLoading,
  fullWidth,
}) => {
  if (isLoading) {
    return <WideEntityCardSkeleton fullWidth />;
  }

  const renderDescription = !!description ? (
    <StyledEntityCardDescription>{description}</StyledEntityCardDescription>
  ) : !!descriptionRichText ? (
    <StyledWideEntityCardDescriptionWrapper>
      <RichBlocks
        content={descriptionRichText}
        blockSx={{
          paragraph: (theme) => ({
            ...theme.typography.bodyMedium,
            color: (theme.vars || theme).palette.text.secondary,
          }),
        }}
      />
    </StyledWideEntityCardDescriptionWrapper>
  ) : null;

  return (
    <StyledEntityCard
      sx={{
        width: '100%',
        maxWidth: fullWidth ? '100%' : ENTITY_CARD_SIZES.WIDE.CARD_WIDTH,
      }}
      onClick={onClick}
    >
      <StyledEntityCardImageContainer
        sx={{
          width: '100%',
          maxWidth: fullWidth ? '100%' : ENTITY_CARD_SIZES.WIDE.CARD_WIDTH,
          height: ENTITY_CARD_SIZES.WIDE.IMAGE_HEIGHT,
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
            height={ENTITY_CARD_SIZES.WIDE.IMAGE_HEIGHT}
            width={ENTITY_CARD_SIZES.WIDE.CARD_WIDTH}
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
      <StyledEntityCardContentContainer sx={{ gap: 3, paddingTop: 3 }}>
        <StyledParticipantsContainer>
          {participants?.map((participant, index) => (
            <StyledWideParticipantAvatar
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
        {Object.keys(rewardGroups || {}).length > 0 && (
          <StyledRewardsContainer direction="row">
            {Object.entries(rewardGroups || {}).map(([rewardKey, rewards]) => {
              if (rewards.length === 0) return null;

              return rewards.map((reward) => (
                <StyledWideRewardChipContainer
                  key={`${rewardKey}-${reward.label}`}
                  clickable={false}
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
        {renderDescription}
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
