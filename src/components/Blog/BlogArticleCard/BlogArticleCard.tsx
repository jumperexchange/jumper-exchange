import { TrackingAction, TrackingEventParameter } from '@/const/trackingKeys';
import { JUMPER_LEARN_PATH } from '@/const/urls';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useMenuStore } from '@/stores/menu/MenuStore';
import type { BlogArticleData } from '@/types/strapi';
import type { SxProps, Theme } from '@mui/material/styles';
import { Skeleton } from '@mui/material';
import Link from 'next/link';
import useClient from 'src/hooks/useClient';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import {
  BlogArticleCardContainer,
  BlogArticleCardContent,
  BlogArticleCardDetails,
  BlogArticleCardImage,
  BlogArticleCardTitle,
} from './BlogArticleCard.style';
import { BlogArticleMetadata } from '../BlogArticleMetadata/BlogArticleMetadata';
import { BlogArticleMetadataSkeleton } from '../BlogArticleMetadata/BlogArticleMetadataSkeleton';

interface BlogArticleCardProps {
  article: BlogArticleData;
  trackingCategory: string;
  sx?: SxProps<Theme>;
}

export const BlogArticleCard = ({
  article,
  trackingCategory,
  sx,
}: BlogArticleCardProps) => {
  const { trackEvent } = useUserTracking();
  const baseUrl = getStrapiBaseUrl();
  const { closeAllMenus } = useMenuStore((state) => state);
  const isClient = useClient();
  const handleClick = () => {
    trackEvent({
      category: trackingCategory,
      action: TrackingAction.ClickArticleCard,
      label: 'click-blog-article-card',
      data: {
        [TrackingEventParameter.ArticleTitle]: article?.Title,
        [TrackingEventParameter.ArticleCardId]: article.id,
      },
    });
    closeAllMenus();
  };
  return (
    <Link
      href={article?.RedirectURL ?? `${JUMPER_LEARN_PATH}/${article?.Slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <BlogArticleCardContainer
        variant="outlined"
        onClick={handleClick}
        sx={sx}
      >
        {article?.Image && baseUrl ? (
          <BlogArticleCardImage
            src={`${baseUrl}${article?.Image?.formats.small.url || article?.Image?.url}`}
            alt={article?.Image?.alternativeText ?? article?.Title}
            // read the following to understand why width and height are set to 0, https://github.com/vercel/next.js/discussions/18474#discussioncomment-5501724
            width={0}
            height={0}
            sizes="100vw"
            draggable={false}
          />
        ) : (
          <Skeleton
            component="span"
            sx={{
              width: '100%',
              aspectRatio: 1.6,
              transform: 'unset',
              borderRadius: '16px',
            }}
          />
        )}

        <BlogArticleCardContent>
          <BlogArticleCardTitle variant="bodyLarge">
            {article?.Title}
          </BlogArticleCardTitle>
          <BlogArticleCardDetails>
            {isClient ? (
              <BlogArticleMetadata article={article} />
            ) : (
              <BlogArticleMetadataSkeleton />
            )}
          </BlogArticleCardDetails>
        </BlogArticleCardContent>
      </BlogArticleCardContainer>
    </Link>
  );
};
