import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { LearnPageArticlesFilteringBarContainer } from '../LearnArticlePage.style';

export const LearnPageArticlesFilteringBarSkeleton = () => {
  return (
    <LearnPageArticlesFilteringBarContainer>
      <BaseSurfaceSkeleton
        sx={(theme) => ({
          borderRadius: theme.shape.radius24,
          height: 48,
          width: {
            xs: 180,
            sm: '50%',
          },
        })}
      />
    </LearnPageArticlesFilteringBarContainer>
  );
};
