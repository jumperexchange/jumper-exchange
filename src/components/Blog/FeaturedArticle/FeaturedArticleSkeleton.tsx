import {
  FeaturedArticleContent,
  FeaturedArticleDetails,
  FeaturedArticleImageSkeleton,
  FeaturedArticleLink,
  FeaturedArticleMetaSkeleton,
  FeaturedArticleSubtitleSkeleton,
  FeaturedArticleTagSkeleton,
  FeaturedArticleTitleSkeleton,
} from '.';

export const FeaturedArticleSkeleton = () => {
  return (
    <FeaturedArticleLink href={'#'} sx={{ pointerEvents: 'none' }}>
      <FeaturedArticleImageSkeleton variant="rectangular" />
      <FeaturedArticleContent sx={{ width: '100%' }}>
        <FeaturedArticleDetails>
          <FeaturedArticleTagSkeleton variant="rectangular" />
          <FeaturedArticleMetaSkeleton />
        </FeaturedArticleDetails>
        <FeaturedArticleTitleSkeleton variant="rectangular" />
        <FeaturedArticleSubtitleSkeleton />
      </FeaturedArticleContent>
    </FeaturedArticleLink>
  );
};
