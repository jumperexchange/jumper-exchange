import {
  BlogArticleCardContainer,
  BlogArticleCardContent,
  BlogArticleCardDetails,
  BlogArticleCardImageSkeleton,
  BlogArticleCardMetaContainer,
  BlogArticleCardMetaSkeleton,
  BlogArticleCardTagSkeleton,
  BlogArticleCardTitleSkeleton,
} from '.';

export const BlogArticleCardSkeleton = () => {
  return (
    <BlogArticleCardContainer
      sx={{
        boxShadow: 'unset',
      }}
    >
      <BlogArticleCardImageSkeleton variant="rectangular" />
      <BlogArticleCardContent>
        <BlogArticleCardTitleSkeleton variant="text" />
        <BlogArticleCardDetails>
          <BlogArticleCardTagSkeleton variant="text" />
          <BlogArticleCardMetaContainer hasTags={true}>
            <BlogArticleCardMetaSkeleton variant="text" />
          </BlogArticleCardMetaContainer>
        </BlogArticleCardDetails>
      </BlogArticleCardContent>
    </BlogArticleCardContainer>
  );
};
