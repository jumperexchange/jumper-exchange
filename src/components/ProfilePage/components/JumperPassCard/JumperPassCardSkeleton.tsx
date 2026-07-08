import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { JumperPassCardContainer } from './JumperPassCard.styles';

export const JumperPassCardSkeleton = () => {
  return (
    <JumperPassCardContainer>
      <BaseSurfaceSkeleton
        variant="rounded"
        animation="wave"
        sx={(theme) => ({
          width: '100%',
          height: theme.spacing(29),
          borderRadius: `${theme.shape.cardBorderRadius}px`,
        })}
      />
    </JumperPassCardContainer>
  );
};
