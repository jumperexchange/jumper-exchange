import type { CSSObject } from '@mui/material';
import {
  Box,
  CardContent,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
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
  BlogArticleCardImage,
  BlogArticleCardTitle,
  BlogArticleTag,
} from '.';

interface BlogArticleCardProps {
  baseUrl: URL;
  id: number;
  key?: string;
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
  key,
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
      key={key || 'blog-article-card'}
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
            aspectRatio: 1.6, // 1.782,
            // height: 240,
            transform: 'unset',
            borderRadius: '16px',
            border: `1px solid ${getContrastAlphaColor(theme, '12%')}`,
          }}
        ></Skeleton>
      )}

      <CardContent
        sx={{
          margin: 0,
          padding: theme.spacing(2, 0),
          '&:last-child': { paddingBottom: theme.spacing(1) },
        }}
      >
        <Box>
          <BlogArticleCardTitle variant="lifiBodyLarge">
            {title}
          </BlogArticleCardTitle>
        </Box>
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
            <BlogArticleTag noWrap variant="lifiBodyXSmall" as="span">
              {tag.attributes.Title}
            </BlogArticleTag>
          ))}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: theme.spacing(2),
              color:
                theme.palette.mode === 'light'
                  ? theme.palette.grey[800]
                  : theme.palette.grey[300],
            }}
          >
            <Typography
              variant="lifiBodyXSmall"
              component="span"
              sx={{
                '&:after': {
                  content: '"•"',
                  margin: '0 4px',
                },
              }}
            >
              {formatDate(publishedAt || createdAt)}
            </Typography>
            <Typography variant="lifiBodyXSmall" component="span">
              {t('blog.minRead', { minRead: minRead })}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </BlogArticleCardContainer>
  );
};
