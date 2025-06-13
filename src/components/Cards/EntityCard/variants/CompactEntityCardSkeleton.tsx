import { ENTITY_CARD_SIZES } from '../constants';
import {
  BaseSkeleton,
  StyledEntityCard,
  StyledEntityCardContentContainer,
  StyledEntityCardImageContainer,
  StyledParticipantsContainer,
  StyledRewardsContainer,
  StyledAvatarSkeleton,
  StyledContentSkeleton,
  StyledShapeSkeleton,
} from '../EntityCard.styles';

export const CompactEntityCardSkeleton = () => {
  return (
    <StyledEntityCard
      sx={{
        width: ENTITY_CARD_SIZES.COMPACT.CARD_WIDTH,
      }}
    >
      <StyledEntityCardImageContainer
        width={ENTITY_CARD_SIZES.COMPACT.CARD_WIDTH}
        height={ENTITY_CARD_SIZES.COMPACT.IMAGE_HEIGHT}
      >
        <BaseSkeleton
          animation={false}
          variant="rectangular"
          width="100%"
          height="100%"
        />
      </StyledEntityCardImageContainer>
      <StyledEntityCardContentContainer
        height={ENTITY_CARD_SIZES.COMPACT.CARD_CONTENT_HEIGHT}
      >
        <StyledParticipantsContainer>
          <StyledAvatarSkeleton
            variant="circular"
            animation="wave"
            width={40}
            height={40}
          />
        </StyledParticipantsContainer>
        <div>
          <StyledContentSkeleton
            variant="text"
            width="100%"
            animation="wave"
            sx={{
              mb: 1.25,
              mt: 1,
            }}
          />
          <StyledContentSkeleton variant="text" width="80%" animation="wave" />
        </div>
        <StyledRewardsContainer direction="row">
          {[...Array(2)].map((_, i) => (
            <StyledShapeSkeleton
              key={i}
              variant="rounded"
              width={64}
              height={40}
              sx={{ borderRadius: 5 }}
              animation="wave"
            />
          ))}
          <StyledShapeSkeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
        </StyledRewardsContainer>
      </StyledEntityCardContentContainer>
    </StyledEntityCard>
  );
};
