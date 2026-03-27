import { BadgeSize } from '@/components/Badge/Badge.styles';
import { BlogArticleMetadataSkeleton } from '../BlogArticleMetadata/BlogArticleMetadataSkeleton';
import {
  FeaturedArticleContent,
  FeaturedArticleDetails,
  FeaturedArticleImageSkeleton,
  FeaturedArticleLink,
  FeaturedArticleSubtitleSkeleton,
  FeaturedArticleTitleSkeleton,
} from './FeaturedArticle.style';

export const FeaturedArticleSkeleton = () => {
  return (
    <FeaturedArticleLink href={'#'} sx={{ pointerEvents: 'none' }}>
      <FeaturedArticleImageSkeleton variant="rectangular" />
      <FeaturedArticleContent sx={{ width: '100%' }}>
        <FeaturedArticleDetails>
          <BlogArticleMetadataSkeleton
            tagSize={BadgeSize.XL}
            metaVariant="bodyMedium"
            sx={(theme) => ({
              flexDirection: 'column',
              gap: 3,
              [theme.breakpoints.up('sm')]: {
                flexDirection: 'row-reverse',
                gap: 3,
              },
            })}
          />
        </FeaturedArticleDetails>
        <FeaturedArticleTitleSkeleton variant="rectangular" />
        <FeaturedArticleSubtitleSkeleton />
      </FeaturedArticleContent>
    </FeaturedArticleLink>
  );
};
