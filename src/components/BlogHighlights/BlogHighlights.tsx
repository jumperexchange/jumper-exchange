import type { Breakpoint, CSSObject } from '@mui/material';
import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { STRAPI_BLOG_ARTICLES } from 'src/const';
import { useStrapi, useUserTracking } from 'src/hooks';
import type { BlogArticleData } from 'src/types';
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
  const [load, setLoad] = useState(false);
  const { data: blogArticles, url } = useStrapi<BlogArticleData>({
    contentType: STRAPI_BLOG_ARTICLES,
    queryKey: ['blog-articles'],
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const handleClick = () => {
    setLoad((prev) => !prev);
    console.log('prev', load);
    // trackEvent({
    //   category: TrackingCategory.Menu,
    //   label: 'click-join-discord-community-button',
    //   action: TrackingAction.OpenMenu,
    //   data: { [TrackingEventParameter.Menu]: 'lifi_discord' },
    //   disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    // });
    // navigate(`/blog/${blogArticles[0].attributes.Slug}`);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const minRead =
    blogArticles && readingTime(blogArticles[0]?.attributes.Content);

  return (
    <BlogHightsContainer onClick={() => handleClick()}>
      {load && blogArticles?.length > 0 ? (
        <>
          <BlogHighlightsImage
            draggable={false}
            src={`${url.origin}${blogArticles[0]?.attributes.Image.data.attributes.url}`}
            alt={
              blogArticles[0].attributes.Image.data.attributes.alternativeText
            }
          />
          <BlogHighlightsContent>
            <BlogHighlightsDetails>
              {blogArticles[0].attributes.tags.data.slice(0, 1).map((el) => (
                <>
                  <Tag>
                    <Typography variant="lifiBodyMediumStrong">
                      {el.attributes.Title}
                    </Typography>
                  </Tag>
                </>
              ))}
              <Typography
                variant="lifiBodyXSmall"
                component="span"
                color={
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300]
                }
                sx={{
                  marginLeft: theme.spacing(3),
                  '&:after': {
                    content: '"•"',
                    margin: '0 4px',
                  },
                }}
              >
                {formatDate(
                  blogArticles[0].attributes.publishedAt ||
                    blogArticles[0].attributes.createdAt,
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
            </BlogHighlightsDetails>
            <Box>
              <BlogHighlightsTitle variant="lifiHeaderMedium">
                {blogArticles[0].attributes.Title}
              </BlogHighlightsTitle>
            </Box>
            <Box>
              <BlogHighlightsSubtitle>
                {blogArticles[0].attributes.Subtitle}
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
