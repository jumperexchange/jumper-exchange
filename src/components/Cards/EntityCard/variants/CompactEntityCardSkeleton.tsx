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
        maxWidth: ENTITY_CARD_SIZES.COMPACT.CARD_WIDTH,
      }}
    >
      <StyledEntityCardImageContainer
        sx={{
          width: '100%',
          maxWidth: ENTITY_CARD_SIZES.COMPACT.CARD_WIDTH,
          height: ENTITY_CARD_SIZES.COMPACT.IMAGE_HEIGHT,
        }}
      >
        <BaseSkeleton
          animation={false}
          variant="rectangular"
          sx={{
            width: '100%',
            height: '100%',
          }}
        />
      </StyledEntityCardImageContainer>
      <StyledEntityCardContentContainer
        sx={{
          height: ENTITY_CARD_SIZES.COMPACT.CARD_CONTENT_HEIGHT,
        }}
      >
        <StyledParticipantsContainer>
          <StyledAvatarSkeleton
            variant="circular"
            animation="wave"
            sx={{
              height: 40,
              width: 40,
            }}
          />
        </StyledParticipantsContainer>
        <div>
          <StyledContentSkeleton
            variant="text"
            animation="wave"
            sx={{
              mb: 1.25,
              mt: 1,
              width: '100%',
            }}
          />
          <StyledContentSkeleton
            variant="text"
            animation="wave"
            sx={{ width: '80%' }}
          />
        </div>
        <StyledRewardsContainer direction="row">
          {[...Array(2)].map((_, i) => (
            <StyledShapeSkeleton
              key={i}
              variant="rounded"
              sx={{ borderRadius: 5, height: 40, width: 64 }}
              animation="wave"
            />
          ))}
          <StyledShapeSkeleton
            animation="wave"
            variant="circular"
            sx={{
              height: 40,
              width: 40,
            }}
          />
        </StyledRewardsContainer>
      </StyledEntityCardContentContainer>
    </StyledEntityCard>
  );
};
