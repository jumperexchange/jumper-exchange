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
import { BlogArticleCardContainer, BlogArticleCardImage } from '.';

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
    navigate(`/blog/${slug}`);
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
          sx={{
            width: '100%',
            height: 240,
            transform: 'unset',
            borderRadius: '16px',
            border: `1px solid ${getContrastAlphaColor(theme, '12%')}`,
          }}
        ></Skeleton>
      )}

      <CardContent sx={{ padding: theme.spacing(3, 0) }}>
        <Box
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}
        >
          {tags?.data.slice(0, 1).map((tag) => (
            <Typography
              noWrap
              variant="lifiBodyXSmall"
              component="span"
              sx={{
                color:
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300],
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '32px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                height: '64px',
                ':not(:first-of-type)': {
                  marginLeft: theme.spacing(0.5),
                },
              }}
            >
              {tag.attributes.Title}
            </Typography>
          ))}
        </Box>
        <Box>
          <Typography
            variant="lifiBodyLarge"
            sx={{
              color: 'inherit',
              marginTop: theme.spacing(1),
              fontWeight: 700, //todo: use typography
              fontSize: '24px',
              fontFamily: 'Urbanist, Inter',
              lineHeight: '32px',
              minHeight: '64px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              '-webkit-line-clamp': '2',
              '-webkit-box-orient': 'vertical',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box sx={{ marginTop: theme.spacing(2) }}>
          <Typography
            variant="lifiBodyXSmall"
            component="span"
            sx={{
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(0.5),
              color:
                theme.palette.mode === 'light'
                  ? theme.palette.grey[800]
                  : theme.palette.grey[300],
              '&:after': {
                content: '"•"',
                margin: '0 4px',
              },
            }}
          >
            {formatDate(publishedAt || createdAt)}
          </Typography>
          <Typography
            variant="lifiBodyXSmall"
            component="span"
            color={
              theme.palette.mode === 'light'
                ? theme.palette.grey[800]
                : theme.palette.grey[300]
            }
          >
            {t('blog.minRead', { minRead: minRead })}
          </Typography>
        </Box>
      </CardContent>
    </BlogArticleCardContainer>
  );
};
