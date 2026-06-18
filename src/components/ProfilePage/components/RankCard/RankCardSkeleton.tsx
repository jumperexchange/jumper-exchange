import { BaseSurfaceSkeleton } from 'src/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { RankCardContainer } from './RankCard.styles';

export const RankCardSkeleton = () => {
  return (
    <RankCardContainer>
      <BaseSurfaceSkeleton
        variant="rounded"
        animation="wave"
        sx={(theme) => ({
          width: '100%',
          height: theme.spacing(29),
          borderRadius: `${theme.shape.cardBorderRadius}px`,
        })}
      />
    </RankCardContainer>
  );
};
