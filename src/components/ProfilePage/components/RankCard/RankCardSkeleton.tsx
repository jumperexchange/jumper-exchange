import {
  RankCardContainer,
  BaseStyledSkeleton,
  RankButtonContainer,
} from './RankCard.styles';

export const RankCardSkeleton = () => {
  return (
    <RankCardContainer>
      <BaseStyledSkeleton
        variant="rounded"
        animation="wave"
        sx={{
          height: 34,
          width: 96,
          borderRadius: 16,
        }}
      />
      <BaseStyledSkeleton
        variant="rounded"
        animation="wave"
        sx={{
          height: 48,
          width: 128,
          borderRadius: 24,
          mt: 1,
          mb: 2,
        }}
      />
      <RankButtonContainer>
        <BaseStyledSkeleton
          variant="rounded"
          animation="wave"
          sx={{
            height: 40,
            width: '100%',
            borderRadius: 20,
          }}
        />
      </RankButtonContainer>
    </RankCardContainer>
  );
};
