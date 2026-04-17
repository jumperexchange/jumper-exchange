import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import {
  BlogArticleCardContainer,
  BlogArticleCardContentContainer,
} from '../BlogArticleCard.styles';

export const PreviewBlogArticleCardSkeleton = () => {
  return (
    <BlogArticleCardContainer>
      <BaseSurfaceSkeleton variant="rounded" sx={{ width: 116, height: 72 }} />
      <BlogArticleCardContentContainer sx={{ gap: 0.5 }}>
        <BaseSurfaceSkeleton variant="rounded" sx={{ width: 80, height: 24 }} />
        <BaseSurfaceSkeleton
          variant="rounded"
          sx={{ width: '100%', height: 20 }}
        />
        <BaseSurfaceSkeleton
          variant="rounded"
          sx={{ width: '70%', height: 20 }}
        />
      </BlogArticleCardContentContainer>
    </BlogArticleCardContainer>
  );
};
