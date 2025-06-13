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
        width: ENTITY_CARD_SIZES.WIDE.CARD_WIDTH,
      }}
    >
      <StyledEntityCardImageContainer
        width={ENTITY_CARD_SIZES.WIDE.CARD_WIDTH}
        height={ENTITY_CARD_SIZES.WIDE.IMAGE_HEIGHT}
      >
        <BaseSkeleton
          animation={false}
          variant="rectangular"
          width="100%"
          height="100%"
        />
      </StyledEntityCardImageContainer>
      <StyledEntityCardContentContainer sx={{ gap: 3 }}>
        <StyledParticipantsContainer>
          <StyledAvatarSkeleton
            variant="circular"
            animation="wave"
            width={40}
            height={40}
          />
        </StyledParticipantsContainer>
        <StyledContentSkeleton
          variant="text"
          width="100%"
          animation="wave"
          sx={{
            mt: 2,
            height: 24,
          }}
        />
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
            variant="circular"
            width={40}
            height={40}
            animation="wave"
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
            />
          ))}
          <StyledContentSkeleton
            variant="text"
            width="25%"
            height={16}
            animation="wave"
          />
        </StyledContentSkeletonContainer>
      </StyledEntityCardContentContainer>
    </StyledEntityCard>
  );
};
