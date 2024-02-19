import { Box, Typography } from '@mui/material';
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
  BlogHighlightsMetaContainer,
  BlogHighlightsMetaDate,
  BlogHighlightsSkeleton,
  BlogHighlightsSubtitle,
  BlogHighlightsTitle,
  BlogHightsContainer,
} from '.';
import { Tag } from '../../Tag.style';

export const BlogHighlights = () => {
  const { trackEvent } = useUserTracking();
  const { data: featuredArticle, url } = useStrapi<BlogArticleData>({
    contentType: STRAPI_BLOG_ARTICLES,
    queryKey: ['blog-articles'],
    filterFeaturedArticle: true,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const formatedDate =
    featuredArticle &&
    formatDate(
      featuredArticle[0].attributes.publishedAt ||
        featuredArticle[0].attributes.createdAt,
    );

  const minRead =
    featuredArticle && readingTime(featuredArticle[0]?.attributes.Content);

  return featuredArticle?.length > 0 ? (
    <BlogHightsContainer onClick={() => handleClick()}>
      <BlogHighlightsImage
        src={`${url.origin}${featuredArticle[0]?.attributes.Image.data.attributes.url}`}
        alt={
          featuredArticle[0].attributes.Image.data.attributes.alternativeText
        }
      />
      <BlogHighlightsContent>
        <BlogHighlightsDetails>
          {featuredArticle[0].attributes.tags.data
            .slice(0, 1)
            .map((el, index) => (
              <Tag key={`blog-highlights-tag-${index}`}>
                <Typography variant="lifiBodyMediumStrong">
                  {el.attributes.Title}
                </Typography>
              </Tag>
            ))}
          <BlogHighlightsMetaContainer>
            <BlogHighlightsMetaDate variant="lifiBodyXSmall" component="span">
              {formatedDate}
            </BlogHighlightsMetaDate>
            <Typography variant="lifiBodyXSmall" component="span">
              {t('blog.minRead', { minRead: minRead })}
            </Typography>
          </BlogHighlightsMetaContainer>
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
    </BlogHightsContainer>
  ) : (
    <BlogHighlightsSkeleton />
  );
};
