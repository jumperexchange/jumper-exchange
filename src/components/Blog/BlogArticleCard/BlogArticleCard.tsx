import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { CSSObject } from '@mui/material';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/navigation';
import type { RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { useTranslation } from 'react-i18next';
import {
  JUMPER_LEARN_PATH,
  TrackingAction,
  TrackingEventParameter,
} from 'src/const';
import { useMenuStore } from 'src/stores';
import type { TagData } from 'src/types';
import { EventTrackingTool, type StrapiImageData } from 'src/types';
import { formatDate, readingTime } from 'src/utils';
import {
  BlogArticleCardContainer,
  BlogArticleCardContent,
  BlogArticleCardDetails,
  BlogArticleCardImage,
  BlogArticleCardMetaContainer,
  BlogArticleCardTag,
  BlogArticleCardTitle,
  BlogArticleMetaDate,
  BlogArticleMetaReadingTime,
} from '.';

interface BlogArticleCardProps {
  baseUrl: URL;
  id: number;
  image: StrapiImageData;
  content: RootNode[];
  publishedAt: string | null | undefined;
  createdAt: string;
  key?: string;
  title: string;
  tags: TagData | undefined;
  trackingCategory: string;
  slug: string;
  styles?: CSSObject;
}

export const BlogArticleCard = ({
  baseUrl,
  trackingCategory,
  image,
  tags,
  content,
  publishedAt,
  createdAt,
  id,
  key,
  title,
  styles,
  slug,
}: BlogArticleCardProps) => {
  const router = useRouter();
  const { trackEvent } = useUserTracking();
  const minRead = readingTime(content);
  const { t } = useTranslation();
  const { closeAllMenus } = useMenuStore((state) => state);

  const handleClick = () => {
    trackEvent({
      category: trackingCategory,
      action: TrackingAction.ClickArticleCard,
      label: 'click-blog-article-card',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
      data: {
        [TrackingEventParameter.ArticleTitle]: title,
        [TrackingEventParameter.ArticleCardId]: id,
      },
    });
    closeAllMenus();
    router.push(`${JUMPER_LEARN_PATH}/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <BlogArticleCardContainer
      variant="outlined"
      onClick={handleClick}
      sx={styles}
      key={key}
    >
      {image.data ? (
        <BlogArticleCardImage
          src={`${baseUrl}${image.data?.attributes?.formats.small.url}`}
          alt={image.data?.attributes?.alternativeText}
          draggable={false}
        />
      ) : (
        <Skeleton
          component="img"
          sx={{
            width: '100%',
            aspectRatio: 1.6,
            transform: 'unset',
            borderRadius: '16px',
          }}
        />
      )}

      <BlogArticleCardContent>
        <BlogArticleCardTitle variant="lifiBodyLarge">
          {title}
        </BlogArticleCardTitle>
        <BlogArticleCardDetails>
          {tags?.data.slice(0, 1).map((tag) => (
            <BlogArticleCardTag variant="lifiBodyXSmall" as="h3">
              {tag.attributes.Title}
            </BlogArticleCardTag>
          ))}
          <BlogArticleCardMetaContainer>
            <BlogArticleMetaDate variant="lifiBodyXSmall" as="span">
              {formatDate(publishedAt || createdAt)}
            </BlogArticleMetaDate>
            <BlogArticleMetaReadingTime variant="lifiBodyXSmall" as="span">
              {t('blog.minRead', { minRead: minRead })}
            </BlogArticleMetaReadingTime>
          </BlogArticleCardMetaContainer>
        </BlogArticleCardDetails>
      </BlogArticleCardContent>
    </BlogArticleCardContainer>
  );
};
