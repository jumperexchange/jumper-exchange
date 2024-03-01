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
    <FeaturedArticleContainer>
      <FeaturedArticleImageSkeleton variant="rectangular" as="img" />
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
