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
  StyledContentSkeletonContainer,
} from '../EntityCard.styles';

export const WideEntityCardSkeleton = () => {
  return (
    <StyledEntityCard
      sx={{
        maxWidth: ENTITY_CARD_SIZES.WIDE.CARD_WIDTH,
      }}
    >
      <StyledEntityCardImageContainer
        sx={{
          maxWidth: ENTITY_CARD_SIZES.WIDE.CARD_WIDTH,
          width: ENTITY_CARD_SIZES.WIDE.CARD_WIDTH,
          height: ENTITY_CARD_SIZES.WIDE.IMAGE_HEIGHT,
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
      <StyledEntityCardContentContainer sx={{ gap: 3 }}>
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
        <StyledContentSkeleton
          variant="text"
          animation="wave"
          sx={{
            mt: 2,
            height: 24,
            width: '100%',
          }}
        />
        <StyledRewardsContainer direction="row">
          {[...Array(2)].map((_, i) => (
            <StyledShapeSkeleton
              key={i}
              variant="rounded"
              animation="wave"
              sx={{ borderRadius: 5, height: 40, width: 64 }}
            />
          ))}
          <StyledShapeSkeleton
            variant="circular"
            width={40}
            height={40}
            animation="wave"
            sx={{ height: 40, width: 40 }}
          />
        </StyledRewardsContainer>
        <StyledContentSkeletonContainer>
          {[...Array(2)].map((_, i) => (
            <StyledContentSkeleton
              key={i}
              variant="text"
              width="100%"
              height={16}
              animation="wave"
              sx={{
                width: '100%',
                height: 16,
              }}
            />
          ))}
          <StyledContentSkeleton
            variant="text"
            animation="wave"
            sx={{
              width: '25%',
              height: 16,
            }}
          />
        </StyledContentSkeletonContainer>
      </StyledEntityCardContentContainer>
    </StyledEntityCard>
  );
};
