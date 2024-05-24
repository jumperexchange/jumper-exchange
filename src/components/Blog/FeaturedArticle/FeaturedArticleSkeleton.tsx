import {
  FeaturedArticleContainer,
  FeaturedArticleContent,
  FeaturedArticleDetails,
  FeaturedArticleImageSkeleton,
  FeaturedArticleMetaSkeleton,
  FeaturedArticleSubtitleSkeleton,
  FeaturedArticleTagSkeleton,
  FeaturedArticleTitleSkeleton,
} from '.';

export const FeaturedArticleSkeleton = () => {
  return (
    <FeaturedArticleContainer href={''}>
      <FeaturedArticleImageSkeleton variant="rectangular" />
      <FeaturedArticleContent sx={{ width: '100%' }}>
        <FeaturedArticleDetails>
          <FeaturedArticleTagSkeleton variant="rectangular" />
          <FeaturedArticleMetaSkeleton />
        </FeaturedArticleDetails>
        <FeaturedArticleTitleSkeleton variant="rectangular" />
        <FeaturedArticleSubtitleSkeleton />
      </FeaturedArticleContent>
    </FeaturedArticleContainer>
  );
};
