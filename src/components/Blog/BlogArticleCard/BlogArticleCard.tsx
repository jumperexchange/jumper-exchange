import { TrackingAction, TrackingEventParameter } from '@/const/trackingKeys';
import { JUMPER_LEARN_PATH } from '@/const/urls';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useMenuStore } from '@/stores/menu/MenuStore';
import type { BlogArticleData } from '@/types/strapi';
import { readingTime } from '@/utils/readingTime';
import type { CSSObject } from '@mui/material';
import { Skeleton } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import useClient from 'src/hooks/useClient';
import { isSpindlFetchResponse } from 'src/types/spindl';
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
  article: BlogArticleData;
  baseUrl: string;
  trackingCategory: string;
  styles?: CSSObject;
}

export const BlogArticleCard = ({
  article,
  baseUrl,
  trackingCategory,
  styles,
}: BlogArticleCardProps) => {
  const { trackEvent } = useUserTracking();
  const minRead = readingTime(article.attributes?.Content);
  const { t } = useTranslation();
  const { closeAllMenus } = useMenuStore((state) => state);
  const isClient = useClient();
  const handleClick = () => {
    trackEvent({
      category: trackingCategory,
      action: TrackingAction.ClickArticleCard,
      label: 'click-blog-article-card',
      data: {
        [TrackingEventParameter.ArticleTitle]: article.attributes?.Title,
        [TrackingEventParameter.ArticleCardId]: article.id,
      },
    });
    closeAllMenus();
  };
  return (
    <Link
      href={
        article.attributes?.RedirectURL ??
        `${JUMPER_LEARN_PATH}/${article.attributes?.Slug}`
      }
      style={{ textDecoration: 'none', width: '100%', maxWidth: '416px' }}
    >
      <BlogArticleCardContainer
        variant="outlined"
        onClick={handleClick}
        sx={styles}
      >
        {article.attributes?.Image.data ? (
          <BlogArticleCardImage
            src={`${baseUrl}${!isSpindlFetchResponse(article) && (article.attributes.Image.data.attributes?.formats?.small.url || article.attributes.Image.data.attributes?.url)}`}
            alt={
              article.attributes?.Image.data?.attributes?.alternativeText ??
              article.attributes?.Title
            }
            // read the following to udnerstand why width and height are set to 0, https://github.com/vercel/next.js/discussions/18474#discussioncomment-5501724
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
            {article.attributes?.Title}
          </BlogArticleCardTitle>
          <BlogArticleCardDetails>
            {article.attributes?.tags?.data.slice(0, 1).map((tag, index) => (
              <BlogArticleCardTag key={index} variant="bodyXSmall" as="h3">
                {tag.attributes?.Title}
              </BlogArticleCardTag>
            ))}
            <BlogArticleCardMetaContainer
              hasTags={article.attributes?.tags?.data.length > 0}
            >
              {isClient ? (
                <BlogArticleMetaDate variant="bodyXSmall" as="span">
                  {t('format.shortDate', {
                    value: new Date(
                      article.attributes?.publishedAt ||
                        article.attributes?.createdAt,
                    ),
                  })}
                </BlogArticleMetaDate>
              ) : (
                <Skeleton
                  component="span"
                  sx={{
                    width: '96px',
                    transform: 'unset',
                    borderRadius: '16px',
                    marginRight: '12px',
                  }}
                />
              )}
              <BlogArticleMetaReadingTime variant="bodyXSmall" as="span">
                {t('blog.minRead', { minRead: minRead })}
              </BlogArticleMetaReadingTime>
            </BlogArticleCardMetaContainer>
          </BlogArticleCardDetails>
        </BlogArticleCardContent>
      </BlogArticleCardContainer>
    </Link>
  );
};
