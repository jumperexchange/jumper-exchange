import { FC, ReactElement, useMemo, cloneElement } from 'react';
import { EntityCardProps } from '../EntityCard.types';
import { useOverflowItems } from '../../../../hooks/useOverflowItems';
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

type FlattenedReward = {
  key: string;
  content: ReactElement;
};

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
  const flattenedRewards = useMemo(() => {
    // Flatten rewards into a single array for easier measurement
    const _flattenedRewards: FlattenedReward[] = [];

    Object.entries(rewardGroups || {}).forEach(([rewardKey, rewards]) => {
      if (rewards.length === 0) return;

      if (rewardKey === 'generic') {
        rewards.forEach((reward, index) => {
          _flattenedRewards.push({
            key: `${rewardKey}-${index}`,
            content: (
              <StyledCompactRewardChipContainer
                clickable={false}
                label={
                  <StyledCompactRewardLabel>
                    {reward.label}
                  </StyledCompactRewardLabel>
                }
              />
            ),
          });
        });
      } else if (rewardKey !== 'coins') {
        _flattenedRewards.push({
          key: rewardKey,
          content: (
            <StyledCompactRewardChipContainer
              clickable={false}
              label={
                <StyledCompactRewardLabel>
                  {rewards[0].value} {rewards[0].label}
                </StyledCompactRewardLabel>
              }
            />
          ),
        });
      } else {
        const hasMultipleRewards = rewards.length > 1;
        _flattenedRewards.push({
          key: rewardKey,
          content: (
            <StyledCompactRewardChipContainer
              clickable={false}
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
              hideLabel={hasMultipleRewards}
              label={
                !hasMultipleRewards ? (
                  <StyledCompactRewardLabel>
                    {rewards[0].value}
                  </StyledCompactRewardLabel>
                ) : undefined
              }
            />
          ),
        });
      }
    });

    return _flattenedRewards;
  }, [rewardGroups]);

  // Use custom hook to handle overflow detection
  const { containerRef, getItemRef, visibleCount, hiddenCount, isReady } =
    useOverflowItems({
      itemCount: flattenedRewards.length,
      gap: 8, // theme.spacing(1) = 8px
      overflowIndicatorWidth: 60,
    });

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
        {flattenedRewards.length > 0 && (
          <StyledRewardsContainer
            direction="row"
            ref={containerRef}
            sx={{
              opacity: isReady ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            {flattenedRewards.map((reward, index) => {
              const isVisible = visibleCount === null || index < visibleCount;
              const sx = (reward.content.props as any)?.sx || {};

              return cloneElement(reward.content as ReactElement<any>, {
                key: reward.key,
                ref: getItemRef(index),
                sx: {
                  ...sx,
                  visibility: isVisible ? 'visible' : 'hidden',
                  position: isVisible ? 'relative' : 'absolute',
                  pointerEvents: isVisible ? 'auto' : 'none',
                },
              });
            })}
            {hiddenCount > 0 && (
              <StyledCompactRewardChipContainer
                clickable={false}
                label={
                  <StyledCompactRewardLabel>
                    +{hiddenCount}
                  </StyledCompactRewardLabel>
                }
              />
            )}
          </StyledRewardsContainer>
        )}
      </StyledEntityCardContentContainer>
    </StyledEntityCard>
  );
};
