import type { CSSObject } from '@mui/material';
import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import type { RootNode } from '@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TrackingAction, TrackingEventParameter } from 'src/const';
import { useUserTracking } from 'src/hooks';
import type { TagData } from 'src/types';
import { EventTrackingTool, type StrapiImageData } from 'src/types';
import { formatDate, getContrastAlphaColor, readingTime } from 'src/utils';
import {
  BlogArticleCardContainer,
  BlogArticleCardContent,
  BlogArticleCardImage,
  BlogArticleCardTitle,
  BlogArticleMetaContainer,
  BlogArticleTag,
} from '.';

interface BlogArticleCardProps {
  baseUrl: URL;
  id: number;
  image: StrapiImageData;
  content: RootNode[];
  publishedAt: string | null | undefined;
  createdAt: string;
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
  title,
  styles,
  slug,
}: BlogArticleCardProps) => {
  const navigate = useNavigate();
  const { trackEvent } = useUserTracking();
  const theme = useTheme();
  const minRead = readingTime(content);
  const { t } = useTranslation();

  const handleClick = () => {
    trackEvent({
      category: trackingCategory,
      action: TrackingAction.ClickArticleCard,
      label: 'click-blog-article-card',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
      data: {
        [TrackingEventParameter.ArticleCardTitle]: title,
        [TrackingEventParameter.ArticleCardId]: id,
      },
    });
    navigate(`/learn/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <BlogArticleCardContainer
      variant="outlined"
      onClick={handleClick}
      sx={styles}
    >
      {image.data ? (
        <BlogArticleCardImage
          src={`${baseUrl?.origin}${image.data?.attributes?.url}`}
          alt={image.data?.attributes?.alternativeText}
          draggable={false}
        />
      ) : (
        <Skeleton
          component="img"
          sx={{
            width: '100%',
            aspectRatio: 550 / 309,
            transform: 'unset',
            borderRadius: '16px',
            border: `1px solid ${getContrastAlphaColor(theme, '12%')}`,
          }}
        ></Skeleton>
      )}

      <BlogArticleCardContent>
        <BlogArticleCardTitle variant="lifiBodyLarge">
          {title}
        </BlogArticleCardTitle>
        <Box
          sx={{
            display: 'flex',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            marginTop: theme.spacing(2),
          }}
        >
          {tags?.data.slice(0, 1).map((tag) => (
            <BlogArticleTag variant="lifiBodyXSmall" as="span">
              {tag.attributes.Title}
            </BlogArticleTag>
          ))}
          <BlogArticleMetaContainer>
            <Typography
              variant="lifiBodyXSmall"
              component="span"
              fontSize={14}
              sx={{
                '&:after': {
                  content: '"•"',
                  margin: theme.spacing(0, 0.5),
                },
              }}
            >
              {formatDate(publishedAt || createdAt)}
            </Typography>
            <Typography variant="lifiBodyXSmall" component="span" fontSize={14}>
              {t('blog.minRead', { minRead: minRead })}
            </Typography>
          </BlogArticleMetaContainer>
        </Box>
      </BlogArticleCardContent>
    </BlogArticleCardContainer>
  );
};
