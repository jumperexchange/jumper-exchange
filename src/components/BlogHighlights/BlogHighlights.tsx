import type { Breakpoint, CSSObject } from '@mui/material';
import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  STRAPI_BLOG_ARTICLES,
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useStrapi, useUserTracking } from 'src/hooks';
import { EventTrackingTool, type BlogArticleData } from 'src/types';
import { formatDate, readingTime } from 'src/utils';
import {
  BlogHighlightsContent,
  BlogHighlightsDetails,
  BlogHighlightsImage,
  BlogHighlightsSubtitle,
  BlogHighlightsTitle,
  BlogHightsContainer,
} from '.';
import { Tag } from '../Tag.style';

interface BlogHighlightsProps {
  styles?: CSSObject;
}

export const BlogHighlights = ({ styles }: BlogHighlightsProps) => {
  const { trackEvent } = useUserTracking();
  const { data: featuredArticle, url } = useStrapi<BlogArticleData>({
    contentType: STRAPI_BLOG_ARTICLES,
    queryKey: ['blog-articles'],
    filterFeaturedArticle: true,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const handleClick = () => {
    trackEvent({
      category: TrackingCategory.Menu,
      label: 'click-join-discord-community-button',
      action: TrackingAction.OpenMenu,
      data: { [TrackingEventParameter.Menu]: 'lifi_discord' },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    navigate(`/blog/${featuredArticle[0].attributes.Slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const minRead =
    featuredArticle && readingTime(featuredArticle[0]?.attributes.Content);

  return (
    <BlogHightsContainer onClick={() => handleClick()}>
      {featuredArticle?.length > 0 ? (
        <>
          <BlogHighlightsImage
            draggable={false}
            src={`${url.origin}${featuredArticle[0]?.attributes.Image.data.attributes.url}`}
            alt={
              featuredArticle[0].attributes.Image.data.attributes
                .alternativeText
            }
          />
          <BlogHighlightsContent>
            <BlogHighlightsDetails>
              {featuredArticle[0].attributes.tags.data.slice(0, 1).map((el) => (
                <>
                  <Tag>
                    <Typography variant="lifiBodyMediumStrong">
                      {el.attributes.Title}
                    </Typography>
                  </Tag>
                </>
              ))}
              <Box
                sx={{
                  display: 'flex',
                  marginLeft: theme.spacing(3),
                  [theme.breakpoints.up('lg' as Breakpoint)]: {
                    marginTop: 0,
                    marginLeft: theme.spacing(3),
                  },
                }}
              >
                <Typography
                  variant="lifiBodyXSmall"
                  component="span"
                  color={
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[800]
                      : theme.palette.grey[300]
                  }
                  sx={{
                    '&:after': {
                      content: '"•"',
                      margin: '0 4px',
                    },
                  }}
                >
                  {formatDate(
                    featuredArticle[0].attributes.publishedAt ||
                      featuredArticle[0].attributes.createdAt,
                  )}
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
            </BlogHighlightsDetails>
            <Box>
              <BlogHighlightsTitle variant="lifiHeaderMedium">
                {featuredArticle[0].attributes.Title}
              </BlogHighlightsTitle>
            </Box>
            <Box>
              <BlogHighlightsSubtitle>
                {featuredArticle[0].attributes.Subtitle}
              </BlogHighlightsSubtitle>
            </Box>
          </BlogHighlightsContent>
        </>
      ) : (
        <>
          <Skeleton
            variant="rectangular"
            sx={{
              borderRadius: '14px',
              aspectRatio: 1.77,
              height: 432,
              userSelect: 'none',
              transform: 'unset',
              alignSelf: 'flex-start',
              boxShadow:
                theme.palette.mode === 'light'
                  ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
                  : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
              width: '54%',
              [theme.breakpoints.up('md' as Breakpoint)]: {
                alignSelf: 'center',
              },
            }}
          />
          <BlogHighlightsContent sx={{ width: '100%' }}>
            <BlogHighlightsDetails>
              <Skeleton
                variant="rectangular"
                sx={{ height: '48px', width: '108px', borderRadius: '24px' }}
              />
              <Skeleton
                sx={{
                  marginLeft: theme.spacing(3),
                  height: '16px',
                  width: '150px',
                }}
              />
            </BlogHighlightsDetails>
            <Skeleton
              sx={{
                margin: theme.spacing(4, 0),
                transform: 'unset',
                width: '100%',
                height: '112px',
              }}
            />
            <Skeleton sx={{ height: '64px' }} />
          </BlogHighlightsContent>
        </>
      )}
    </BlogHightsContainer>
  );
};
